import { Link } from "react-router-dom";
import { Plus, Users, ChevronRight } from "lucide-react";
import StatsGrid from "../components/StatsGrid";
import { useAdminProblems } from "../hooks/useAdminProblems";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

export default function AdminDashboard() {
  useDocumentTitle("Dashboard · Admin");
  // "Recently added" means newest first — page 1 of the default ordering was
  // the five *oldest* problems in the set.
  const { data } = useAdminProblems({ page: 1, limit: 6, sort: "newest" });

  return (
    <div>
      {/* No page heading here: the topbar already says "Dashboard / Platform
          overview" a few pixels above, and repeating it was pure duplication. */}
      <StatsGrid />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Recently added</h2>
            <Link
              to="/admin/problems"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:opacity-80"
            >
              View all <ChevronRight size={15} />
            </Link>
          </div>
          <div className="space-y-2">
            {data?.problems.length ? (
              data.problems.map((p) => (
                <Link
                  key={p.id}
                  to={`/problems/${p.number}/${p.slug}`}
                  className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-4 py-2.5 transition-colors hover:border-line-strong hover:bg-surface"
                >
                  <span className="min-w-0 truncate text-sm text-ink">
                    <span className="mr-2 font-mono text-xs text-ink-subtle">
                      #{p.number}
                    </span>
                    {p.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-xs text-ink-subtle sm:inline">
                      {p.tags?.slice(0, 2).join(", ")}
                    </span>
                    <span className={badgeClass[p.difficulty] ?? "badge badge-easy"}>
                      {p.difficulty}
                    </span>
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-ink-subtle">
                No problems yet.
              </p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-base font-semibold text-ink">Quick actions</h2>
          <div className="space-y-2">
            <Link to="/admin/problems" className="btn btn-secondary w-full justify-start py-2.5">
              <Plus size={16} /> Add a problem
            </Link>
            <Link to="/admin/users" className="btn btn-secondary w-full justify-start py-2.5">
              <Users size={16} /> Manage users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
