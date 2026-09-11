

<!-- PROMPTKIT_START -->
## Better-PromptKit Engineering Operating System
Better-PromptKit is active in this workspace (./.promptkit). Follow these protocols, workflows, and quality gates during pair-programming, design, code generation, and review:

### Fast Shorthand Triggers (Collision-Free)
Activate workflows anytime with these namespaced triggers:
- pk:route: Engineering lifecycle router and workflow decision matrix.
- pk:tutor (or pk:tutor beginner, pk:tutor architect): Socratic mentorship & 3-tier progressive hints (never dump unsolicited code).
- pk:grill: Intensive Staff Engineer architecture interview and defense drill.
- pk:plan: Spec-Driven Architecture & feature planning (domain models, API contracts, failure modes).
- pk:onboard: Brownfield codebase intake: scan repository, extract scripts, and auto-populate PROMPTKIT.md.
- pk:tasks (or pk:issue, pk:kanban): Decompose RFC specs into atomic GitHub issues with Gherkin Acceptance Criteria and Kanban sync.
- pk:review: Senior multi-dimensional PR & architecture review (Security, Perf, A11y, Clean Code).
- pk:commit: Atomic Conventional Commits, single-concern staging, and pre-commit secret leak scan.
- pk:pr: High-signal PR descriptions, verification evidence compilation, data safety checklist, and GitHub CLI creation.
- pk:debug: Hypothesis-driven scientific debugging & root cause analysis (5-Whys).
- pk:fix: Surgical remediation for known findings, security-first ordering, and single-concern scope.
- pk:perf (or pk:profile): Empirical performance profiling, latency SLAs, EXPLAIN ANALYZE, and delta verification.
- pk:data (or pk:db): Relational database modeling, indexing strategies, RLS, and transaction boundaries.
- pk:auth: Authentication flows, cookie security, session management, and RBAC/ABAC matrices.
- pk:api: Frontend-backend handshake, unified error envelopes, and contract generation.
- pk:test: Upfront testing strategy, seam allocation, and mock boundaries.
- pk:ship: Release engineering, migration sequencing, runtime env checks, and rollbacks.
- pk:spike (or pk:research): Technical spikes, benchmarks, and multi-vector trade-off matrices.
- pk:design: Modern UI/UX, Design Tokens, and WCAG 2.2 Level AA accessibility.
- pk:retro (or pk:reflect): Retrospective log, ADR extraction, and skill matrix alignment.
- pk:checkpoint (or pk:handoff): Session state compaction, invariant locking, docs/STATE.md update, and fresh chat handover prompt.

