import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Spinner } from "~/components/Spinner";
import { adminLoginFn, adminLogoutFn } from "~/server/fns/adminAuth";
import {
  getAdminModerationListFn,
  adminSoftDeleteThreadFn,
  adminSoftDeletePostFn,
  adminToggleLockThreadFn,
} from "~/server/fns/adminDelete";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    return getAdminModerationListFn();
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const router = useRouter();
  const data = Route.useLoaderData();

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"threads" | "posts">("threads");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [optimisticLocks, setOptimisticLocks] = useState<Record<string, boolean>>({});

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);

    try {
      setIsSubmitting(true);
      await adminLoginFn({ data: { password } });
      setPassword("");
      await router.invalidate();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setLoginError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await adminLogoutFn();
    await router.invalidate();
  }

  async function handleDeleteThread(threadId: string) {
    if (confirm("Are you sure you want to soft-delete this thread?")) {
      try {
        setActionInProgress(`delete-thread-${threadId}`);
        await adminSoftDeleteThreadFn({ data: { threadId } });
        await router.invalidate();
      } finally {
        setActionInProgress(null);
      }
    }
  }

  async function handleToggleLock(threadId: string, currentStatus: boolean) {
    const nextStatus = !currentStatus;
    // Optimistically update the UI instantly
    setOptimisticLocks((prev) => ({ ...prev, [threadId]: nextStatus }));
    setActionInProgress(`lock-${threadId}`);

    try {
      await adminToggleLockThreadFn({
        data: { threadId, isLocked: nextStatus },
      });
      await router.invalidate();
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticLocks((prev) => {
        const copy = { ...prev };
        delete copy[threadId];
        return copy;
      });
      alert(err instanceof Error ? err.message : "Failed to toggle lock status");
    } finally {
      setActionInProgress(null);
    }
  }

  async function handleDeletePost(postId: string) {
    if (confirm("Are you sure you want to soft-delete this post?")) {
      try {
        setActionInProgress(`delete-post-${postId}`);
        await adminSoftDeletePostFn({ data: { postId } });
        await router.invalidate();
      } finally {
        setActionInProgress(null);
      }
    }
  }

  // If not authenticated, render the admin login gate
  if (!data.isAuthenticated) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-text">Admin Moderation</h1>
            <p className="mt-1 text-xs text-text-muted">
              Enter your administration password to proceed.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-md border border-danger/40 bg-danger/10 p-2.5 text-xs text-danger">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-text mb-1"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full rounded-md bg-accent py-2 text-xs font-semibold text-bg hover:bg-accent-hover transition-colors duration-fast disabled:opacity-50"
            >
              {isSubmitting ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-text-muted hover:text-text transition-colors duration-fast"
            >
              &larr; Return to Boards
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Admin Moderation Dashboard</h1>
          <p className="text-xs text-text-muted">
            Authenticated session &middot; Soft-delete management &middot; Thread locks
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text hover:border-border-hover transition-colors duration-fast"
          >
            Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md bg-danger/10 border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors duration-fast"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-2 border-b border-border">
        <button
          onClick={() => setActiveTab("threads")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors duration-fast ${
            activeTab === "threads"
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          Threads ({data.threads.length})
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors duration-fast ${
            activeTab === "posts"
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          Recent Posts ({data.recentPosts.length})
        </button>
      </div>

      {/* Content Table: Threads */}
      {activeTab === "threads" && (
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
              {data.threads.map((thread) => {
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
                        onClick={() => handleToggleLock(thread.id, effectiveLocked)}
                        disabled={isLocking || isDeleting}
                        className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text hover:border-border-hover transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLocking && <Spinner className="h-3 w-3 animate-spin text-text" />}
                        {effectiveLocked ? "Unlock" : "Lock"}
                      </button>
                      {!thread.isDeleted && (
                        <button
                          onClick={() => handleDeleteThread(thread.id)}
                          disabled={isLocking || isDeleting}
                          className="inline-flex items-center gap-1 rounded bg-danger/15 border border-danger/30 px-2 py-1 text-[11px] text-danger hover:bg-danger/25 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting && <Spinner className="h-3 w-3 animate-spin text-danger" />}
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
      )}

      {/* Content Table: Posts */}
      {activeTab === "posts" && (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-bg/50 text-text-muted font-medium">
              <tr>
                <th className="p-3">Content</th>
                <th className="p-3">Thread</th>
                <th className="p-3">Author</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.recentPosts.map((post) => (
                <tr
                  key={post.id}
                  className={`hover:bg-bg/30 transition-colors duration-fast ${
                    post.isDeleted ? "opacity-40 line-through" : ""
                  }`}
                >
                  <td className="p-3 max-w-xs truncate text-text">
                    {post.body}
                  </td>
                  <td className="p-3 text-text-muted max-w-xs truncate">
                    <Link
                      to="/t/$id"
                      params={{ id: post.thread.id }}
                      className="hover:text-accent"
                    >
                      {post.thread.title}
                    </Link>
                  </td>
                  <td className="p-3 text-text-muted">{post.anonName}</td>
                  <td className="p-3">
                    {post.isDeleted ? (
                      <span className="rounded bg-danger/20 px-1.5 py-0.5 text-[10px] text-danger font-semibold">
                        Deleted
                      </span>
                    ) : (
                      <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {!post.isDeleted && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={actionInProgress === `delete-post-${post.id}`}
                        className="inline-flex items-center gap-1 rounded bg-danger/15 border border-danger/30 px-2 py-1 text-[11px] text-danger hover:bg-danger/25 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionInProgress === `delete-post-${post.id}` && (
                          <Spinner className="h-3 w-3 animate-spin text-danger" />
                        )}
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
