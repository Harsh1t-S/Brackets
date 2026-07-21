import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronRight, Search } from "lucide-react";

import { useBookmarks } from "../hooks/useBookmarks";
import Pagination from "../../../components/common/Pagination";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { difficultyBadgeClass, plural } from "../../../lib/difficulty";
import { PageLoader } from "../../../components/common/Spinner";
import ErrorState from "../../../components/common/ErrorState";

const PAGE_SIZE = 8;

export default function BookmarksPage() {
  useDocumentTitle("Bookmarks");
  const { data: bookmarks = [], isLoading, isError, refetch } = useBookmarks();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookmarks;
    return bookmarks.filter((b) => b.problem.title.toLowerCase().includes(q));
  }, [bookmarks, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return <PageLoader label="Loading bookmarks…" />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <ErrorState
          message="We couldn't load your bookmarks."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          My Bookmarks
        </h1>
        <p className="mt-2 text-ink-muted">
          {plural(bookmarks.length, "bookmarked problem")}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-ink-subtle">
            <Bookmark size={26} />
          </span>
          <h2 className="mt-5 text-xl font-semibold text-ink">
            No bookmarks yet
          </h2>
          <p className="mt-2 text-ink-muted">
            Bookmark problems to find them here.
          </p>
          <Link to="/problems" className="btn btn-primary mt-6 px-5 py-2.5">
            Browse problems
          </Link>
        </div>
      ) : (
        <>
          <div className="relative mb-6 max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search your bookmarks..."
              className="input py-2.5 pl-11 pr-4"
            />
          </div>

          {visible.length === 0 ? (
            <div className="card p-10 text-center text-ink-muted">
              No bookmarks match "{search}".
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((bookmark) => (
                <Link
                  key={bookmark.id}
                  to={`/problems/${bookmark.problem.number}/${bookmark.problem.slug}`}
                  className="card group flex items-center justify-between p-5 transition-colors hover:border-line-strong"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-ink transition-colors group-hover:text-brand">
                      <span className="mr-2 text-ink-subtle">
                        #{bookmark.problem.number}
                      </span>
                      {bookmark.problem.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={difficultyBadgeClass(
                          bookmark.problem.difficulty
                        )}
                      >
                        {bookmark.problem.difficulty}
                      </span>
                      {bookmark.problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-ink-subtle transition-colors group-hover:text-brand"
                  />
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
