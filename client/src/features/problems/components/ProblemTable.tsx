import type { AdminProblem } from "../../../types/adminProblem";
import { useNavigate } from "react-router-dom";

interface Props {
  problems: AdminProblem[];
}

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

const label: Record<string, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export default function ProblemTable({ problems }: Props) {
  const navigate = useNavigate();

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
              <th className="px-6 py-3.5 text-center font-semibold">Premium</th>
              <th className="px-6 py-3.5 font-semibold">Tags</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {problems.map((problem) => (
              <tr
                key={problem.id}
                onClick={() =>
                  navigate(`/problems/${problem.number}/${problem.slug}`)
                }
                className="cursor-pointer transition-colors hover:bg-surface-2"
              >
                <td className="px-6 py-4 text-ink-subtle">{problem.number}</td>
                <td className="px-6 py-4 font-medium text-ink">
                  {problem.title}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={badgeClass[problem.difficulty] ?? "badge badge-easy"}>
                    {label[problem.difficulty] ?? problem.difficulty}
                  </span>
                </td>

                <td className="px-6 py-4 text-center text-ink-muted">
                  {problem.acceptance}%
                </td>

                <td className="px-6 py-4 text-center">
                  {problem.premium ? (
                    <span className="text-medium">★</span>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
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
