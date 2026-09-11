export function BoardCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-surface p-5 animate-pulse">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-border" />
          <div className="h-4 w-14 rounded bg-border" />
        </div>
        <div className="mt-2 h-4 w-28 rounded bg-border" />
        <div className="mt-3 space-y-1.5">
          <div className="h-3 w-full rounded bg-border/60" />
          <div className="h-3 w-4/5 rounded bg-border/60" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border flex justify-between">
        <div className="h-3 w-16 rounded bg-border/50" />
        <div className="h-3 w-12 rounded bg-border/50" />
      </div>
    </div>
  );
}

export function ThreadRowSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 animate-pulse">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="h-5 w-3/4 rounded bg-border" />
          <div className="mt-2.5 space-y-1.5">
            <div className="h-3.5 w-full rounded bg-border/60" />
            <div className="h-3.5 w-5/6 rounded bg-border/60" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-3 w-20 rounded bg-border/50" />
            <div className="h-3 w-16 rounded bg-border/50" />
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex sm:flex-col sm:items-end gap-2">
          <div className="h-5 w-16 rounded bg-border/70" />
          <div className="h-3 w-12 rounded bg-border/40" />
        </div>
      </div>
    </div>
  );
}

export function ThreadDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 animate-pulse">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-16 rounded bg-border/60" />
        <div className="h-3 w-3 rounded bg-border/40" />
        <div className="h-3 w-12 rounded bg-border/60" />
        <div className="h-3 w-3 rounded bg-border/40" />
        <div className="h-3 w-24 rounded bg-border/40" />
      </div>

      {/* Main Original Post */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 rounded bg-border/80" />
          <div className="h-4 w-28 rounded bg-border/50" />
        </div>
        <div className="mt-3 h-7 w-4/5 rounded bg-border" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-border/70" />
          <div className="h-4 w-11/12 rounded bg-border/70" />
          <div className="h-4 w-2/3 rounded bg-border/70" />
        </div>
      </div>

      {/* Replies Section Header */}
      <div className="mt-8 flex items-center justify-between border-b border-border pb-2">
        <div className="h-4 w-20 rounded bg-border/70" />
        <div className="h-3 w-16 rounded bg-border/40" />
      </div>

      {/* Replies Skeletons */}
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-16 rounded bg-border/80" />
              <div className="h-3 w-20 rounded bg-border/40" />
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="h-3.5 w-full rounded bg-border/60" />
              <div className="h-3.5 w-3/4 rounded bg-border/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
