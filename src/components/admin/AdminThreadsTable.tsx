import { Link } from "@tanstack/react-router";
import { AdminThread } from "./types";

interface AdminThreadsTableProps {
  threads: AdminThread[];
  optimisticLocks: Record<string, boolean>;
  actionInProgress: string | null;
  onToggleLock: (threadId: string, currentStatus: boolean) => void;
  onDeleteThread: (threadId: string) => void;
}

export function AdminThreadsTable({
  threads,
  optimisticLocks,
  actionInProgress,
  onToggleLock,
  onDeleteThread,
}: AdminThreadsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-border bg-bg/50 text-text-muted font-medium">
          <tr>
            <th className="p-3">Title / Board</th>
            <th className="p-3">Author</th>
            <th className="p-3">Replies</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {threads.map((thread) => {
            const effectiveLocked =
              optimisticLocks[thread.id] !== undefined
                ? optimisticLocks[thread.id]
                : thread.isLocked;
            const isLocking = actionInProgress === `lock-${thread.id}`;
            const isDeleting = actionInProgress === `delete-thread-${thread.id}`;

            return (
              <tr
                key={thread.id}
                className={`hover:bg-bg/30 transition-colors duration-fast ${
                  thread.isDeleted ? "opacity-40 line-through" : ""
                }`}
              >
                <td className="p-3">
                  <Link
                    to="/t/$id"
                    params={{ id: thread.id }}
                    className="font-medium text-text hover:text-accent line-clamp-1"
                  >
                    {thread.title}
                  </Link>
                  <div className="text-[11px] text-text-muted">
                    /b/{thread.board.slug}
                  </div>
                </td>
                <td className="p-3 text-text-muted">{thread.anonName}</td>
                <td className="p-3 text-text-muted tabular-nums">
                  {thread._count.posts}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {thread.isDeleted && (
                      <span className="rounded bg-danger/20 px-1.5 py-0.5 text-[10px] text-danger font-semibold">
                        Deleted
                      </span>
                    )}
                    {effectiveLocked && (
                      <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[10px] text-warning font-semibold">
                        Locked
                      </span>
                    )}
                    {!thread.isDeleted && !effectiveLocked && (
                      <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onToggleLock(thread.id, effectiveLocked)}
                    disabled={isLocking || isDeleting}
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text hover:border-border-hover transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLocking && (
                      <svg
                        className="h-3 w-3 animate-spin text-text"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {effectiveLocked ? "Unlock" : "Lock"}
                  </button>
                  {!thread.isDeleted && (
                    <button
                      onClick={() => onDeleteThread(thread.id)}
                      disabled={isLocking || isDeleting}
                      className="inline-flex items-center gap-1 rounded bg-danger/15 border border-danger/30 px-2 py-1 text-[11px] text-danger hover:bg-danger/25 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting && (
                        <svg
                          className="h-3 w-3 animate-spin text-danger"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
