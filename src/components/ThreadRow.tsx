import { Link } from "@tanstack/react-router";

export interface ThreadItem {
  id: string;
  title: string;
  body: string;
  anonName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isLocked: boolean;
  _count: {
    posts: number;
  };
}

interface ThreadRowProps {
  thread: ThreadItem;
}

function formatRelativeTime(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  return date.toLocaleDateString();
}

export function ThreadRow({ thread }: ThreadRowProps) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-4 transition-colors duration-fast hover:border-border-hover hover:bg-surface/90">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Link
            to="/t/$id"
            params={{ id: thread.id }}
            className="text-base font-semibold text-text group-hover:text-accent transition-colors duration-fast"
          >
            {thread.title}
          </Link>

          <p className="mt-1 text-sm text-text-muted line-clamp-2 leading-relaxed">
            {thread.body}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="font-mono text-accent">{thread.anonName}</span>
            <span>&bull;</span>
            <time dateTime={new Date(thread.updatedAt).toISOString()}>
              Active {formatRelativeTime(thread.updatedAt)}
            </time>
            {thread.isLocked && (
              <>
                <span>&bull;</span>
                <span className="rounded-sm bg-warning/10 px-1.5 py-0.5 text-[11px] font-medium text-warning">
                  Locked
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 flex shrink-0 items-center sm:mt-0 sm:ml-4">
          <span className="inline-flex items-center rounded-sm bg-bg px-2.5 py-1 text-xs font-medium text-text border border-border">
            {thread._count.posts} {thread._count.posts === 1 ? "reply" : "replies"}
          </span>
        </div>
      </div>
    </article>
  );
}
