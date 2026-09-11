# ARCHITECTURE.md

Software architecture for AnonBoard. Stack, data flow, schema, routes, auth,
deployment, and decisions.

Related: [README.md](./README.md) · [DESIGN.md](./DESIGN.md)

---

## 1. Overview

AnonBoard is a lightweight anonymous discussion board. Users browse boards, create
threads, and reply without accounts. Built with **TanStack Start**, **TypeScript**,
**Tailwind CSS v4**, **Prisma**, and **Supabase Postgres**, deployed on **Vercel**.

The system stays simple: file-based routes, route loaders for server data, server
functions for mutations, TanStack Query for polling, and a small Postgres database.

---

## 2. Goals

- Anonymous thread creation and replies.
- Multiple boards (General, Study, Random).
- Thread list with title, preview, reply count, last activity.
- Stable anonymous tag per user per thread.
- Simple admin soft-delete.
- Deploy on Vercel.
- Beginner-to-intermediate friendly codebase.

## 3. Non-Goals

- Real-time WebSocket chat.
- User accounts, profiles, or private messages.
- Media uploads.
- Ranking, recommendations, ML.
- Microservices, Docker, Kubernetes.
- Full RBAC, audit logs, moderation queue.

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| UI library | React |
| Meta-framework | TanStack Start (Vite + Nitro) |
| Router | TanStack Router (file-based, type-safe) |
| Client cache | TanStack Query (polling + invalidation) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma |
| Database | Supabase Postgres |
| Hosting | Vercel |
| Mutations | TanStack Start server functions |
| Validation | Zod |
| Admin auth | Env password + signed httpOnly cookie |

Optional later: Upstash Redis for rate limiting; `rehype-sanitize` if Markdown is added.

---

## 5. Architecture

```text
Browser (React)
  |
  |-- Route loaders  -> server fn / Prisma -> Supabase
  |-- TanStack Query -> server fn / Prisma -> Supabase   (polling)
  |-- Server fns     -> validation -> Prisma -> Supabase (mutations)
```

Rules:
- Page-level data fetching happens in **route loaders**, not `useEffect`.
- Client-side live updates go through **TanStack Query** with `refetchInterval`.
- Mutations use **server functions** (`createServerFn`) then invalidate the relevant query.
- Prisma lives in `src/server/db.ts` and is never imported on the client.
- Queries live in `src/server/queries/*.ts`.

---

## 6. Project Structure

```text
src/
  routes/
    __root.tsx                    # App shell
    index.tsx                     # Board list
    b.$slug.tsx                   # Thread list
    b.$slug.new.tsx               # Create thread
    t.$id.tsx                     # Thread + replies
    admin.tsx                     # Admin moderation
  server/
    db.ts                         # Prisma singleton
    auth.ts                       # Admin cookie session
    anon.ts                       # Anonymous name generation
    queries/
      boards.ts
      threads.ts
      posts.ts
    fns/
      createThread.ts
      createPost.ts
      adminDelete.ts
      pollThread.ts
  components/
    ui/                           # Button, Card, Input, etc.
    ThreadRow.tsx
    PostCard.tsx
    ReplyForm.tsx
  styles/
    app.css                       # Tailwind + @theme tokens (see DESIGN.md)
  lib/
    validation.ts                 # Zod schemas
prisma/
  schema.prisma
  seed.ts
```

---

## 7. Prisma + Supabase

Supabase provides two connection strings:

- **Pooled** (port `6543`, pgbouncer) — runtime on Vercel.
- **Direct** (port `5432`) — migrations only.

```env
# Runtime (Vercel)
DATABASE_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Migrations (local / CI)
DIRECT_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Singleton (required on serverless):

```ts
// src/server/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 8. Data Model

```prisma
model Board {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  threads     Thread[]
}

model Thread {
  id        String   @id @default(cuid())
  boardId   String
  title     String
  body      String
  anonName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isLocked  Boolean  @default(false)
  isDeleted Boolean  @default(false)
  board     Board    @relation(fields: [boardId], references: [id])
  posts     Post[]

  @@index([boardId, updatedAt])
}

model Post {
  id        String   @id @default(cuid())
  threadId  String
  body      String
  anonName  String
  createdAt DateTime @default(now())
  isDeleted Boolean  @default(false)
  thread    Thread   @relation(fields: [threadId], references: [id])

  @@index([threadId, createdAt])
}
```

