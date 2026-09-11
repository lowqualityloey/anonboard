# Task Breakdown & Acceptance Criteria: Milestones 3 through 9

- **Status**: Ready
- **Created**: 2026-09-11
- **Target Epic**: AnonBoard Complete Lifecycle (Milestones 3–9)
- **Source Spec**: [`ARCHITECTURE.md`](../../ARCHITECTURE.md) · [`DESIGN.md`](../../DESIGN.md)

---

## Milestone 3: Board List & Thread List via Route Loaders

### `TASK-M3-01`: Board & Thread Server Query Layer
- **Priority**: `#priority/p0`
- **Scope**: `src/server/queries/boards.ts`, `src/server/queries/threads.ts`
- **Objective**: Implement server-side queries using Prisma to fetch board list and thread list with reply counts.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Board & Thread Queries
  Scenario: Fetching all active boards
    Given the database has seeded boards "General", "Study", "Random"
    When getBoards query is executed
    Then it returns an array of boards including name, slug, description, and thread count

  Scenario: Fetching threads for a specific board
    Given a board with slug "general" exists with 3 non-deleted threads and 1 soft-deleted thread
    When getThreadsByBoardSlug is called with slug "general"
    Then it returns exactly 3 threads ordered by updatedAt descending
    And each thread includes title, body preview, anonName, updatedAt, and post count
```

---

### `TASK-M3-02`: Index Page (`/`) Board List Route
- **Priority**: `#priority/p0`
- **Scope**: `src/routes/index.tsx`, `src/components/ui/BoardCard.tsx`
- **Objective**: Display all active discussion boards with descriptions and thread counts.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Home Page Board Directory
  Scenario: Loading the index route
    Given boards exist in the database
    When a visitor navigates to "/"
    Then the route loader fetches boards via getBoards
    And each board displays its title, description, and thread count using semantic surface tokens
    And clicking a board navigates to "/b/$slug"
```

---

### `TASK-M3-03`: Board Thread List Page (`/b/$slug`)
- **Priority**: `#priority/p0`
- **Scope**: `src/routes/b.$slug.tsx`, `src/components/ThreadRow.tsx`
- **Objective**: Render thread list for a given board with post counts, timestamps, and "New Thread" button.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Board Thread List
  Scenario: Viewing threads in a board
    Given a board "/b/general" exists with threads
    When a visitor opens "/b/general"
    Then the route loader retrieves threads for "general"
    And each thread row renders title, author tag, relative time, and reply count
    And a prominent primary button links to "/b/general/new"
```

---

## Milestone 4: Thread Creation (`/b/$slug/new`)

### `TASK-M4-01`: Thread Creation Server Function & Zod Schema
- **Priority**: `#priority/p0`
- **Scope**: `src/lib/validation.ts`, `src/server/fns/createThread.ts`
- **Objective**: Create type-safe server function with Zod validation to create a new thread in a board.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Create Thread Server Mutation
  Scenario: Valid thread submission
    Given a valid boardId, title (5-100 chars), and body (10-5000 chars)
    When createThread server function is called
    Then a new Thread record is inserted with isDeleted false
    And the created thread ID is returned

  Scenario: Invalid thread submission (empty fields)
    Given empty title or body
    When createThread is called
    Then validation fails with descriptive Zod error issues
```

---

### `TASK-M4-02`: New Thread Form UI (`/b/$slug/new`)
- **Priority**: `#priority/p1`
- **Scope**: `src/routes/b.$slug.new.tsx`
- **Objective**: Interactive form component with client-side validation and navigation to `/t/$id` on success.

#### Gherkin Acceptance Criteria
```gherkin
Feature: New Thread Form
  Scenario: Submitting a new thread
    Given a user is on "/b/study/new"
    When they fill in Title and Body and click Submit
    Then createThread server function executes
    And router navigates to "/t/$id" of the new thread
```

---

## Milestone 5: Thread Detail & Reply Functionality (`/t/$id`)

### `TASK-M5-01`: Thread Detail Query & Route (`/t/$id`)
- **Priority**: `#priority/p0`
- **Scope**: `src/routes/t.$id.tsx`, `src/components/PostCard.tsx`
- **Objective**: Loader-backed route to display thread title, body, author, and all chronologically ordered posts.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Thread Detail View
  Scenario: Loading thread with replies
    Given an existing thread with 5 replies
    When visitor opens "/t/$id"
    Then the initial thread body and all 5 posts are rendered in chronological order
    And soft-deleted posts (isDeleted: true) are hidden
