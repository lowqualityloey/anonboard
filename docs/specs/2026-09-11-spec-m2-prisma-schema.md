# Technical Design Document (RFC): Milestone 2 — Prisma Schema, Supabase Configuration & Board Seeding

- **Author**: Antigravity & Lead Engineer
- **Status**: Approved
- **Created**: 2026-09-11
- **Target Release**: Milestone 2 (Data & Persistence Layer)

---

## Planning Record (PromptKit Adaptation)

<a id="PLAN-m2-prisma-schema"></a>

### Planning Record Metadata
- **Planning Record ID**: `PLAN-m2-prisma-schema`
- **Planning Depth**: `Full`
- **Owner**: AnonBoard Core Team
- **Record Status**: `ready`
- **Local Task Record Link**: `[TASK-M2-01](../tasks/2026-09-11-task-m2-prisma-schema.md#TASK-M2-01)`
- **Workflow Links**: `[ARCHITECTURE.md](../../ARCHITECTURE.md)` · `[PROMPTKIT.md](../../PROMPTKIT.md)`

### Planning Inputs
- **Requested Outcome**: Prisma ORM setup configured for Supabase Postgres with connection pooling, models (`Board`, `Thread`, `Post`), database client singleton with serverless pooling guard, and board seeding script.
- **Observable Completion Condition**:
  1. `prisma/schema.prisma` exists with exact models, relations, and composite indices (`[boardId, updatedAt]`, `[threadId, createdAt]`).
  2. `npx prisma generate` succeeds and generates strongly typed Prisma Client types.
  3. `src/server/db.ts` exports singleton Prisma Client with `globalThis` preservation.
  4. `.env.example` documents `DATABASE_URL`, `DIRECT_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
  5. `prisma/seed.ts` is configured and executable via `npm run db:seed`.
  6. `npm run typecheck` passes with zero errors.
- **Scope Boundary**:
  - **In Scope**: `prisma/schema.prisma`, `src/server/db.ts`, `prisma/seed.ts`, `.env.example`, `package.json` scripts (`db:generate`, `db:seed`), `tsx`, `prisma`, `@prisma/client`.
  - **Excluded**: Live Supabase migration execution (requires live user DB credentials in local `.env`), route loaders (Milestone 3), UI wiring.
- **TDD Enforcement Proposal**: `disabled` (Schema definition, ORM code generation, seed scaffolding).

### Full Planning
- **Explicit Non-Goals**:
  - Do not execute live database migrations against production without configured Supabase credentials.
  - Do not import `prisma` in any client-side file.
- **Affected Behavioral Components**:
  - Data layer: `prisma/schema.prisma`, `src/server/db.ts`, `prisma/seed.ts`
  - Dependencies: `@prisma/client`, `prisma`, `tsx`
  - Secrets template: `.env.example`
- **Externally Visible Contracts**:
  - Prisma client generated types exported from `@prisma/client`.
  - Typed queries can be written against `prisma.board`, `prisma.thread`, and `prisma.post`.
- **Failure or Rollback Considerations**:
  - Serverless connection pool exhaustion: Mitigated by `pgbouncer=true&connection_limit=1` in `DATABASE_URL` and `globalThis` singleton caching in `src/server/db.ts`.
- **Verification Approach**:
  - `npx prisma validate` to confirm schema validity.
  - `npx prisma generate` to confirm client compilation.
  - `npm run typecheck` to confirm `src/server/db.ts` and `prisma/seed.ts` have zero TypeScript diagnostic errors.

---

## 1. Problem Statement & Context
AnonBoard requires a structured, relational schema for anonymous discussions. To ensure fast queries on active boards and threads while supporting serverless deployments on Vercel, Prisma ORM is paired with Supabase Postgres. Composite indices on `[boardId, updatedAt]` and `[threadId, createdAt]` ensure thread listings and chronologically ordered replies scale smoothly.

---

## 2. Data Models

### `Board`
- `id`: String (cuid, primary key)
- `name`: String (display name, e.g. "General")
- `slug`: String (unique URL slug, e.g. "general")
- `description`: String? (optional summary)
- `createdAt`: DateTime (default now)
- `threads`: Relation to `Thread[]`

### `Thread`
- `id`: String (cuid, primary key)
- `boardId`: String (foreign key $\rightarrow$ `Board.id`)
- `title`: String
- `body`: String
- `anonName`: String (e.g. "Anon a3f1")
- `createdAt`: DateTime (default now)
- `updatedAt`: DateTime (updated on reply)
- `isLocked`: Boolean (default false)
- `isDeleted`: Boolean (default false, soft delete)
- `board`: Relation to `Board`
- `posts`: Relation to `Post[]`
- **Index**: `@@index([boardId, updatedAt])`

### `Post`
- `id`: String (cuid, primary key)
- `threadId`: String (foreign key $\rightarrow$ `Thread.id`)
- `body`: String
- `anonName`: String (e.g. "Anon a3f1")
- `createdAt`: DateTime (default now)
- `isDeleted`: Boolean (default false, soft delete)
- `thread`: Relation to `Thread`
- **Index**: `@@index([threadId, createdAt])`

---

## 3. Implementation Steps & Verification
1. Add `@prisma/client` and `prisma`, `tsx` to `package.json`.
2. Generate `.env.example` with Supabase pooled & direct URL templates.
3. Write `prisma/schema.prisma` with postgresql provider, directUrl support, and models.
4. Write `src/server/db.ts` with serverless singleton pattern.
5. Write `prisma/seed.ts` seeding General, Study, and Random boards.
6. Run `npx prisma generate` and verify client generation.
7. Run `npm run typecheck` to ensure full type alignment.
