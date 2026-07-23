import { Users, FileCode, Bookmark, ListChecks } from "lucide-react";
import StatCard from "./StatCard";
import { useDashboardStats } from "../hooks/useDashboardStats";

const TONES = {
  easy: { label: "Easy", bar: "bg-easy" },
  medium: { label: "Medium", bar: "bg-medium" },
  hard: { label: "Hard", bar: "bg-hard" },
} as const;

export default function StatsGrid() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-24 animate-pulse p-4">
            <div className="h-3 w-16 rounded bg-surface-2" />
            <div className="mt-3 h-6 w-10 rounded bg-surface-2" />
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

  const { easyProblems: easy, mediumProblems: medium, hardProblems: hard } = data;
  const totalByDifficulty = easy + medium + hard;

  const split = [
    { key: "easy", value: easy },
    { key: "medium", value: medium },
    { key: "hard", value: hard },
  ] as const;

  // Guard the divisor: a fresh install has no problems, and "NaN%" is a worse
  // thing to render than a zero.
  const pct = (n: number) =>
    totalByDifficulty ? Math.round((n / totalByDifficulty) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Four compact figures rather than two enormous ones — the panel is
          1500px wide and was spending most of it on whitespace. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Problems" value={data.totalProblems} icon={FileCode} tone="brand" />
        <StatCard title="Users" value={data.totalUsers} icon={Users} tone="accent" />
        <StatCard title="Bookmarks" value={data.totalBookmarks} icon={Bookmark} tone="easy" />
        <StatCard
          title="Hard problems"
          value={hard}
          icon={ListChecks}
          tone="hard"
        />
      </div>

      {/* The difficulty split is the one figure here with a shape worth
          seeing, so show the proportion instead of three more loose numbers. */}
      <div className="card p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-ink">Difficulty mix</h3>
          <span className="text-xs text-ink-subtle">
            {totalByDifficulty} problems
          </span>
        </div>

        <div
          className="flex h-2.5 overflow-hidden rounded-full bg-surface-2"
          role="img"
          aria-label={`Difficulty mix: ${split
            .map((s) => `${s.value} ${TONES[s.key].label}`)
            .join(", ")}`}
        >
          {split.map(({ key, value }) => (
            <div
              key={key}
              className={TONES[key].bar}
              style={{ width: `${pct(value)}%` }}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {split.map(({ key, value }) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${TONES[key].bar}`} />
              <span className="text-sm font-medium text-ink">{value}</span>
              <span className="text-sm text-ink-subtle">{TONES[key].label}</span>
              <span className="text-xs text-ink-subtle">({pct(value)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
