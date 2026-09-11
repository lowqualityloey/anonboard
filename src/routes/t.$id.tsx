import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/t/$id")({
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-8 text-center text-text-muted">
      Thread View (Milestone 5)
    </div>
  ),
});
