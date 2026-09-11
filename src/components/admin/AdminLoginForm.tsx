import React from "react";
import { Link } from "@tanstack/react-router";

interface AdminLoginFormProps {
  password: string;
  setPassword: (password: string) => void;
  loginError: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminLoginForm({
  password,
  setPassword,
  loginError,
  isSubmitting,
  onSubmit,
}: AdminLoginFormProps) {
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

        <form onSubmit={onSubmit} className="space-y-4">
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
