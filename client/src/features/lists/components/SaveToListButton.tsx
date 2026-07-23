import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, ChevronDown, Check, Plus } from "lucide-react";

import {
  useCreateList,
  useListsForProblem,
  useToggleFavourite,
  useToggleListItem,
} from "../hooks/useLists";
import { useAuth } from "../../auth/context/AuthContext";
import { useToast } from "../../../components/common/Toast";

interface Props {
  problemId: string;
}

/**
 * Split control: the main button saves to Favourites in one click (what the
 * old bookmark button did), and the caret opens every other list. Keeping the
 * one-click path intact matters — a picker on every save would be a
 * regression for the common case.
 */
export default function SaveToListButton({ problemId }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Fetched whenever signed in, not just while the menu is open: the button's
  // filled state depends on it, and this is the same single request the old
  // bookmark list cost.
  const { data: lists = [] } = useListsForProblem(problemId, !!user);
  const toggleFavourite = useToggleFavourite();
  const toggleItem = useToggleListItem();
  const createList = useCreateList();

  const saved = lists.find((l) => l.isDefault)?.contains ?? false;

  // Close on an outside click or Escape, like any other menu.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function requireAuth(): boolean {
    if (user) return true;
    navigate("/login");
    return false;
  }

  function saveToFavourites() {
    if (!requireAuth()) return;
    toggleFavourite.mutate(problemId, {
      onSuccess: (result) =>
        toast(
          result.saved ? "Saved to Favourites" : "Removed from Favourites",
          "success"
        ),
      onError: () => toast("Couldn't save this problem", "error"),
    });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    createList.mutate(
      { name },
      {
        onSuccess: (list) => {
          toggleItem.mutate({ listId: list.id, problemId, contains: false });
          setNewName("");
          setCreating(false);
          toast(`Added to "${list.name}"`, "success");
        },
        onError: () => toast("Couldn't create that list", "error"),
      }
    );
  }

  return (
    <div ref={wrapRef} className="relative flex w-full">
      <button
        onClick={saveToFavourites}
        disabled={toggleFavourite.isPending}
        title={user ? undefined : "Sign in to save"}
        className={`flex flex-1 items-center justify-center gap-2 rounded-l-lg border py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          saved
            ? "border-brand/30 bg-brand-soft text-brand"
            : "border-line bg-surface-2 text-ink-muted hover:text-ink"
        }`}
      >
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {saved ? "Saved" : "Save"}
      </button>

      <button
        onClick={() => (requireAuth() ? setOpen((v) => !v) : undefined)}
        aria-label="Save to a list"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`-ml-px rounded-r-lg border px-2 transition-colors ${
          open
            ? "border-brand/30 bg-brand-soft text-brand"
            : "border-line bg-surface-2 text-ink-muted hover:text-ink"
        }`}
      >
        <ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-elevated shadow-lg shadow-black/40"
        >
          <p className="border-b border-line px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Save to
          </p>

          <div className="max-h-56 overflow-y-auto py-1">
            {lists.map((list) => (
              <button
                key={list.id}
                role="menuitemcheckbox"
                aria-checked={list.contains}
                onClick={() =>
                  toggleItem.mutate({
                    listId: list.id,
                    problemId,
                    contains: list.contains,
                  })
                }
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-2"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    list.contains
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line-strong"
                  }`}
                >
                  {list.contains && <Check size={11} />}
                </span>
                <span className="truncate">{list.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-line p-2">
            {creating ? (
              <form onSubmit={handleCreate} className="flex gap-1.5">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="List name"
                  maxLength={60}
                  aria-label="New list name"
                  className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={!newName.trim() || createList.isPending}
                  className="btn btn-primary px-2.5 py-1.5 text-xs disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <Plus size={15} /> New list
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
