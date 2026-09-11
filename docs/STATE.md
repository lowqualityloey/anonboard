# Project State & Living Execution Tracker

## 1. Executive Summary & Current Position
- **Project Name**: AnonBoard
- **Current Milestone / Epic**: Complete (All Milestones 1–9 Shipped & Verified)
- **Overall Status**: SHIPPED <!-- Options: ACTIVE | PAUSED | STABILIZING | RELEASE_CANDIDATE | SHIPPED -->
- **Target Release / Deadline**: MVP (Live in Production)
- **Live Production URL**: [https://anonboard-tau.vercel.app](https://anonboard-tau.vercel.app)
- **Current Working Branch**: main
- **Last Updated**: 2026-09-12




---

## 2. Milestone & Task Progress

### Milestone Roadmap (from ARCHITECTURE.md)
- [x] **Milestone 1**: Scaffold TanStack Start + TS + Tailwind v4 (Complete)
- [x] **Milestone 2**: Add Prisma + Supabase schema & seed boards (Complete)
- [x] **Milestone 3**: Board list + thread list via route loaders (Complete)
- [x] **Milestone 4**: Create thread (server function + `router.invalidate`) (Complete)
- [x] **Milestone 5**: Reply functionality (server function + query invalidation) (Complete)
- [x] **Milestone 6**: Anonymous identity & deterministic name generation (Complete)
- [x] **Milestone 7**: Polling with TanStack Query (12s interval) (Complete)
- [x] **Milestone 8**: Admin login + soft-delete moderation (Complete)
- [x] **Milestone 9**: Deploy to Vercel (Complete)

### Milestone 9 Tasks (Complete)
- [x] `TASK-M9-01`: Production build configuration, Prisma postinstall hook, and Vercel guide (#12) (`#priority/p0`)







---

## 3. Active Working Set
- **Target Workspace / Package**: Standalone Repository
- **Active Spec**: [`ARCHITECTURE.md`](file:///c:/Users/jonel/Projects/anonboard/ARCHITECTURE.md)
- **Active Design Guide**: [`DESIGN.md`](file:///c:/Users/jonel/Projects/anonboard/DESIGN.md)
- **Key Source Files in Flight**:
  - `package.json` (Pending scaffold)
  - `src/styles/app.css` (Pending styling setup)
  - `src/routes/__root.tsx` (Pending root route)
- **Verification Commands**:
  - Dev Server: `npm run dev`
  - Build: `npm run build`
  - Typecheck: `npm run typecheck`

---

## 4. Locked Technical Invariants (Do Not Undo)
- [Invariant 1]: Route loaders handle all page-level data fetching; no raw `useEffect` fetching.
- [Invariant 2]: Mutations must execute via TanStack Start `createServerFn` with Zod validation.
- [Invariant 3]: Prisma client lives in `src/server/db.ts` and is never imported into client-side code.
- [Invariant 4]: Anonymous tag generation must be deterministic per user-thread pairing (`Anon ` + `hash(anon_id + threadId).slice(0, 4)`).
- [Invariant 5]: All styling must use semantic tokens (`bg-surface`, `text-text`, `bg-accent`) from `DESIGN.md`.
- [Invariant 6]: Thread and post deletions must be soft deletions (`isDeleted = true`).

---

## 5. Known Blockers, Risks & Open Questions
- **Blockers**: None.
- **Architectural Questions**: None; system architecture and design tokens are fully documented in `ARCHITECTURE.md` and `DESIGN.md`.
- **Technical Debt & Risks**:
  - Supabase free tier connection limits on serverless: ensure pooled connection string with `connection_limit=1` is strictly used for Vercel deployment.

---

## 6. Recent Architectural Decisions (ADR Log)
| Date | Title & Scope | Decision Summary | ADR File |
| :--- | :--- | :--- | :--- |
| 2026-09-11 | Technology Stack Selection | Adopted TanStack Start, React 19, Tailwind v4, Prisma, Supabase Postgres | [`ARCHITECTURE.md`](file:///c:/Users/jonel/Projects/anonboard/ARCHITECTURE.md) |
| 2026-09-11 | Design System & Token Architecture | Adopted Tailwind v4 `@theme` with semantic surface/accent/danger tokens | [`DESIGN.md`](file:///c:/Users/jonel/Projects/anonboard/DESIGN.md) |

---

## 7. Next Immediate Actions (Queued)
1. Trigger `pk:plan` to spec out the Milestone 1 scaffolding steps for TanStack Start + TS + Tailwind v4.
2. Execute Milestone 1 scaffolding tasks (`TASK-M1-01` through `TASK-M1-04`).
3. Verify dev server and build outputs.

---

## 8. Session Continuity Log
| Date | Engineer / Agent | Milestone / Focus | Key Changes & Artifacts |
| :--- | :--- | :--- | :--- |
| 2026-09-11 | Antigravity (pk:onboard) | Brownfield Codebase Intake | Audited repo architecture, generated PROMPTKIT.md, and initialized docs/STATE.md |
