import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, CornerDownLeft } from "lucide-react";
import { useProblems } from "../../problems/hooks/useProblems";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  difficultyBadgeClass,
  difficultyLabel,
} from "../../../lib/difficulty";
import { Spinner } from "../../../components/common/Spinner";

export default function SearchSection() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const debounced = useDebounce(term);
  const active = debounced.trim().length >= 2;

  // Live preview of the top matches — same search the problems page uses.
  const { data, isFetching } = useProblems(
    active ? { search: debounced, limit: 5 } : { limit: 5 }
  );
  const results = active ? data?.problems ?? [] : [];

  // Close the dropdown on an outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/problems?search=${encodeURIComponent(q)}` : "/problems");
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="card p-8 sm:p-10">
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Find your next challenge
          </h2>
          <p className="mt-3 text-center text-ink-muted">
            Search coding problems by title, topic, or company.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1" ref={boxRef}>
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <input
                type="text"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search problems..."
                aria-label="Search problems"
                className="input py-3.5 pl-11 pr-10"
              />
              {active && isFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner size={16} />
                </span>
              )}

              {/* Live results */}
              {open && active && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-line bg-elevated shadow-xl shadow-black/30">
                  {results.length === 0 ? (
                    <p className="px-4 py-3.5 text-sm text-ink-muted">
                      {isFetching
                        ? "Searching…"
                        : `No problems match "${debounced}".`}
                    </p>
                  ) : (
                    <>
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          to={`/problems/${p.number}/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-left transition-colors last:border-0 hover:bg-surface-2"
                        >
                          <span className="min-w-0 truncate text-sm font-medium text-ink">
                            <span className="mr-2 text-ink-subtle">
                              #{p.number}
                            </span>
                            {p.title}
                          </span>
                          <span className={difficultyBadgeClass(p.difficulty)}>
                            {difficultyLabel(p.difficulty)}
                          </span>
                        </Link>
                      ))}
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-1.5 bg-surface-2 px-4 py-2.5 text-xs font-medium text-brand transition-colors hover:bg-elevated"
                      >
                        See all results for "{debounced}"
                        <CornerDownLeft size={13} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary px-8 py-3.5">
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
