import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ThreadRow } from "~/components/ThreadRow";
import { getThreadsByBoardSlugFn } from "~/server/queries/threads";
import { ThreadRowSkeleton } from "~/components/Skeletons";

export const Route = createFileRoute("/b/$slug/")({
  loader: async ({ params }) => {
    const data = await getThreadsByBoardSlugFn({ data: params.slug });
    if (!data || !data.board) {
      throw notFound();
    }
    return data;
  },
  pendingComponent: () => (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6">
        <div className="h-3 w-20 rounded bg-border/60 animate-pulse" />
      </nav>
      <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div>
          <div className="h-8 w-36 rounded bg-border" />
          <div className="mt-2 h-4 w-60 rounded bg-border/60" />
        </div>
        <div className="h-9 w-28 rounded bg-border/80" />
      </header>
      <section>
        <div className="mb-4 flex items-center justify-between animate-pulse">
          <div className="h-4 w-16 rounded bg-border/60" />
          <div className="h-4 w-12 rounded bg-border/40" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <ThreadRowSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  ),
  notFoundComponent: () => {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text">Board Not Found</h1>
        <p className="mt-2 text-sm text-text-muted">
          The board you requested does not exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
        >
          &larr; Back to all boards
        </Link>
      </div>
    );
  },
  component: BoardThreadsPage,
});

function BoardThreadsPage() {
  const { board, threads } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6">
        <Link
          to="/"
          className="text-xs font-medium text-text-muted hover:text-text transition-colors duration-fast"
        >
          &larr; All Boards
        </Link>
      </nav>

      <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text">/b/{board.slug}</h1>
            <span className="text-sm font-medium text-text-muted">
              ({board.name})
            </span>
          </div>
          {board.description && (
            <p className="mt-1 text-sm text-text-muted">{board.description}</p>
          )}
        </div>

        <div>
          <Link
            to="/b/$slug/new"
            params={{ slug: board.slug }}
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-all duration-fast hover:bg-accent-hover hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            + New Thread
          </Link>
        </div>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Threads
          </h2>
          <span className="text-xs text-text-muted">
            {threads.length} {threads.length === 1 ? "thread" : "threads"}
          </span>
        </div>

        {threads.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <h3 className="text-base font-medium text-text">
              No threads yet on /b/{board.slug}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Be the first to start a conversation on this board.
            </p>
            <div className="mt-6">
              <Link
                to="/b/$slug/new"
                params={{ slug: board.slug }}
                className="inline-flex items-center rounded-md bg-surface px-4 py-2 text-sm font-medium text-accent border border-border hover:border-border-hover"
              >
                Create a Thread
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {threads.map((thread) => (
              <ThreadRow key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
