import type { AdminProblem } from "../../../types/adminProblem";
import { Link } from "react-router-dom";
import {
  difficultyBadgeClass,
  difficultyLabel,
} from "../../../lib/difficulty";

interface Props {
  problems: AdminProblem[];
}

export default function ProblemTable({ problems }: Props) {
  if (problems.length === 0) {
    return (
      <div className="card p-10 text-center text-ink-muted">
        No problems found.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-left text-xs uppercase tracking-wide text-ink-subtle">
              <th className="px-6 py-3.5 font-semibold">#</th>
              <th className="px-6 py-3.5 font-semibold">Title</th>
              <th className="px-6 py-3.5 text-center font-semibold">Difficulty</th>
              <th className="px-6 py-3.5 text-center font-semibold">Acceptance</th>
              <th className="px-6 py-3.5 font-semibold">Tags</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {problems.map((problem) => (
              <tr
                key={problem.id}
                className="group relative transition-colors hover:bg-surface-2 focus-within:bg-surface-2"
              >
                <td className="px-6 py-4 text-ink-subtle">{problem.number}</td>
                <td className="px-6 py-4 font-medium text-ink">
                  {/* Real link (keyboard, middle-click, open-in-new-tab). The
                      stretched ::after makes the whole row a click target. */}
                  <Link
                    to={`/problems/${problem.number}/${problem.slug}`}
                    className="rounded transition-colors after:absolute after:inset-0 group-hover:text-brand"
                  >
                    {problem.title}
                  </Link>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={difficultyBadgeClass(problem.difficulty)}>
                    {difficultyLabel(problem.difficulty)}
                  </span>
                </td>

                <td className="px-6 py-4 text-center text-ink-muted">
                  {problem.acceptance}%
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
