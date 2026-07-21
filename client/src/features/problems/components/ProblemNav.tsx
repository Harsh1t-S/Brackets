import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useProblemContext } from "../hooks/useProblems";
import {
  difficultyBadgeClass,
  difficultyLabel,
} from "../../../lib/difficulty";
import type { ProblemSummary } from "../../../services/problem.service";

const href = (p: ProblemSummary) => `/problems/${p.number}/${p.slug}`;

export default function ProblemNav({ problemId }: { problemId: string }) {
  const { data, isLoading } = useProblemContext(problemId);

  // Rendered inside a tab, so it needs real states rather than `null`.
  if (isLoading || !data) {
    return <p className="text-sm text-ink-muted">Loading related problems…</p>;
  }

  const { prev, next, related } = data;
  if (!prev && !next && related.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No related problems yet — this one doesn't share topics with others.
      </p>
    );
  }

  return (
    <section className="space-y-6">
      {/* Prev / next */}
      {(prev || next) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              to={href(prev)}
              className="card group flex items-center gap-3 p-4 transition-colors hover:border-line-strong"
            >
              <ArrowLeft
                size={18}
                className="shrink-0 text-ink-subtle transition-colors group-hover:text-brand"
              />
              <span className="min-w-0">
                <span className="block text-xs text-ink-subtle">Previous</span>
                <span className="block truncate font-medium text-ink transition-colors group-hover:text-brand">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              to={href(next)}
              className="card group flex items-center justify-end gap-3 p-4 text-right transition-colors hover:border-line-strong"
            >
              <span className="min-w-0">
                <span className="block text-xs text-ink-subtle">Next</span>
                <span className="block truncate font-medium text-ink transition-colors group-hover:text-brand">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 text-ink-subtle transition-colors group-hover:text-brand"
              />
            </Link>
          )}
        </div>
      )}

      {/* Related by shared topics */}
      {related.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">
            Related problems
          </h2>
          <div className="space-y-2">
            {related.map((p) => (
              <Link
                key={p.id}
                to={href(p)}
                className="card group flex items-center justify-between p-3.5 transition-colors hover:border-line-strong"
              >
                <span className="min-w-0 truncate font-medium text-ink transition-colors group-hover:text-brand">
                  <span className="mr-2 text-ink-subtle">#{p.number}</span>
                  {p.title}
                </span>
                <span className={difficultyBadgeClass(p.difficulty)}>
                  {difficultyLabel(p.difficulty)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
