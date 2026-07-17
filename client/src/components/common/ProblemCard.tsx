import { Link } from "react-router-dom";
import { ArrowUpRight, Lock } from "lucide-react";

interface ProblemCardProps {
  number: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | string;
  acceptance?: number;
  tags: string[];
  premium?: boolean;
}

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

const label: Record<string, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export default function ProblemCard({
  number,
  title,
  slug,
  difficulty,
  acceptance,
  tags,
  premium,
}: ProblemCardProps) {
  return (
    <Link
      to={`/problems/${number}/${slug}`}
      className="card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-ink transition-colors group-hover:text-brand">
          <span className="text-ink-subtle">#{number}</span>
          {title}
          {premium && <Lock size={14} className="text-medium" />}
        </h3>
        <ArrowUpRight
          size={18}
          className="shrink-0 text-ink-subtle transition-colors group-hover:text-brand"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className={badgeClass[difficulty] ?? "badge badge-easy"}>
          {label[difficulty] ?? difficulty}
        </span>
        {typeof acceptance === "number" && acceptance > 0 && (
          <span className="text-sm text-ink-subtle">
            {acceptance.toFixed(1)}% accepted
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
