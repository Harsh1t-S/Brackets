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
  const { data } = useAdminProblems({ page: 1, limit: 5 });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-ink-muted">
          Welcome to the Bracket admin panel.
        </p>
      </div>

      <StatsGrid />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
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
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-4 py-3"
                >
                  <span className="text-sm text-ink">
                    <span className="mr-2 text-ink-subtle">#{p.number}</span>
                    {p.title}
                  </span>
                  <span className={badgeClass[p.difficulty] ?? "badge badge-easy"}>
                    {p.difficulty}
                  </span>
                </div>
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
