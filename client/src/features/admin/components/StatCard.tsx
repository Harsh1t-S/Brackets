import type { ComponentType } from "react";

type Tone = "brand" | "accent" | "easy" | "medium" | "hard";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ComponentType<{ size?: number | string; className?: string }>;
  tone?: Tone;
}

const toneMap: Record<Tone, string> = {
  brand: "text-brand bg-brand-soft",
  accent: "text-accent bg-accent-soft",
  easy: "text-easy bg-easy/10",
  medium: "text-medium bg-medium/10",
  hard: "text-hard bg-hard/10",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  tone = "brand",
}: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong">
      {Icon && (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneMap[tone]}`}
        >
          <Icon size={18} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
          {title}
        </p>
        <p className="text-2xl font-bold tracking-tight text-ink">{value}</p>
      </div>
    </div>
  );
}