```

---

### `TASK-M5-02`: Reply Mutation (`createPost`) & Form
- **Priority**: `#priority/p0`
- **Scope**: `src/server/fns/createPost.ts`, `src/components/ReplyForm.tsx`
- **Objective**: Server function and sticky/inline form component to post replies and invalidate query cache.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Posting a Reply
  Scenario: Submitting a reply
    Given an unlocked thread
    When visitor enters reply text and submits
    Then createPost inserts a new Post record linked to threadId
    And the thread's updatedAt timestamp is bumped
    And TanStack Query cache for ["thread", threadId] is invalidated
```

---

## Milestone 6: Anonymous Identity & Deterministic Name Generation

### `TASK-M6-01`: Anonymous Cookie Session & Thread Tag Generator
- **Priority**: `#priority/p0`
- **Scope**: `src/server/anon.ts`
- **Objective**: Generate persistent HttpOnly `anon_id` cookie and compute deterministic `Anon [hash]` per thread.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Deterministic Anonymous Identity
  Scenario: Consistent identity within same thread
    Given a user with anon_id cookie "user-xyz"
    When they post multiple replies in thread "thread-1"
    Then all their replies in "thread-1" display the identical Anon tag (e.g. "Anon 4b2a")

  Scenario: Identity disconnection across different threads
    Given user "user-xyz" posts in "thread-1" and "thread-2"
    Then their Anon tag in "thread-1" is different from their Anon tag in "thread-2"
```

---

## Milestone 7: Live Polling with TanStack Query

### `TASK-M7-01`: 12-Second Polling Loop on `/t/$id`
- **Priority**: `#priority/p1`
- **Scope**: `src/server/fns/pollThread.ts`, `src/routes/t.$id.tsx`
- **Objective**: Configure `useQuery` on thread page with 12s interval and window focus refetching.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Real-time Thread Polling
  Scenario: Polling for new posts
    Given a user is viewing "/t/$id"
    When another user posts a reply
    Then within 12 seconds the new post appears seamlessly without full page reload
    And polling is paused when the browser tab is hidden/backgrounded
```

---

## Milestone 8: Admin Login & Soft-Delete Moderation

### `TASK-M8-01`: Admin Cookie Authentication
- **Priority**: `#priority/p1`
- **Scope**: `src/server/auth.ts`, `src/routes/admin.tsx`
- **Objective**: Authenticate admin using `ADMIN_PASSWORD` and issue signed HttpOnly cookie session.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Admin Authentication
  Scenario: Correct admin password
    Given valid ADMIN_PASSWORD entered on "/admin"
    Then a signed httpOnly session cookie is set
    And the moderation dashboard unlocks

  Scenario: Incorrect password
    Given invalid password
    Then 401 Unauthorized is returned with error message
```

---

### `TASK-M8-02`: Soft-Delete Moderation Actions
- **Priority**: `#priority/p1`
- **Scope**: `src/server/fns/adminDelete.ts`, `src/components/AdminPostActions.tsx`
- **Objective**: Allow authenticated admins to soft-delete threads or posts (`isDeleted: true`).

#### Gherkin Acceptance Criteria
```gherkin
Feature: Admin Soft Delete
  Scenario: Admin soft-deletes a post
    Given an authenticated admin
    When they click delete on a post
    Then post.isDeleted is set to true in the database
    And the post is immediately removed from public view
```

---

## Milestone 9: Production Deployment on Vercel

### `TASK-M9-01`: Vercel Deployment & Runtime Pooling Verification
- **Priority**: `#priority/p0`
- **Scope**: `package.json` build scripts, `prisma/schema.prisma`, Vercel config
- **Objective**: Configure pooled database runtime connection and pre-deploy prisma migration hook.

#### Gherkin Acceptance Criteria
```gherkin
Feature: Production Vercel Deployment
  Scenario: Production build execution
    Given production environment with DATABASE_URL and DIRECT_URL configured
    When Vercel build runs
    Then prisma generate and vite build succeed
    And the SSR serverless handler starts with connection_limit=1
```
