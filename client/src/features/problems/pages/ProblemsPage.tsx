import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import AdvancedFilters, {
  type FilterState,
} from "../components/AdvancedFilters";
import { useProblems, useFilterFacets } from "../hooks/useProblems";
import ProblemTable from "../components/ProblemTable";
import Pagination from "../../../components/common/Pagination";
import ErrorState from "../../../components/common/ErrorState";
import { useDebounce } from "../../../hooks/useDebounce";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuth } from "../../auth/context/AuthContext";

/** Read a repeatable filter out of the URL ("a,b" -> ["a","b"]). */
function readList(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  return raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

export default function ProblemsPage() {
  useDocumentTitle("Problems");
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Search is a controlled input (debounced); everything else is read straight
  // from the URL so every filter is shareable and survives reloads.
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const page = Number(searchParams.get("page")) || 1;

  // `tag` (singular) is still produced by topic links elsewhere in the app.
  const tags = [...new Set([...readList(searchParams, "tag"), ...readList(searchParams, "tags")])];

  const filterState: FilterState = {
    search,
    difficulties: readList(searchParams, "difficulty"),
    tags,
    companies: readList(searchParams, "companies"),
    match: searchParams.get("match") === "all" ? "all" : "any",
    status: searchParams.get("status") ?? "",
  };

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

  /** Write a list filter back to the URL, dropping it when empty. */
  function setList(next: URLSearchParams, key: string, values: string[]) {
    if (values.length) next.set(key, values.join(","));
    else next.delete(key);
  }

  function applyFilters(patch: Partial<FilterState>) {
    if (patch.search !== undefined) {
      setSearch(patch.search);
      return; // the debounce effect syncs the URL
    }
    updateParams((next) => {
      if (patch.difficulties) setList(next, "difficulty", patch.difficulties);
      if (patch.tags) {
        // Collapse the legacy singular param into the canonical one.
        next.delete("tag");
        setList(next, "tags", patch.tags);
      }
      if (patch.companies) setList(next, "companies", patch.companies);
      if (patch.match) next.set("match", patch.match);
      if (patch.status !== undefined) {
        if (patch.status) next.set("status", patch.status);
        else next.delete("status");
      }
    });
  }

  // Keep the URL ?search= in sync with the debounced input.
  const debouncedSearch = useDebounce(search);

  // Default to relevance while searching (best-match first) and to problem
  // number otherwise — unless the user picked a sort explicitly.
  const sort = searchParams.get("sort") ?? (debouncedSearch ? "relevance" : "number");

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debouncedSearch !== current) {
      updateParams((next) => {
        if (debouncedSearch) next.set("search", debouncedSearch);
        else next.delete("search");
        // "Relevance" only exists while there's a term to be relevant to.
        // Leaving it in the URL left the <select> on a value with no
        // matching <option>, which renders as an empty box — while the
        // server quietly fell back to sorting by number.
        if (!debouncedSearch && next.get("sort") === "relevance") {
          next.delete("sort");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Adopt the URL's term when it changes from outside this input — browser
  // back/forward, or a link carrying ?search=. Without this the box kept the
  // old text while the results below it changed. Adjusting during render
  // (rather than in an effect) avoids a second render pass with stale text.
  const urlSearch = searchParams.get("search") ?? "";
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);
  if (urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    if (urlSearch !== debouncedSearch) setSearch(urlSearch);
  }

  function clearAllFilters() {
    setSearch("");
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  const hasActiveFilters = !!(
    debouncedSearch ||
    filterState.difficulties.length ||
    filterState.tags.length ||
    filterState.companies.length ||
    filterState.status
  );

  const { data: facets } = useFilterFacets();

  const { data, isLoading, isError, refetch } = useProblems({
    search: debouncedSearch,
    difficulties: filterState.difficulties,
    tags: filterState.tags,
    companies: filterState.companies,
    match: filterState.match,
    status: filterState.status,
    sort,
    page,
  });

  // A page past the end (a stale link, or a filter that narrowed the set)
  // returned an empty list and the "no problems yet" empty state. Snap back
  // to the last real page instead.
  useEffect(() => {
    if (data && data.totalPages > 0 && page > data.totalPages) {
      updateParams((next) => next.set("page", String(data.totalPages)), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Problem Set
        </h1>
        <p className="mt-2 text-ink-muted">
          {data
            ? `${data.total} problem${data.total === 1 ? "" : "s"} ${
                hasActiveFilters
                  ? `${data.total === 1 ? "matches" : "match"} your filters`
                  : "to sharpen your skills"
              }`
            : "Browse the full problem set"}
        </p>
      </div>

      <AdvancedFilters
        state={filterState}
        facets={facets}
        canFilterByStatus={!!user}
        onChange={applyFilters}
        onClearAll={clearAllFilters}
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
          {debouncedSearch && <option value="relevance">Relevance</option>}
          <option value="number">Number</option>
          <option value="solved">Most solved</option>
          <option value="likes">Most liked</option>
          <option value="newest">Newest</option>
        </select>
      </div>

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
