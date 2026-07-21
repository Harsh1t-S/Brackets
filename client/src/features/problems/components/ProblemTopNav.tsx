import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useProblemContext } from "../hooks/useProblems";
import { getRandomProblem } from "../../../services/problem.service";
import type { ProblemSummary } from "../../../services/problem.service";

/**
 * The strip above the problem: back to the list on the left, and the
 * "keep moving" controls (previous / next / shuffle) on the right —
 * where solvers expect them rather than buried below the statement.
 */
export default function ProblemTopNav({ problemId }: { problemId: string }) {
  const { data } = useProblemContext(problemId);
  const navigate = useNavigate();

  const href = (p: ProblemSummary) => `/problems/${p.number}/${p.slug}`;
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 transition-colors";

  async function goRandom() {
    try {
      const p = await getRandomProblem();
      navigate(`/problems/${p.number}/${p.slug}`);
    } catch {
      navigate("/problems");
    }
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <Link
        to="/problems"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} />
        All problems
      </Link>

      <div className="flex items-center gap-1.5">
        {data?.prev ? (
          <Link
            to={href(data.prev)}
            title={`Previous: ${data.prev.title}`}
            aria-label={`Previous problem: ${data.prev.title}`}
            className={`${btn} text-ink-muted hover:border-line-strong hover:text-ink`}
          >
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span
            aria-hidden
            className={`${btn} cursor-not-allowed text-ink-subtle opacity-40`}
          >
            <ChevronLeft size={16} />
          </span>
        )}

        {data?.next ? (
          <Link
            to={href(data.next)}
            title={`Next: ${data.next.title}`}
            aria-label={`Next problem: ${data.next.title}`}
            className={`${btn} text-ink-muted hover:border-line-strong hover:text-ink`}
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span
            aria-hidden
            className={`${btn} cursor-not-allowed text-ink-subtle opacity-40`}
          >
            <ChevronRight size={16} />
          </span>
        )}

        <button
          onClick={goRandom}
          title="Random problem"
          aria-label="Go to a random problem"
          className={`${btn} text-ink-muted hover:border-line-strong hover:text-brand`}
        >
          <Shuffle size={15} />
        </button>
      </div>
    </div>
  );
}
