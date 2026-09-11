import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { adminLoginFn, adminLogoutFn } from "~/server/fns/adminAuth";
import {
  getAdminModerationListFn,
  adminSoftDeleteThreadFn,
  adminSoftDeletePostFn,
  adminToggleLockThreadFn,
} from "~/server/fns/adminDelete";
import { AdminLoginForm } from "~/components/admin/AdminLoginForm";
import { AdminHeader } from "~/components/admin/AdminHeader";
import { AdminThreadsTable } from "~/components/admin/AdminThreadsTable";
import { AdminPostsTable } from "~/components/admin/AdminPostsTable";

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
      <AdminLoginForm
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        isSubmitting={isSubmitting}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <AdminHeader onLogout={handleLogout} />

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
        <AdminThreadsTable
          threads={data.threads}
          optimisticLocks={optimisticLocks}
          actionInProgress={actionInProgress}
          onToggleLock={handleToggleLock}
          onDeleteThread={handleDeleteThread}
        />
      )}

      {/* Content Table: Posts */}
      {activeTab === "posts" && (
        <AdminPostsTable
          posts={data.recentPosts}
          actionInProgress={actionInProgress}
          onDeletePost={handleDeletePost}
        />
      )}
    </div>
  );
}
