import { Code2, CircleDot, Gauge, Layers } from "lucide-react";
import { usePlatformStats } from "../../problems/hooks/usePlatformStats";

export default function Stats() {
  const { data } = usePlatformStats();

  const stats = [
    { icon: Code2, value: data?.totalProblems ?? "—", label: "Total Problems" },
    { icon: CircleDot, value: data?.easyProblems ?? "—", label: "Easy" },
    { icon: Gauge, value: data?.mediumProblems ?? "—", label: "Medium" },
    { icon: Layers, value: data?.totalTopics ?? "—", label: "Topics Covered" },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 lg:grid-cols-4 lg:gap-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="card p-6 transition-colors hover:border-line-strong"
          >
            <div className="mb-4 inline-flex rounded-xl bg-brand-soft p-3 text-brand">
              <Icon size={22} />
            </div>
            <p className="text-3xl font-bold tracking-tight text-ink">{value}</p>
            <p className="mt-1 text-sm text-ink-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
