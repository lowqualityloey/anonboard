import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getThreadByIdFn } from "~/server/queries/threads";
import { pollThreadFn } from "~/server/fns/pollThread";
import { PostCard } from "~/components/PostCard";
import { ReplyForm } from "~/components/ReplyForm";
import { ThreadDetailSkeleton } from "~/components/Skeletons";

export const Route = createFileRoute("/t/$id")({
  loader: async ({ params }) => {
    const thread = await getThreadByIdFn({ data: params.id });
    if (!thread || thread.isDeleted) {
      throw notFound();
    }
    return { thread };
  },
  pendingComponent: ThreadDetailSkeleton,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-text">Thread Not Found</h1>
      <p className="mt-2 text-sm text-text-muted">
        This thread may have been deleted or does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover transition-colors duration-fast"
      >
        &larr; Return to all boards
      </Link>
    </div>
  ),
  component: ThreadDetailPage,
});

function ThreadDetailPage() {
  const { thread } = Route.useLoaderData();

  // Milestone 7: Live polling every 12 seconds with TanStack Query
  // Automatically pauses when browser tab is inactive/hidden (refetchIntervalInBackground: false)
  const { data: posts = thread.posts } = useQuery({
    queryKey: ["thread", thread.id],
    queryFn: () => pollThreadFn({ data: thread.id }),
    initialData: thread.posts,
    refetchInterval: 12_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const formattedCreated = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(thread.createdAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center space-x-2 text-xs text-text-muted">
        <Link
          to="/"
          className="hover:text-text transition-colors duration-fast"
        >
          All Boards
        </Link>
        <span>/</span>
        <Link
          to="/b/$slug"
          params={{ slug: thread.board.slug }}
          className="hover:text-text transition-colors duration-fast"
        >
          {thread.board.name}
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-text font-medium">
          {thread.title}
        </span>
      </nav>

      {/* Main Original Post (OP) */}
      <article className="rounded-lg border border-border bg-surface p-6 shadow-sm mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs text-text-muted">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-accent">{thread.anonName}</span>
            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
              OP
            </span>
            {thread.isLocked && (
              <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                Locked
              </span>
            )}
          </div>
          <time dateTime={new Date(thread.createdAt).toISOString()}>{formattedCreated}</time>
        </div>

        <h1 className="text-xl font-bold text-text leading-tight mb-4">
          {thread.title}
        </h1>

        <p className="whitespace-pre-wrap text-sm text-text leading-relaxed">
          {thread.body}
        </p>
      </article>

      {/* Replies Section with Live Polling */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
              Replies ({posts.length})
            </h2>
            <span
              className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse"
              title="Live 12-second polling active"
            />
          </div>
          <span className="text-[11px] text-text-muted">Auto-updating</span>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-text-muted">
            No replies yet. Be the first to share your thoughts anonymously!
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* Reply Submission Form */}
      <section>
        <ReplyForm threadId={thread.id} isLocked={thread.isLocked} />
      </section>
    </div>
  );
}
