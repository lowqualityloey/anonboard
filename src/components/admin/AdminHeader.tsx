import { Link } from "@tanstack/react-router";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
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
          onClick={onLogout}
          className="rounded-md bg-danger/10 border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors duration-fast"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
