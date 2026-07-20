import { Link } from "react-router-dom";
import {
  ListChecks,
  Bookmark,
  ThumbsUp,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/context/AuthContext";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

export default function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { data, isLoading, isError } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-ink-muted">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-hard">
        Failed to load dashboard.
      </div>
    );
  }

  const stats = [
    { label: "Solved", value: data.solvedCount ?? 0, icon: CheckCircle2 },
    { label: "Total Problems", value: data.totalProblems, icon: ListChecks },
    { label: "Bookmarks", value: data.bookmarks, icon: Bookmark },
    { label: "Votes Cast", value: data.votesCast, icon: ThumbsUp },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Welcome back, {user?.name || "Developer"}
        </h1>
        <p className="mt-2 text-ink-muted">
          Here's a snapshot of your progress on Bracket.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-4xl font-bold tracking-tight text-ink">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recently solved */}
      <div className="card mt-8 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Recently solved</h2>
          <Link
            to="/problems"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-opacity hover:opacity-80"
          >
            Solve more <ChevronRight size={15} />
          </Link>
        </div>

        {!data.recentSolved || data.recentSolved.length === 0 ? (
          <p className="py-8 text-center text-ink-subtle">
            Nothing solved yet — mark problems as solved to track progress.
          </p>
        ) : (
          <div className="space-y-2">
            {data.recentSolved.map((row) => (
              <Link
                key={row.id}
                to={`/problems/${row.problem.number}/${row.problem.slug}`}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-2 p-4 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="shrink-0 text-easy" />
                  <h3 className="font-medium text-ink">{row.problem.title}</h3>
                </span>
                <span
                  className={
                    badgeClass[row.problem.difficulty] ?? "badge badge-easy"
                  }
                >
                  {row.problem.difficulty}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent bookmarks */}
      <div className="card mt-8 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Recent bookmarks</h2>
          <Link
            to="/bookmarks"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-opacity hover:opacity-80"
          >
            View all <ChevronRight size={15} />
          </Link>
        </div>

        {data.recentBookmarks.length === 0 ? (
          <p className="py-8 text-center text-ink-subtle">No bookmarks yet.</p>
        ) : (
          <div className="space-y-2">
            {data.recentBookmarks.map((bookmark) => (
              <Link
                key={bookmark.id}
                to={`/problems/${bookmark.problem.number}/${bookmark.problem.slug}`}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-2 p-4 transition-colors hover:border-line-strong"
              >
                <h3 className="font-medium text-ink">
                  {bookmark.problem.title}
                </h3>
                <span
                  className={
                    badgeClass[bookmark.problem.difficulty] ?? "badge badge-easy"
                  }
                >
                  {bookmark.problem.difficulty}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
