import { Search } from "lucide-react";

interface ProblemFiltersProps {
  search: string;
  difficulty: string;
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
}

const difficulties = [
  { label: "All", value: "" },
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

export default function ProblemFilters({
  search,
  difficulty,
  onSearchChange,
  onDifficultyChange,
}: ProblemFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
        />
        <input
          type="text"
          placeholder="Search coding problems..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input py-3 pl-11 pr-4"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {difficulties.map((item) => (
          <button
            key={item.value}
            onClick={() => onDifficultyChange(item.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              difficulty === item.value
                ? "bg-brand text-on-brand"
                : "border border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
