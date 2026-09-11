# AnonBoard

A lightweight anonymous discussion board. Users browse boards, create threads, and
reply without creating an account.

- **Architecture** — see [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Design tokens** — see [DESIGN.md](./DESIGN.md)

---

## Features

- Anonymous thread creation and replies
- Multiple boards (General, Study, Random)
- Thread list with title, preview, reply count, and last activity
- Stable anonymous tag per user per thread (e.g. `Anon 7f3a`)
- Near-real-time replies via polling
- Admin moderation: soft-delete threads and posts
- Dark, minimal UI driven by design tokens

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React |
| Meta-framework | TanStack Start |
| Router | TanStack Router (file-based, type-safe) |
| Client cache | TanStack Query |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma |
| Database | Supabase Postgres |
| Hosting | Vercel |
| Validation | Zod |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (free tier is fine)

### 1. Clone and install

```bash
git clone https://github.com/<you>/anonboard.git
cd anonboard
npm install
```

### 2. Create a Supabase project

1. Go to https://supabase.com and create a new project.
2. Open **Project Settings → Database → Connection string**.
3. Copy two strings:
   - **Transaction pooler** (port `6543`) → runtime
   - **Direct connection** (port `5432`) → migrations

### 3. Configure environment

Create `.env` in the repo root:

```env
# Runtime — pooled connection (port 6543)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Migrations only — direct connection (port 5432)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Admin
ADMIN_PASSWORD="change-me"
SESSION_SECRET="generate-a-long-random-string"
```

Generate a session secret:

```bash
openssl rand -base64 32
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

`db:seed` inserts the default boards (General, Study, Random).

### 5. Run the dev server

```bash
npm run dev
```

App runs at http://localhost:3000.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create + apply a dev migration |
| `npm run db:deploy` | Apply migrations (prod / CI) |
| `npm run db:seed` | Seed default boards |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```text
src/
  routes/                      # File-based routes
  server/                      # Prisma, auth, queries, server functions
  components/                  # UI components
  styles/app.css               # Tailwind + @theme tokens
  lib/validation.ts            # Zod schemas
prisma/
  schema.prisma
  seed.ts
ARCHITECTURE.md
DESIGN.md
README.md
```

Full breakdown in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Design System

All colors, spacing, radius, shadow, motion, and z-index are defined as tokens in
[DESIGN.md](./DESIGN.md) and wired into Tailwind v4 via `@theme` in
`src/styles/app.css`.

Use **semantic** tokens in components:

```html
<article class="bg-surface border border-border rounded-lg p-4">
  <h2 class="text-lg font-semibold text-text">Thread title</h2>
  <p class="text-sm text-text-muted font-mono">Anon 7f3a · 2h ago</p>
</article>
```

Prefer `bg-surface` over `bg-gray-900`. Prefer `text-text-muted` over `text-gray-400`.
If you reach for the same raw palette value twice, add a token.

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Add environment variables in **Project → Settings → Environment Variables**:

   ```
   DATABASE_URL      # pooled, port 6543
   DIRECT_URL        # direct, port 5432
   ADMIN_PASSWORD
   SESSION_SECRET
   ```

4. Set the build command:

   ```
   prisma generate && prisma migrate deploy && npm run build
   ```

   Or run `prisma migrate deploy` as a separate CI step to keep builds fast.

5. Deploy.

See [ARCHITECTURE.md § Deployment](./ARCHITECTURE.md) for notes on pooling,
serverless, and Supabase free-tier behavior.

---

## Testing the App

Manual smoke test after first run:

1. Open `/` — you should see seeded boards.
2. Open a board → click **New Thread** → submit.
3. You should land on `/t/<id>` with your thread and an `Anon xxxx` tag.
4. Reply to your own thread — same `Anon xxxx` tag appears.
5. Open the same thread in a private window and reply — different tag.
6. Visit `/admin`, log in, delete a post, confirm it disappears.

---

## Roadmap

- [x] Boards, threads, replies
- [x] Anonymous tags
- [x] Admin soft-delete
- [x] Polling
- [ ] Rate limiting (Upstash Redis)
- [ ] Report button + moderation queue
- [ ] Markdown replies with `rehype-sanitize`
- [ ] Image uploads (Supabase Storage)
- [ ] Full-text search (Postgres FTS)
- [ ] Optional: SSE for real-time updates

---

## Troubleshooting

**`Error: P1001: Can't reach database server`**
Check that `DATABASE_URL` uses the pooler host and port `6543`, and that the
Supabase project isn't paused.

**`prepared statement "s0" already exists`**
You're hitting the pooler without `?pgbouncer=true`. Add it to `DATABASE_URL`.

**`Too many connections`**
Missing `&connection_limit=1` on the pooled URL, or not using the Prisma singleton.

**Migrations hang or time out**
Use the direct URL (`DIRECT_URL`) for migrations — the pooler doesn't support
all DDL operations.

---

## License

MIT.