---

## 9. Routes

| Route | Purpose |
|---|---|
| `/` | Board list |
| `/b/[slug]` | Thread list for a board |
| `/b/[slug]/new` | Create thread form |
| `/t/[id]` | Thread view + replies |
| `/admin` | Admin moderation |

Loader example:

```ts
// routes/t.$id.tsx
export const Route = createFileRoute("/t/$id")({
  loader: ({ params }) => getThreadWithPosts({ data: { id: params.id } }),
  component: ThreadPage,
});
```

---

## 10. Server Functions

All mutations go through `createServerFn` with Zod validation.

```ts
// server/fns/createPost.ts
export const createPost = createServerFn({ method: "POST" })
  .validator(createPostSchema)
  .handler(async ({ data }) => {
    const anonName = await resolveAnonName(data.threadId);
    return prisma.post.create({
      data: { threadId: data.threadId, body: data.body, anonName },
    });
  });
```

After success:
- `router.invalidate()` for loader-backed views.
- `queryClient.invalidateQueries({ queryKey: ["thread", id] })` for Query-backed views.

---

## 11. Polling

Thread page polls every 12 seconds via TanStack Query. No WebSockets, no SSE.

```ts
const { data: posts } = useQuery({
  queryKey: ["thread", threadId],
  queryFn: () => pollThread({ data: { id: threadId } }),
  refetchInterval: 12_000,
  refetchIntervalInBackground: false,
});
```

---

## 12. Anonymous Identity

1. On first request, set cookie `anon_id` = random UUID (httpOnly, 1 year).
2. On post, compute `Anon ` + `hash(anon_id + threadId).slice(0, 4)`.
3. Store on the post/thread.

Same user, same thread → same tag. Different thread → different tag. No account required.

---

## 13. Admin Auth

- Password stored in `ADMIN_PASSWORD`.
- On login, server sets a signed httpOnly cookie using `SESSION_SECRET`.
- Cookie flags: `httpOnly`, `secure`, `sameSite=lax`.
- Every admin server function verifies the cookie before acting.
- Deletes are soft (`isDeleted = true`).

---

## 14. Moderation and Safety

- React escapes output by default; post bodies are plain text for MVP.
- If Markdown is added later, sanitize with `rehype-sanitize`.
- Rate limiting:
  - MVP: count posts by hashed IP + time window in Postgres.
  - Production: Upstash Redis recommended.
- Soft-delete with `isDeleted`.
- Optional: report button feeding a future moderation queue.

---

## 15. Deployment on Vercel

Env vars:

```env
DATABASE_URL="...pooler...?pgbouncer=true&connection_limit=1"
DIRECT_URL="...direct..."
ADMIN_PASSWORD="change-me"
SESSION_SECRET="long-random-string"
```

Build:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

Notes:
- `prisma generate` must run before `build` (Vercel postinstall hook works).
- `prisma migrate deploy` in the build blocks deploys on bad migrations. For a solo
  project that's fine; for shared work, move it to CI.
- Vercel is serverless — always use the pooled URL at runtime.
- Supabase free tier pauses on inactivity. First request after a pause is slow.

---

## 16. Milestones

1. Scaffold TanStack Start + TS + Tailwind v4.
2. Add Prisma + Supabase schema, seed boards.
3. Board list + thread list via route loaders.
4. Create thread (server fn + `router.invalidate`).
5. Reply (server fn + query invalidation).
6. Anonymous name generation.
7. Polling with TanStack Query.
8. Admin login + soft-delete.
9. Deploy to Vercel.

---

## 17. Future Extensions

- Image uploads (Supabase Storage).
- Tags / categories.
- Upvote / downvote.
- Markdown replies with `rehype-sanitize`.
- SSE or WebSocket for real-time updates.
- Moderation queue + reports.
- Search (Postgres full-text search).