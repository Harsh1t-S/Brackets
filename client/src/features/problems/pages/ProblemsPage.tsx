import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import ProblemFilters from "../pages/ProblemFilters";
import { useProblems } from "../hooks/useProblems";
import ProblemTable from "../components/ProblemTable";
import Pagination from "../../../components/common/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ProblemsPage() {
  useDocumentTitle("Problems");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("number");
  const [page, setPage] = useState(1);
  const tag = searchParams.get("tag") ?? "";

  // Keep the URL ?search= in sync so the query is shareable / survives reloads.
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search !== current) {
      const next = new URLSearchParams(searchParams);
      if (search) next.set("search", search);
      else next.delete("search");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function clearTag() {
    const next = new URLSearchParams(searchParams);
    next.delete("tag");
    setSearchParams(next, { replace: true });
    setPage(1);
  }

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError } = useProblems({
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
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onDifficultyChange={(value) => {
          setDifficulty(value);
          setPage(1);
        }}
      />

      <div className="mb-6 flex items-center gap-2">
        <label className="text-sm text-ink-muted" htmlFor="problem-sort">
          Sort by
        </label>
        <select
          id="problem-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
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
        <div className="card p-10 text-center text-hard">
          Failed to load problems.
        </div>
      )}

      {!isLoading && !isError && data && (
        <>
          <ProblemTable problems={data.problems} />

          {data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
