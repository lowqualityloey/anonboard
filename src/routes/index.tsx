import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8 border-b border-border pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          AnonBoard
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Anonymous, ephemeral, and lightweight discussion boards.
        </p>
      </header>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-medium text-text">Welcome to AnonBoard</h2>
        <p className="mt-2 text-sm text-text-muted">
          Milestone 1 foundation active: TanStack Start + React 19 + Tailwind CSS v4.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex items-center rounded-sm bg-surface px-2.5 py-1 text-xs font-medium text-accent border border-border">
            System Online
          </span>
          <span className="text-xs text-text-muted">
            Ready for Milestone 2 (Prisma + Supabase schema).
          </span>
        </div>
      </div>
    </main>
  );
}
