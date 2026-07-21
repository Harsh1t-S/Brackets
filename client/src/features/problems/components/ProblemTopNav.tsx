import { Link, useNavigate } from "react-router-dom";
import {
  Braces,
  ChevronLeft,
  ChevronRight,
  List,
  Shuffle,
} from "lucide-react";
import { useProblemContext } from "../hooks/useProblems";
import { getRandomProblem } from "../../../services/problem.service";
import type { ProblemSummary } from "../../../services/problem.service";
import { useAuth } from "../../auth/context/AuthContext";
import UserMenu from "../../../components/UserMenu";

/**
 * Slim bar for the solve view — this page renders outside MainLayout, so
 * it carries its own branding and account controls. Everything you need to
 * keep moving (list, prev, next, shuffle) sits on the left.
 */
export default function ProblemTopNav({ problemId }: { problemId: string }) {
  const { data } = useProblemContext(problemId);
  const { user } = useAuth();
  const navigate = useNavigate();

  const href = (p: ProblemSummary) => `/problems/${p.number}/${p.slug}`;
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 transition-colors";
  const enabled = "text-ink-muted hover:border-line-strong hover:text-ink";
  const disabled = "cursor-not-allowed text-ink-subtle opacity-40";

  async function goRandom() {
    try {
      const p = await getRandomProblem();
      navigate(`/problems/${p.number}/${p.slug}`);
    } catch {
      navigate("/problems");
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2" aria-label="Bracket home">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-on-brand">
            <Braces size={16} strokeWidth={2.5} />
          </span>
          <span className="hidden font-display text-base font-bold tracking-tight text-gradient sm:block">
            Bracket
          </span>
        </Link>

        <span className="h-5 w-px bg-line" aria-hidden />

        <Link
          to="/problems"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <List size={16} />
          <span className="hidden sm:block">Problem list</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {data?.prev ? (
            <Link
              to={href(data.prev)}
              title={`Previous: ${data.prev.title}`}
              aria-label={`Previous problem: ${data.prev.title}`}
              className={`${btn} ${enabled}`}
            >
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <span aria-hidden className={`${btn} ${disabled}`}>
              <ChevronLeft size={16} />
            </span>
          )}

          {data?.next ? (
            <Link
              to={href(data.next)}
              title={`Next: ${data.next.title}`}
              aria-label={`Next problem: ${data.next.title}`}
              className={`${btn} ${enabled}`}
            >
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span aria-hidden className={`${btn} ${disabled}`}>
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

      {user ? (
        <UserMenu />
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn btn-ghost px-3 py-1.5 text-sm">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary px-3 py-1.5 text-sm">
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
