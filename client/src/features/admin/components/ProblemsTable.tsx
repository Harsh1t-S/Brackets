import { Pencil, Trash2 } from "lucide-react";

import type { AdminProblem } from "../../../types/adminProblem";

interface Props {
  problems: AdminProblem[];
  onEdit: (problem: AdminProblem) => void;
  onDelete: (problem: AdminProblem) => void;
}

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

export default function ProblemsTable({ problems, onEdit, onDelete }: Props) {
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
              <th className="px-6 py-3.5 font-semibold">Difficulty</th>
              <th className="px-6 py-3.5 font-semibold">Premium</th>
              <th className="px-6 py-3.5 text-center font-semibold">Acceptance</th>
              <th className="px-6 py-3.5 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {problems.map((problem) => (
              <tr key={problem.id} className="transition-colors hover:bg-surface-2">
                <td className="px-6 py-4 text-ink-subtle">{problem.number}</td>
                <td className="px-6 py-4 font-medium text-ink">
                  {problem.title}
                </td>

                <td className="px-6 py-4">
                  <span className={badgeClass[problem.difficulty] ?? "badge badge-easy"}>
                    {problem.difficulty}
                  </span>
                </td>

                <td className="px-6 py-4 text-ink-muted">
                  {problem.premium ? "Yes" : "No"}
                </td>

                <td className="px-6 py-4 text-center text-ink-muted">
                  {problem.acceptance}%
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(problem)}
                      aria-label="Edit"
                      className="rounded-lg border border-line bg-surface-2 p-2 text-ink-muted transition-colors hover:text-brand"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(problem)}
                      aria-label="Delete"
                      className="rounded-lg border border-line bg-surface-2 p-2 text-ink-muted transition-colors hover:text-hard"
                    >
                      <Trash2 size={16} />
                    </button>
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
