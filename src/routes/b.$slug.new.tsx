import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/b/$slug/new")({
  component: () => (
    <div className="mx-auto max-w-2xl px-4 py-8 text-center text-text-muted">
      New Thread Form (Milestone 4)
    </div>
  ),
});
