import { Users, FileCode, Circle } from "lucide-react";
import StatCard from "./StatCard";
import { useDashboardStats } from "../hooks/useDashboardStats";

export default function StatsGrid() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-28 animate-pulse p-5">
            <div className="h-4 w-20 rounded bg-surface-2" />
            <div className="mt-4 h-7 w-12 rounded bg-surface-2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-8 text-center text-hard">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const primary = [
    { title: "Users", value: data.totalUsers, icon: Users, tone: "brand" as const },
    { title: "Problems", value: data.totalProblems, icon: FileCode, tone: "accent" as const },
  ];

  const byDifficulty = [
    { title: "Easy", value: data.easyProblems, icon: Circle, tone: "easy" as const },
    { title: "Medium", value: data.mediumProblems, icon: Circle, tone: "medium" as const },
    { title: "Hard", value: data.hardProblems, icon: Circle, tone: "hard" as const },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {primary.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          Problems by difficulty
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {byDifficulty.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
