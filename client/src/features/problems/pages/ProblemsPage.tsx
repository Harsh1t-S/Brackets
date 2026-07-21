import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, X } from "lucide-react";
import ProblemFilters from "../pages/ProblemFilters";
import { useProblems } from "../hooks/useProblems";
import ProblemTable from "../components/ProblemTable";
import Pagination from "../../../components/common/Pagination";
import ErrorState from "../../../components/common/ErrorState";
import { useDebounce } from "../../../hooks/useDebounce";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ProblemsPage() {
  useDocumentTitle("Problems");
  const [searchParams, setSearchParams] = useSearchParams();

  // Search is a controlled input (debounced); everything else is read straight
  // from the URL so difficulty/sort/page are shareable and survive reloads.
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const difficulty = searchParams.get("difficulty") ?? "";
  const sort = searchParams.get("sort") ?? "number";
  const page = Number(searchParams.get("page")) || 1;
  const tag = searchParams.get("tag") ?? "";

  // Merge a mutation into the URL params. Resets to page 1 unless told not to.
  function updateParams(
    mutate: (next: URLSearchParams) => void,
    resetPage = true
  ) {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    if (resetPage) next.delete("page");
    setSearchParams(next, { replace: true });
  }

  // Keep the URL ?search= in sync with the debounced input.
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search !== current) {
      updateParams((next) => {
        if (search) next.set("search", search);
        else next.delete("search");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function clearTag() {
    updateParams((next) => next.delete("tag"));
  }

  function clearAllFilters() {
    setSearch("");
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  const debouncedSearch = useDebounce(search);
  const hasActiveFilters = !!(debouncedSearch || difficulty || tag);

  const { data, isLoading, isError, refetch } = useProblems({
    search: debouncedSearch,
    difficulty,
    tag,
    sort,
    page,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Problem Set
        </h1>
        <p className="mt-2 text-ink-muted">
          {data
            ? `${data.total} problems to sharpen your skills`
            : "Browse the full problem set"}
        </p>
      </div>

      <ProblemFilters
        search={search}
        difficulty={difficulty}
        onSearchChange={setSearch}
        onDifficultyChange={(value) =>
          updateParams((next) => {
            if (value) next.set("difficulty", value);
            else next.delete("difficulty");
          })
        }
      />

      <div className="mb-6 flex items-center gap-2">
        <label className="text-sm text-ink-muted" htmlFor="problem-sort">
          Sort by
        </label>
        <select
          id="problem-sort"
          value={sort}
          onChange={(e) =>
            updateParams((next) => next.set("sort", e.target.value))
          }
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="number">Number</option>
          <option value="acceptance">Acceptance</option>
          <option value="likes">Most liked</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {tag && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-ink-muted">Filtering by topic:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
            {tag}
            <button onClick={clearTag} aria-label="Clear topic filter">
              <X size={14} />
            </button>
          </span>
        </div>
      )}

      {/* States */}
      {isLoading && (
        <div className="card divide-y divide-line overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
              <div className="ml-auto h-5 w-16 animate-pulse rounded-full bg-surface-2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          message="We couldn't load the problem set."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && data && (
        <>
          {data.problems.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-subtle">
                <SearchX size={24} />
              </span>
              <div>
                <h2 className="font-semibold text-ink">No problems found</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {hasActiveFilters
                    ? "No problems match your current filters."
                    : "There are no problems to show yet."}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="btn btn-secondary mt-1 px-4 py-2 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <ProblemTable problems={data.problems} />
          )}

          {data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onChange={(p) =>
                  updateParams((next) => next.set("page", String(p)), false)
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
