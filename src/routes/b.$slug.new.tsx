import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  notFound,
} from "@tanstack/react-router";
import { getBoardBySlugFn } from "~/server/queries/boards";
import { createThreadFn } from "~/server/fns/createThread";
import { createThreadSchema } from "~/lib/validation";

export const Route = createFileRoute("/b/$slug/new")({
  loader: async ({ params }) => {
    const board = await getBoardBySlugFn({ data: params.slug });
    if (!board) {
      throw notFound();
    }
    return { board };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-text">Board Not Found</h1>
      <p className="mt-2 text-sm text-text-muted">
        The board you are trying to post to does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover transition-colors duration-fast"
      >
        &larr; Return to boards
      </Link>
    </div>
  ),
  component: NewThreadPage,
});

function NewThreadPage() {
  const { board } = Route.useLoaderData();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Client-side validation using the same Zod schema
    const validationResult = createThreadSchema.safeParse({
      boardId: board.id,
      title,
      body,
    });

    if (!validationResult.success) {
      const fieldErrors: { title?: string; body?: string } = {};
      for (const issue of validationResult.error.issues) {
        if (issue.path[0] === "title" && !fieldErrors.title) {
          fieldErrors.title = issue.message;
        } else if (issue.path[0] === "body" && !fieldErrors.body) {
          fieldErrors.body = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const newThread = await createThreadFn({
        data: {
          boardId: board.id,
          title,
          body,
        },
      });

      if (newThread?.id) {
        await navigate({
          to: "/t/$id",
          params: { id: newThread.id },
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create thread. Please try again.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Breadcrumbs */}
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
          params={{ slug: board.slug }}
          className="hover:text-text transition-colors duration-fast"
        >
          {board.name}
        </Link>
        <span>/</span>
        <span className="text-text font-medium">New Thread</span>
      </nav>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 border-b border-border pb-4">
          <h1 className="text-xl font-bold text-text">Create a New Thread</h1>
          <p className="mt-1 text-xs text-text-muted">
            Posting anonymously to <span className="font-semibold text-accent">{board.name}</span> (/b/{board.slug})
          </p>
        </div>

        {errors.form && (
          <div className="mb-6 rounded-md border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="thread-title" className="block text-xs font-semibold text-text mb-1.5">
              Title <span className="text-danger">*</span>
            </label>
            <input
              id="thread-title"
              type="text"
              required
              disabled={isSubmitting}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your discussion a clear topic (5-100 characters)"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
            />
            <div className="mt-1 flex justify-between items-center text-xs">
              {errors.title ? (
                <span className="text-danger">{errors.title}</span>
              ) : (
                <span className="text-text-muted">Between 5 and 100 characters</span>
              )}
              <span className={`tabular-nums ${title.length > 100 ? "text-danger" : "text-text-muted"}`}>
                {title.length}/100
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="thread-body" className="block text-xs font-semibold text-text mb-1.5">
              Content <span className="text-danger">*</span>
            </label>
            <textarea
              id="thread-body"
              rows={8}
              required
              disabled={isSubmitting}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What would you like to discuss anonymously? (10-5000 characters)"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 resize-y"
            />
            <div className="mt-1 flex justify-between items-center text-xs">
              {errors.body ? (
                <span className="text-danger">{errors.body}</span>
              ) : (
                <span className="text-text-muted">Between 10 and 5000 characters</span>
              )}
              <span className={`tabular-nums ${body.length > 5000 ? "text-danger" : "text-text-muted"}`}>
                {body.length}/5000
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Link
              to="/b/$slug"
              params={{ slug: board.slug }}
              className="rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-text hover:border-border-hover transition-all duration-fast active:scale-[0.97]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || title.trim().length < 5 || body.trim().length < 10}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-bg hover:bg-accent-hover transition-all duration-fast hover:shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting && (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSubmitting ? "Publishing thread..." : "Post Thread"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
