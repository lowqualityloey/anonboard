import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { createPostFn } from "~/server/fns/createPost";
import { createPostSchema } from "~/lib/validation";

interface ReplyFormProps {
  threadId: string;
  isLocked: boolean;
}

export function ReplyForm({ threadId, isLocked }: ReplyFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLocked) {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-center text-xs text-warning">
        This thread is locked. New replies cannot be submitted.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = createPostSchema.safeParse({ threadId, body });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid reply");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPostFn({
        data: {
          threadId,
          body,
        },
      });

      setBody("");
      // Invalidate router loader cache to re-fetch thread and replies immediately
      await router.invalidate();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to post reply. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-text">Post a Reply</h3>

      {error && (
        <div className="mb-3 rounded-md border border-danger/40 bg-danger/10 p-2.5 text-xs text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            rows={4}
            required
            disabled={isSubmitting}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your anonymous reply (2-2000 characters)..."
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 resize-y"
          />
          <div className="mt-1 flex justify-between items-center text-xs">
            <span className="text-text-muted">Between 2 and 2000 characters</span>
            <span className={`tabular-nums ${body.length > 2000 ? "text-danger" : "text-text-muted"}`}>
              {body.length}/2000
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || body.trim().length < 2 || body.length > 2000}
            className="inline-flex items-center rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-bg hover:bg-accent-hover transition-colors duration-fast disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Submitting..." : "Submit Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
