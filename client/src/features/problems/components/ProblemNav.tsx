import { Link } from "react-router-dom";
import { useProblemContext } from "../hooks/useProblems";
import {
  difficultyBadgeClass,
  difficultyLabel,
} from "../../../lib/difficulty";

/**
 * Problems sharing a topic with this one. Previous/next live in the header
 * (see ProblemTopNav) so the two navigation ideas aren't duplicated.
 */
export default function ProblemNav({ problemId }: { problemId: string }) {
  const { data, isLoading } = useProblemContext(problemId);

  if (isLoading || !data) {
    return <p className="text-sm text-ink-muted">Loading related problems…</p>;
  }

  if (data.related.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No related problems yet — this one doesn't share topics with others.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {data.related.map((p) => (
        <Link
          key={p.id}
          to={`/problems/${p.number}/${p.slug}`}
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
  );
}
