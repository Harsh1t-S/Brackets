import { useState } from "react";
import { Plus } from "lucide-react";

import type { AdminProblem } from "../../../types/adminProblem";

import SearchBar from "../components/SearchBar";
import DifficultyFilter from "../components/DifficultyFilter";
import ProblemsTable from "../components/ProblemsTable";
import ProblemFormModal from "../components/ProblemFormModal";
import DeleteProblemModal from "../components/DeleteProblemModal";
import Pagination from "../../../components/common/Pagination";

import { useAdminProblems } from "../hooks/useAdminProblems";
import { useDebounce } from "../../../hooks/useDebounce";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ProblemsManagement() {
  useDocumentTitle("Problems · Admin");
  const [open, setOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<AdminProblem | null>(null);
  const [deletingProblem, setDeletingProblem] = useState<AdminProblem | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError } = useAdminProblems({
    page,
    limit: 10,
    search: debouncedSearch,
    difficulty,
  });

  function handleAddProblem() {
    setEditingProblem(null);
    setOpen(true);
  }

  function handleEditProblem(problem: AdminProblem) {
    setEditingProblem(problem);
    setOpen(true);
  }

  function handleDeleteProblem(problem: AdminProblem) {
    setDeletingProblem(problem);
  }

  return (
    <>
      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Problems
            </h1>
            <p className="mt-1 text-ink-muted">Manage coding problems.</p>
          </div>

          <button onClick={handleAddProblem} className="btn btn-primary px-5 py-2.5">
            <Plus size={18} />
            Add Problem
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
          <DifficultyFilter
            value={difficulty}
            onChange={(v) => {
              setDifficulty(v);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">
            Loading problems...
          </div>
        ) : isError ? (
          <div className="card p-8 text-center text-hard">
            Failed to load problems.
          </div>
        ) : (
          <>
            <ProblemsTable
              problems={data?.problems ?? []}
              onEdit={handleEditProblem}
              onDelete={handleDeleteProblem}
            />

            {data && data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ProblemFormModal
        open={open}
        onClose={() => setOpen(false)}
        editingProblem={editingProblem}
      />

      <DeleteProblemModal
        open={!!deletingProblem}
        problem={deletingProblem}
        onClose={() => setDeletingProblem(null)}
      />
    </>
  );
}
