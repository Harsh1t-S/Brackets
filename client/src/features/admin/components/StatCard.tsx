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
    <div className="card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-muted">{title}</p>
        {Icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneMap[tone]}`}
          >
            <Icon size={17} />
          </span>
        )}
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
        {value}
      </h2>
    </div>
  );
}
