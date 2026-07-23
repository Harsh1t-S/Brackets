import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Lock,
  Star,
  Trash2,
  Link2,
  Check,
  CircleCheck,
} from "lucide-react";

import { useDeleteList, useList, useUpdateList } from "../hooks/useLists";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useToast } from "../../../components/common/Toast";
import { difficultyBadgeClass, difficultyLabel } from "../../../lib/difficulty";
import Modal from "../../../components/common/Modal";
import { PageLoader } from "../../../components/common/Spinner";

export default function ListDetailPage() {
  const { slug } = useParams();
  const { data: list, isLoading, isError } = useList(slug);
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const toast = useToast();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  useDocumentTitle(list ? list.name : "List");

  if (isLoading) return <PageLoader label="Loading list…" />;

  // A private list belonging to someone else 404s server-side, so this covers
  // both "gone" and "not yours".
  if (isError || !list) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">List not found</h1>
        <p className="mt-2 text-ink-muted">
          It may have been deleted, or it's private.
        </p>
        <Link to="/lists" className="btn btn-secondary mt-6 px-4 py-2 text-sm">
          Back to my lists
        </Link>
      </div>
    );
  }

  // Captured after the guard above: a hoisted function declaration doesn't
  // inherit the narrowing, so the handlers below need a definite reference.
  const current = list;
  const isPublic = current.visibility === "PUBLIC";

  function toggleVisibility() {
    updateList.mutate(
      { id: current.id, visibility: isPublic ? "PRIVATE" : "PUBLIC" },
      {
        onSuccess: () =>
          toast(isPublic ? "List is now private" : "List is now public", "success"),
        onError: () => toast("Couldn't change visibility", "error"),
      }
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("Couldn't copy the link", "error");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/lists"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} /> My Lists
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-ink">
            {list.isDefault && (
              <Star size={22} className="shrink-0 text-brand" fill="currentColor" />
            )}
            {list.name}
          </h1>
          {list.description && (
            <p className="mt-2 max-w-2xl text-ink-muted">{list.description}</p>
          )}
          <p className="mt-2 text-sm text-ink-subtle">
            {list.items.length} {list.items.length === 1 ? "problem" : "problems"}
            {!list.isOwner && <> · by {list.user.name}</>}
          </p>
        </div>

        {list.isOwner && (
          <div className="flex shrink-0 items-center gap-2">
            {isPublic && (
              <button
                onClick={copyLink}
                className="btn btn-secondary px-3 py-2 text-sm"
              >
                {copied ? <Check size={15} /> : <Link2 size={15} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            )}
            <button
              onClick={toggleVisibility}
              disabled={updateList.isPending}
              className="btn btn-secondary px-3 py-2 text-sm disabled:opacity-50"
            >
              {isPublic ? <Globe size={15} /> : <Lock size={15} />}
              {isPublic ? "Public" : "Private"}
            </button>
            {!list.isDefault && (
              <button
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete list"
                className="btn btn-secondary px-2.5 py-2 text-sm text-hard"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        {list.items.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-12 text-center">
            <h2 className="font-semibold text-ink">Nothing here yet</h2>
            <p className="max-w-sm text-sm text-ink-muted">
              Open any problem and use the Save button to add it to this list.
            </p>
            <Link to="/problems" className="btn btn-primary mt-1 px-4 py-2 text-sm">
              Browse problems
            </Link>
          </div>
        ) : (
          <div className="card divide-y divide-line overflow-hidden">
            {list.items.map((problem) => (
              <Link
                key={problem.id}
                to={`/problems/${problem.number}/${problem.slug}`}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="w-6 shrink-0">
                  {problem.solved && (
                    <CircleCheck size={16} className="text-easy" />
                  )}
                </span>
                <span className="w-10 shrink-0 font-mono text-xs text-ink-subtle">
                  #{problem.number}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink">
                  {problem.title}
                </span>
                <span className="hidden max-w-[16rem] truncate text-xs text-ink-subtle md:inline">
                  {problem.tags.slice(0, 3).join(", ")}
                </span>
                <span className={`${difficultyBadgeClass(problem.difficulty)} shrink-0`}>
                  {difficultyLabel(problem.difficulty)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        labelledBy="delete-list-title"
        dismissable={!deleteList.isPending}
      >
        <>
          <h2 id="delete-list-title" className="text-lg font-bold text-ink">
            Delete this list?
          </h2>
          <p className="mt-3 text-ink-muted">
            <span className="font-semibold text-ink">{list.name}</span> and its{" "}
            {list.items.length}{" "}
            {list.items.length === 1 ? "entry" : "entries"} will be removed. The
            problems themselves aren't affected.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleteList.isPending}
              className="btn btn-secondary px-5 py-2.5"
            >
              Keep it
            </button>
            <button
              onClick={() =>
                deleteList.mutate(list.id, {
                  onSuccess: () => {
                    toast(`"${list.name}" deleted`, "success");
                    navigate("/lists");
                  },
                  onError: () => toast("Couldn't delete that list", "error"),
                })
              }
              disabled={deleteList.isPending}
              className="btn px-5 py-2.5 text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--color-hard)" }}
            >
              {deleteList.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </>
      </Modal>
    </div>
  );
}
