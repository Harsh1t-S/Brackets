import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { AdminUser } from "../services/adminUser.service";

import { useDeleteUser } from "../hooks/useAdminUsers";
import { useToast } from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";

interface Props {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
}

export default function DeleteUserModal({ open, user, onClose }: Props) {
  const deleteMutation = useDeleteUser();
  const toast = useToast();
  const [error, setError] = useState("");

  if (!open || !user) return null;

  async function handleDelete() {
    setError("");
    const target = user;
    if (!target) return;
    try {
      await deleteMutation.mutateAsync(target.id);
      toast(`${target.name}'s account was deleted`, "success");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete this user. Please try again.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="delete-user-title"
      dismissable={!deleteMutation.isPending}
    >
      <>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hard/15 text-hard">
            <AlertTriangle size={22} />
          </span>
          <h2 id="delete-user-title" className="text-lg font-bold text-ink">
            Delete user
          </h2>
        </div>

        <p className="mt-4 text-ink-muted">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-ink">{user.name}</span> (
          {user.email})? Their bookmarks, votes and solved history are removed.
          This action cannot be undone.
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