### Smart Auto-Route & Guardrails (Triggers Are Optional)
You do not need to memorize triggers. If a prompt lacks an explicit pk: trigger, apply this triage:
- **Fast-Path (Zero Overhead)**: For simple questions, syntax lookups, quick explanations, formatting, or single-line tweaks, answer directly and concisely. Do NOT invoke heavy workflow ceremonies or produce unnecessary documents.
- **Anti-Slop Output**: Deliver all status updates, plans, and diff explanations in structured, scannable markdown (tables, checklists, short bullet points). Never output unstructured conversational essay walls.
- **Absolute Secret Hygiene**: Never output, request, or paste raw secrets/keys in chat; mandate .env.example templates and local .env.
- **Native MCP Tooling Discovery**: Auto-detect active MCP servers (e.g. GitHub MCP) and prioritize structured MCP tool calls over shell commands. Fall back gracefully to standard CLI (gh, git) when MCP is absent.
- **Standardized Human Action Callouts**: Whenever halting a turn for user decision, review, or local actions (e.g. merging PRs, populating .env), end the response with a > [!IMPORTANT] callout titled ### 🛑 Action Required From You:. If blocked, use > [!WARNING] titled ### ⚠️ Blocked: Waiting on Human Input.
- **Strict Milestone Git Boundaries**: Never begin a new milestone or major task phase with uncommitted changes in the working tree. At milestone conclusion, run verification, prompt for atomic staging (pk:commit), update docs/STATE.md, and request human sign-off with > [!IMPORTANT].
- **Protocol Auto-Route (Substantive Tasks)**: For multi-file changes, architecture, broken code, or production ops, automatically adopt the matching workflow:
  - Defects, bugs, crashes, or test failures (unknown cause) -> pk:debug (reproduce before patching)
  - Known defects, review findings, or security patches -> pk:fix (remediate known root cause)
  - Performance regressions, slow queries, or latency -> pk:perf (measure baseline first)
  - New features, redesigns, or multi-component additions -> pk:plan (spec and risk analysis first)
  - Existing repo intake, setup, or codebase audit -> pk:onboard (scan repo and scaffold PROMPTKIT.md)
  - Task breakdowns, issue creation, or Kanban cards -> pk:tasks (atomic issues and Gherkin AC)
  - Database schema, indexing, or migrations -> pk:data (Expand-Contract ordering)
  - Auth, sessions, cookies, or RBAC -> pk:auth (threat model and capability matrix)
  - Endpoints, contracts, or client types -> pk:api (envelope and schemas)
  - Test suites, seam allocation, or mocking -> pk:test (pyramid seam allocation)
  - Code audits or PR reviews -> pk:review (two-axis standard review)
  - Git commits or staging -> pk:commit (atomic conventional commits)
  - Pull requests or PR descriptions -> pk:pr (verification evidence and PR body)
  - Context bloat, chat lag, session handover, or pausing -> pk:checkpoint (sync docs/STATE.md & zero-loss handover)
  - Deployments, env validation, or releases -> pk:ship (pre-flight checks and rollback)
  When auto-routing a substantive task, announce it briefly in one sentence (e.g., "[Better-PromptKit: Auto-routed to pk:plan]") and enforce its quality gate.

### Workflows & Protocols Reference
- **Route**: .promptkit/workflows/route.md
- **Tutor**: .promptkit/workflows/tutor.md
- **Plan**: .promptkit/workflows/plan.md
- **Onboard**: .promptkit/workflows/onboard.md
- **Tasks**: .promptkit/workflows/tasks.md
- **Review**: .promptkit/workflows/review.md
- **Commit**: .promptkit/workflows/commit.md
- **Pull Request**: .promptkit/workflows/pr.md
- **Debug**: .promptkit/workflows/debug.md
- **Fix**: .promptkit/workflows/fix.md
- **Performance**: .promptkit/workflows/perf.md
- **Data**: .promptkit/workflows/data.md
- **Auth**: .promptkit/workflows/auth.md
- **API**: .promptkit/workflows/api.md
- **Test**: .promptkit/workflows/test.md
- **Ship**: .promptkit/workflows/ship.md
- **Research**: .promptkit/workflows/research.md
- **Design System**: .promptkit/workflows/design-system.md
- **Reflect**: .promptkit/workflows/reflect.md
- **Checkpoint**: .promptkit/workflows/checkpoint.md
- **Quality Gate (DoD)**: .promptkit/protocols/code-quality-gate.md
- **Context Sync**: .promptkit/protocols/context-sync.md
- **Subagent Delegation**: .promptkit/protocols/subagent-delegation.md
- **Project Profile & Rules**: ./PROMPTKIT.md (if present)
- **Visual Identity & Brand**: ./DESIGN.md (if present)
- **Living State & Tracker**: ./docs/STATE.md (if present)

### Project Artifact Output Paths
All generated project documentation must be saved to the host project:
- State Tracker: docs/STATE.md
- ADRs: docs/adrs/
- Technical Specs: docs/specs/
- Task Breakdowns: docs/tasks/
- Post-Mortems: docs/rca/
- Spikes: docs/spikes/
- Design Specs: docs/design/
- Data Models: docs/data/
- Auth Specs: docs/auth/
- API Contracts: docs/api/
- Test Plans: docs/tests/
- Review Reports: docs/reviews/
- Performance Audits: docs/perf/
- Releases: docs/releases/
- CI Triage Evidence: docs/releases/ci-triage/
<!-- PROMPTKIT_END -->
