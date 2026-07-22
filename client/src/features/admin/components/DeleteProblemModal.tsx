import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { AdminProblem } from "../../../types/adminProblem";

import { useDeleteProblem } from "../hooks/useAdminProblems";
import { useToast } from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";

interface Props {
  open: boolean;
  problem: AdminProblem | null;
  onClose: () => void;
}

export default function DeleteProblemModal({ open, problem, onClose }: Props) {
  const deleteMutation = useDeleteProblem();
  const toast = useToast();
  const [error, setError] = useState("");

  if (!open || !problem) return null;

  async function handleDelete() {
    setError("");
    try {
      const currentProblem = problem;
      if (!currentProblem) return;
      await deleteMutation.mutateAsync(currentProblem.id);
      toast(`"${currentProblem.title}" deleted`, "success");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete problem. Please try again.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="delete-problem-title"
      dismissable={!deleteMutation.isPending}
    >
      <>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hard/15 text-hard">
            <AlertTriangle size={22} />
          </span>
          <h2 id="delete-problem-title" className="text-lg font-bold text-ink">
            Delete problem
          </h2>
        </div>

        <p className="mt-4 text-ink-muted">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-ink">{problem.title}</span>? This
          action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-hard/30 bg-hard/10 px-4 py-3 text-sm text-hard">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="btn btn-secondary px-5 py-2.5"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn px-5 py-2.5 text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--color-hard)" }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </>
    </Modal>
  );
}
