# AnonBoard

A high-performance, lightweight anonymous discussion board. Users browse boards, create threads, and participate in discussions without creating an account.

- **Live Demo**: [https://anonboard-tau.vercel.app](https://anonboard-tau.vercel.app)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Design Tokens**: See [DESIGN.md](./DESIGN.md)
- **Deployment Guide**: See [docs/releases/deployment.md](./docs/releases/deployment.md)

---

## Features

- **Anonymous Discussions**: Create threads and submit replies without registration or email.
- **Multiple Boards**: Organized by topic (`/b/general`, `/b/study`, `/b/random`).
- **Deterministic Identity Tags**: Stable, per-thread anonymous identity badges (e.g. `Anon 7f3a`) derived from a secure cookie and thread ID.
- **Near-Real-Time Updates**: Background polling powered by TanStack Query keeps discussions synchronized.
- **Admin Moderation (`/admin`)**: Password-protected dashboard with soft-deletions and thread locking/unlocking with instant optimistic UI feedback.
- **High-Performance Architecture**: SSR via TanStack Start, client-side route preloading, Tailwind CSS v4 `@theme` design tokens, and Sydney edge serverless function routing (`syd1`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework / SSR | [TanStack Start](https://tanstack.com/start) + [Nitro](https://nitro.unjs.io/) |
| UI Library | React 19 |
| Routing & Cache | [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma ORM |
| Database | Supabase Postgres (PgBouncer Pooler) |
| Validation | Zod |
| Hosting | Vercel (Edge Functions in `syd1`) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (or any PostgreSQL instance)

### 1. Clone & Install

```bash
git clone https://github.com/lowqualityloey/anonboard.git
cd anonboard
npm install
```

### 2. Database & Environment Configuration

Create a `.env` file in the root directory:

```env
# Runtime connection (Supabase Transaction Pooler - IPv4 compatible, port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Migrations & CLI schema push (Supabase Session Pooler - port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Admin Moderation Credentials
ADMIN_PASSWORD="your-strong-admin-password"
SESSION_SECRET="your-high-entropy-random-session-secret"
```

> [!TIP]
> Generate a strong `SESSION_SECRET` with:
> ```bash
> openssl rand -base64 32
> ```

### 3. Initialize Database & Seed Boards

Push the schema and seed the default discussion boards:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npx prisma db push

# Seed initial boards (/b/general, /b/study, /b/random)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite dev` | Starts local development server on port 3000 |
| `npm run build` | `prisma generate && vite build` | Builds client and SSR Nitro bundle for production |
| `npm run preview` | `vite preview` | Previews production build locally |
| `npm run start` | `node .output/server/index.mjs` | Starts built Nitro Node.js production server |
| `npm run typecheck` | `tsc --noEmit` | Runs full TypeScript type check |
| `npm run db:generate` | `prisma generate` | Generates the Prisma Client |
| `npm run db:migrate` | `prisma migrate dev` | Creates and applies development migrations |
| `npm run db:deploy` | `prisma migrate deploy` | Applies pending migrations in CI / production |
| `npm run db:seed` | `prisma db seed` | Seeds default boards (`/b/general`, `/b/study`, `/b/random`) |

---

## Project Structure

```text
anonboard/
├── prisma/
│   ├── schema.prisma          # Database models (Board, Thread, Post)
│   └── seed.ts                # Default boards seed script
├── src/
│   ├── components/            # UI components (Header, ReplyForm, ThreadRow)
│   ├── lib/
│   │   ├── anon.ts            # Anonymous identity cookie & deterministic hash
│   │   └── validation.ts      # Zod validation schemas
│   ├── routes/                # TanStack file-based routes
│   │   ├── __root.tsx         # HTML shell & QueryClient provider
│   │   ├── index.tsx          # Board directory & admin link
│   │   ├── admin.tsx          # Moderation dashboard (soft-delete, lock/unlock)
│   │   ├── b.$slug.index.tsx  # Board thread listing
│   │   ├── b.$slug.new.tsx    # Create thread form
│   │   └── t.$id.tsx          # Thread detail with live polling replies
│   ├── server/                # Server-only logic & RPCs
│   │   ├── auth.ts            # HMAC signed admin session cookies
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── fns/               # TanStack Start createServerFn handlers
│   │   └── queries/           # Read queries (boards, threads, posts)
│   ├── styles/
│   │   └── app.css            # Tailwind CSS v4 configuration & @theme tokens
│   └── router.tsx             # TanStack Router configuration & intent preloading
├── vercel.json                # Vercel serverless function regional routing (syd1)
├── ARCHITECTURE.md            # System architecture & invariants
├── DESIGN.md                  # Semantic token palette & typography
└── README.md                  # Project documentation
```

---

## Production Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Configure Environment Variables in **Project Settings → Environment Variables**:
   - `DATABASE_URL`: Supabase transaction pooler URL (port `6543`) with `?pgbouncer=true&connection_limit=1`.
   - `DIRECT_URL`: Supabase session pooler URL (port `5432`).
   - `ADMIN_PASSWORD`: Your admin panel password.
   - `SESSION_SECRET`: Secret string for HMAC session cookie signing.
4. Set Build Settings:
   - **Framework Preset**: Other / Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
5. Deploy. Serverless functions will automatically run close to users in Sydney (`syd1`) as defined in [`vercel.json`](./vercel.json).

---

## Verification & Manual Testing

1. **Board Directory (`/`)**: Verify boards are listed with their respective thread and post counts.
2. **Create Thread (`/b/general/new`)**: Submit a thread. The form shows an instant loading spinner and redirects to `/t/:id`.
3. **Deterministic Anonymous Tag**: Your post displays an `Anon [hash]` badge. Replies from the same browser maintain the same badge in that thread.
4. **Live Polling**: Open the thread in a second window or private tab, reply, and watch the original window update automatically within 12 seconds.
5. **Admin Moderation (`/admin`)**: Log in with `ADMIN_PASSWORD` to lock threads or soft-delete abusive threads and posts with instant feedback.

---

## Troubleshooting

- **`Error: P1001: Can't reach database server`**:
  - The direct Supabase hostname (`db.[ref].supabase.co`) requires IPv6. If your network or environment is IPv4-only, use the Supabase Pooler host: `aws-0-[region].pooler.supabase.com`.
- **`prepared statement "s0" already exists`**:
  - Add `?pgbouncer=true` to your pooled `DATABASE_URL`.
- **`Max client connections reached`**:
  - Add `&connection_limit=1` to the query string in `DATABASE_URL` to limit per-serverless-function connections on Prisma.
- **Missing `/b/[slug]/new` route**:
  - Ensure the board index route is named `b.$slug.index.tsx` so `b.$slug.new.tsx` is recognized as a sibling leaf route.

---

## License

This project is licensed under the [MIT License](./LICENSE) © 2026 Jonell Balanay.