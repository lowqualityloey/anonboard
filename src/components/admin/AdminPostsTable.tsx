import { Link } from "@tanstack/react-router";
import { Spinner } from "~/components/Spinner";
import { AdminPost } from "./types";

interface AdminPostsTableProps {
  posts: AdminPost[];
  actionInProgress: string | null;
  onDeletePost: (postId: string) => void;
}

export function AdminPostsTable({
  posts,
  actionInProgress,
  onDeletePost,
}: AdminPostsTableProps) {
  return (
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
          {posts.map((post) => (
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
                    onClick={() => onDeletePost(post.id)}
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
  );
}
