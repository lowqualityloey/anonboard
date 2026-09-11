# Technical Design Document (RFC): Milestone 1 — Project Scaffolding (TanStack Start, React 19, TypeScript & Tailwind CSS v4)

- **Author**: Antigravity & Lead Engineer
- **Status**: Draft
- **Created**: 2026-09-11
- **Target Release**: Milestone 1 (Foundation)

---

## Planning Record (PromptKit Adaptation)

<a id="PLAN-m1-scaffolding"></a>

### Planning Record Metadata
- **Planning Record ID**: `PLAN-m1-scaffolding`
- **Planning Depth**: `Full`
- **Owner**: AnonBoard Core Team
- **Record Status**: `ready`
- **Local Task Record Link**: `[TASK-M1-01](../tasks/2026-09-11-task-m1-scaffolding.md#TASK-M1-01)`
- **Workflow Links**: `[ARCHITECTURE.md](../../ARCHITECTURE.md)` · `[DESIGN.md](../../DESIGN.md)`

### Planning Inputs
- **Requested Outcome**: A clean, fully functional TanStack Start application baseline running React 19, TypeScript, and Tailwind CSS v4 with semantic tokens configured in `src/styles/app.css` matching `DESIGN.md`.
- **Observable Completion Condition**:
  1. `npm run build` succeeds with zero errors and generates client/server production bundles.
  2. `npm run typecheck` (or `npx tsc --noEmit`) passes with zero TypeScript diagnostic errors under strict mode.
  3. Dev server boots cleanly via `npm run dev` and renders the root app shell with correct Tailwind semantic theme tokens applied.
- **Scope Boundary**:
  - **In Scope**: `package.json`, `tsconfig.json`, `app.config.ts`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/styles/app.css`, root document shell.
  - **Excluded**: Prisma schema & Supabase DB setup (Milestone 2), route loader data fetching (Milestone 3), mutation server functions (Milestone 4 & 5), admin auth & cookie session handling (Milestone 8).
- **TDD Enforcement Proposal**: `disabled` (Initial project scaffolding, framework bootstrapping, and build verification).

### Full Planning
- **Explicit Non-Goals**:
  - Do not configure database connections or run Prisma migrations in Milestone 1.
  - Do not implement anonymous cookie hash generation or session handling in Milestone 1.
  - Do not create placeholder mock data or complex nested routes beyond `__root.tsx` and a basic smoke-test `index.tsx`.
- **Affected Behavioral Components**:
  - Project configuration: `package.json`, `tsconfig.json`, `app.config.ts`
  - Application shell: `src/routes/__root.tsx`, `src/routes/index.tsx`
  - Stylesheet: `src/styles/app.css`
- **Externally Visible Contracts**:
  - Local HTTP dev server listening on port 3000 (default TanStack Start port).
  - Clean HTML response containing root document shell with `<Meta />`, `<Links />`, `<Scripts />`, and `<Outlet />`.
- **Failure or Rollback Considerations**:
  - Framework version incompatibilities between Vite, TanStack Start, and React 19.
  - Rollback strategy: Clean `git reset` to `main` (`efe39d1`) with zero data risk since no database exists.
- **Verification Approach**:
  - Automated: `npm run typecheck` and `npm run build`.
  - Manual / Smoke: Verify HTTP 200 response on `http://localhost:3000` with styled container rendering.

### Assumption Records
None. System architecture and design token specifications are fully documented in `ARCHITECTURE.md` and `DESIGN.md`.

---

## 1. Problem Statement & Context
AnonBoard requires a production-grade modern full-stack TypeScript foundation. To prevent premature complexity, the architecture deliberately avoids microservices and external state servers, selecting TanStack Start for unified SSR, file-based routing, server functions, and automatic code splitting. Milestone 1 establishes this foundational runtime and design system before data layer dependencies are introduced.

---

## 2. System Context & Architecture

```text
Browser Client
     │
     ▼
TanStack Start App Shell (src/routes/__root.tsx)
     │
     ├── Injects Tailwind v4 tokens (@theme in src/styles/app.css)
     ├── Configures TanStack Router Head / Meta / Outlet
     │
     ▼
Index Route (src/routes/index.tsx)
     └── Renders Welcome Banner using semantic classes (bg-bg, text-text, bg-surface)
```

### Deep Modules & Seams
- **Styling Seam**: All visual styles consume semantic CSS custom properties (`var(--color-surface)`, `var(--color-accent)`) mapped into Tailwind v4 `@theme`. No raw Tailwind color classes (e.g. `bg-gray-900`) in route components.
- **Routing Seam**: File-based routes registered under `src/routes/` with TanStack Start's `createRootRoute` and `createFileRoute`.

---

## 3. Configuration & Dependency Contracts

### `package.json` Dependencies
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.67.0",
    "@tanstack/react-router": "^1.114.0",
    "@tanstack/start": "^1.114.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vinxi": "^0.5.3",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.9",
    "@types/node": "^22.13.9",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "tailwindcss": "^4.0.9",
    "typescript": "^5.7.3",
    "vite": "^6.2.0",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

### Tailwind CSS v4 Mapping (`src/styles/app.css`)
Must precisely match `DESIGN.md` Section 150:
- Primitives: `--color-gray-950`, `--color-gray-900`, `--color-gray-800`, `--color-gray-700`, `--color-gray-400`, `--color-gray-100`, `--color-green-500`, `--color-green-400`, `--color-red-500`, `--color-amber-500`.
- Semantic: `--color-bg`, `--color-surface`, `--color-border`, `--color-border-hover`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`, `--color-danger`, `--color-warning`.
- Radii, Shadows, Motion: `--radius-sm`, `--radius-md`, `--radius-lg`, `--shadow-sm`, `--shadow-md`, `--duration-fast`, `--duration-base`.

---

## 4. Threat Modeling & FMEA Matrix

| Failure Scenario | Probability / Severity | Detection Method | Mitigation / Fallback | Recovery Strategy |
| :--- | :--- | :--- | :--- | :--- |
| Tailwind v4 Vite plugin resolution error | Low / High | `npm run build` failure | Verify `@tailwindcss/vite` configuration in `app.config.ts` | Revert to standard PostCSS plugin if Vite integration breaks |
| React 19 peer dependency mismatch | Low / Medium | `npm install` warning / ERESOLVE | Pin exact compatible versions for React 19 and `@types/react` | Use `--legacy-peer-deps` only if verified safe |
| Unrendered CSS tokens in SSR | Low / Medium | FOUC or unstyled markup on first load | Import `app.css` directly in `__root.tsx` links head array | Ensure stylesheet link is emitted in SSR head |

---

## 5. Implementation Milestones & Verification Plan

- [ ] **Phase 1: Project Initialization**: Create `package.json`, `tsconfig.json`, and install exact dependencies.
- [ ] **Phase 2: App & Vite Configuration**: Create `app.config.ts` with TanStack Start + Tailwind v4 Vite plugin.
- [ ] **Phase 3: Design System Tokens**: Create `src/styles/app.css` with exact `@theme` tokens from `DESIGN.md`.
- [ ] **Phase 4: Root Shell & Index Route**: Create `src/routes/__root.tsx` and `src/routes/index.tsx`.
- [ ] **Phase 5: Verification & Smoke Test**:
  - Run `npm run typecheck` $\rightarrow$ Exit code 0.
  - Run `npm run build` $\rightarrow$ Zero build errors.
