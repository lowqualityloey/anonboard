# Production Deployment & Environment Guide: AnonBoard

## 1. Hosting Architecture Overview
- **Framework**: TanStack Start (Nitro + Vite 8 + React 19)
- **Database**: Supabase Postgres with PgBouncer Connection Pooling
- **Deployment Target**: Vercel (Node.js Serverless Function Runtime)

---

## 2. Environment Variables Configuration

Set the following environment variables in the **Vercel Project Settings $\rightarrow$ Environment Variables**:

| Variable | Target Environments | Description / Example |
|---|---|---|
| `DATABASE_URL` | Production, Preview, Development | **Pooled connection string** (port 6543, pgbouncer=true, connection_limit=1).<br>`postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Production, Preview, Development | **Direct connection string** (port 5432) for running migrations.<br>`postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `ADMIN_PASSWORD` | Production, Preview | Strong secret password to unlock `/admin` moderation. |
| `SESSION_SECRET` | Production, Preview | High-entropy random secret string (e.g. 64-char hex) used to sign HMAC admin cookies. |

---

## 3. Build & Install Configuration (Vercel Dashboard)
- **Framework Preset**: Other / Vite
- **Build Command**: `npm run build`
- **Output Directory**: `.output/public`
- **Install Command**: `npm install --legacy-peer-deps --no-audit --no-fund`

---

## 4. Pre-Deployment Database Migrations & Seeding

Before your first deployment or when schema changes occur, run migrations against Supabase:

```bash
# Apply pending schema migrations
npm run db:deploy

# (Optional) Seed default boards (General, Tech, Random, Study)
npm run db:seed
```

---

## 5. Verification Checklist

1. **Board Directory (`/`)**: Confirms database connection and displays seeded boards with thread counts.
2. **Thread Creation (`/b/$slug/new`)**: Posts a new thread and automatically sets an anonymous identity cookie (`anon_id`).
3. **Thread Detail & Replies (`/t/$id`)**: Shows original post and replies with deterministic `Anon [hash]` tags.
4. **Live Polling**: Replies dynamically poll every 12 seconds in the foreground.
5. **Admin Moderation (`/admin`)**: Logs in with `ADMIN_PASSWORD` and enables soft-delete / locking capabilities.
