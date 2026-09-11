import { createFileRoute, Link } from "@tanstack/react-router";
import { getBoardsFn } from "~/server/queries/boards";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getBoardsFn();
  },
  component: HomePage,
});

function HomePage() {
  const boards = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            AnonBoard
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Anonymous, lightweight discussion boards. Select a board below to browse threads or start a conversation.
          </p>
        </div>
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:border-border-hover hover:text-text transition-colors duration-fast"
          >
            Admin Moderation &rarr;
          </Link>
        </div>
      </header>


      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Boards
          </h2>
          <span className="text-xs text-text-muted">
            {boards.length} available
          </span>
        </div>

        {boards.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-text-muted">
            <p>No boards found. Run database seed to populate default boards.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Link
                key={board.id}
                to="/b/$slug"
                params={{ slug: board.slug }}
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors duration-fast hover:border-border-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text group-hover:text-accent">
                      /b/{board.slug}
                    </h3>
                    <span className="rounded-sm bg-bg px-2 py-0.5 text-xs text-text-muted border border-border">
                      {board._count.threads}{" "}
                      {board._count.threads === 1 ? "thread" : "threads"}
                    </span>
                  </div>
                  <h4 className="mt-1 text-sm font-medium text-text">
                    {board.name}
                  </h4>
                  {board.description && (
                    <p className="mt-2 text-xs leading-relaxed text-text-muted line-clamp-2">
                      {board.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center text-xs font-medium text-accent">
                  Browse board &rarr;
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
