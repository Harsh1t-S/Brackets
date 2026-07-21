import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import type { FilterFacet } from "../../../services/problem.service";

export interface FilterState {
  search: string;
  difficulties: string[];
  tags: string[];
  companies: string[];
  match: "all" | "any";
  status: string;
}

interface Props {
  state: FilterState;
  facets?: { tags: FilterFacet[]; companies: FilterFacet[] };
  /** Status filters need a signed-in user. */
  canFilterByStatus: boolean;
  onChange: (patch: Partial<FilterState>) => void;
  onClearAll: () => void;
}

const DIFFICULTIES = [
  { label: "Easy", value: "EASY", tone: "easy" },
  { label: "Medium", value: "MEDIUM", tone: "medium" },
  { label: "Hard", value: "HARD", tone: "hard" },
];

const STATUSES = [
  { label: "Solved", value: "solved" },
  { label: "Unsolved", value: "unsolved" },
  { label: "Bookmarked", value: "bookmarked" },
];

const toneRing: Record<string, string> = {
  easy: "border-easy/50 bg-easy/10 text-easy",
  medium: "border-medium/50 bg-medium/10 text-medium",
  hard: "border-hard/50 bg-hard/10 text-hard",
};

/** Toggle a value in/out of a list. */
function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function FacetPicker({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: FilterFacet[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? options.filter((o) => o.value.toLowerCase().includes(q))
      : options;
    // Always keep selected values visible even when collapsed.
    if (showAll || q) return list;
    const head = list.slice(0, 12);
    const missing = list.filter(
      (o) => selected.includes(o.value) && !head.includes(o)
    );
    return [...head, ...missing];
  }, [options, query, showAll, selected]);

  if (options.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          {title}
        </p>
        {options.length > 12 && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${title.toLowerCase()}…`}
            aria-label={`Filter ${title}`}
            className="w-36 rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink outline-none focus:border-brand"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filtered.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => onToggle(o.value)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-brand/50 bg-brand-soft text-brand"
                  : "border-line bg-surface-2 text-ink-muted hover:text-ink"
              }`}
            >
              {active && <Check size={12} />}
              {o.value}
              <span className="text-ink-subtle">{o.count}</span>
            </button>
          );
        })}

        {!showAll && !query && options.length > 12 && (
          <button
            onClick={() => setShowAll(true)}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-brand hover:opacity-80"
          >
            +{options.length - 12} more
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdvancedFilters({
  state,
  facets,
  canFilterByStatus,
  onChange,
  onClearAll,
}: Props) {
  const [open, setOpen] = useState(false);

  const activeCount =
    state.difficulties.length +
    state.tags.length +
    state.companies.length +
    (state.status ? 1 : 0);

  const multiSelected = state.tags.length + state.companies.length > 1;

  return (
    <div className="mb-6">
      {/* Search + panel toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="text"
            placeholder="Search by title, topic or company…"
            value={state.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="input py-3 pl-11 pr-4"
          />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`btn px-4 py-2.5 text-sm ${
            activeCount ? "btn-primary" : "btn-secondary"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-black/20 px-1.5 text-xs">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter summary */}
      {activeCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {state.difficulties.map((d) => (
            <Chip
              key={d}
              label={DIFFICULTIES.find((x) => x.value === d)?.label ?? d}
              onRemove={() =>
                onChange({ difficulties: toggle(state.difficulties, d) })
              }
            />
          ))}
          {state.tags.map((t) => (
            <Chip
              key={t}
              label={t}
              onRemove={() => onChange({ tags: toggle(state.tags, t) })}
            />
          ))}
          {state.companies.map((c) => (
            <Chip
              key={c}
              label={c}
              onRemove={() =>
                onChange({ companies: toggle(state.companies, c) })
              }
            />
          ))}
          {state.status && (
            <Chip
              label={
                STATUSES.find((s) => s.value === state.status)?.label ??
                state.status
              }
              onRemove={() => onChange({ status: "" })}
            />
          )}
          <button
            onClick={onClearAll}
            className="ml-1 text-xs font-medium text-ink-subtle underline-offset-2 hover:text-ink hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div className="card mt-4 space-y-5 p-5">
          {/* Difficulty */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Difficulty
            </p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => {
                const active = state.difficulties.includes(d.value);
                return (
                  <button
                    key={d.value}
                    onClick={() =>
                      onChange({
                        difficulties: toggle(state.difficulties, d.value),
                      })
                    }
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? toneRing[d.tone]
                        : "border-line bg-surface-2 text-ink-muted hover:text-ink"
                    }`}
                  >
                    {active && <Check size={13} />}
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status (signed-in only) */}
          {canFilterByStatus && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                My progress
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => {
                  const active = state.status === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() =>
                        onChange({ status: active ? "" : s.value })
                      }
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-brand/50 bg-brand-soft text-brand"
                          : "border-line bg-surface-2 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {active && <Check size={13} />}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <FacetPicker
            title="Topics"
            options={facets?.tags ?? []}
            selected={state.tags}
            onToggle={(v) => onChange({ tags: toggle(state.tags, v) })}
          />

          <FacetPicker
            title="Companies"
            options={facets?.companies ?? []}
            selected={state.companies}
            onToggle={(v) => onChange({ companies: toggle(state.companies, v) })}
          />

          {/* Match mode — only meaningful with 2+ selections */}
          {multiSelected && (
            <div className="flex items-center gap-3 border-t border-line pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Match
              </span>
              <div className="flex overflow-hidden rounded-lg border border-line">
                {(["any", "all"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => onChange({ match: m })}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      state.match === m
                        ? "bg-brand text-on-brand"
                        : "bg-surface-2 text-ink-muted hover:text-ink"
                    }`}
                  >
                    {m === "any" ? "Any of these" : "All of these"}
                  </button>
                ))}
              </div>
              <span className="text-xs text-ink-subtle">
                {state.match === "all"
                  ? "Problems matching every selection"
                  : "Problems matching at least one"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={13} />
      </button>
    </span>
  );
}
