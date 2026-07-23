import { useState } from "react";
import { Link } from "react-router-dom";
import { ListPlus, Globe, Lock, Star, ChevronRight } from "lucide-react";

import { useCreateList, useMyLists } from "../hooks/useLists";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useToast } from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";
import ErrorState from "../../../components/common/ErrorState";

export default function ListsPage() {
  useDocumentTitle("My Lists");
  const { data: lists = [], isLoading, isError, refetch } = useMyLists();
  const createList = useCreateList();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    createList.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        visibility: isPublic ? "PUBLIC" : "PRIVATE",
      },
      {
        onSuccess: (list) => {
          toast(`"${list.name}" created`, "success");
          setOpen(false);
          setName("");
          setDescription("");
          setIsPublic(false);
        },
        onError: (err) => {
          const message = (
            err as { response?: { data?: { message?: string } } }
          )?.response?.data?.message;
          setError(message ?? "Couldn't create that list.");
        },
      }
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            My Lists
          </h1>
          <p className="mt-2 text-ink-muted">
            Group problems however you like — by topic, by company, by whatever
            you're grinding this week.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary shrink-0 px-4 py-2.5 text-sm"
        >
          <ListPlus size={16} /> New list
        </button>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse p-5">
              <div className="h-4 w-32 rounded bg-surface-2" />
              <div className="mt-3 h-3 w-20 rounded bg-surface-2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          message="We couldn't load your lists."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="grid gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={`/lists/${list.slug}`}
              className="card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-center gap-2 font-semibold text-ink">
                  {list.isDefault && (
                    <Star size={15} className="shrink-0 text-brand" fill="currentColor" />
                  )}
                  <span className="truncate">{list.name}</span>
                </h2>
                <span
                  title={list.visibility === "PUBLIC" ? "Public" : "Private"}
                  className="shrink-0 text-ink-subtle"
                >
                  {list.visibility === "PUBLIC" ? (
                    <Globe size={15} />
                  ) : (
                    <Lock size={15} />
                  )}
                </span>
              </div>

              {list.description && (
                <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                  {list.description}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-sm text-ink-subtle">
                  {list._count.items}{" "}
                  {list._count.items === 1 ? "problem" : "problems"}
                </span>
                <ChevronRight
                  size={16}
                  className="text-ink-subtle transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="new-list-title">
        <form onSubmit={submit}>
          <h2 id="new-list-title" className="text-lg font-bold text-ink">
            New list
          </h2>

          {error && (
            <div className="mt-4 rounded-lg border border-hard/30 bg-hard/10 px-4 py-3 text-sm text-hard">
              {error}
            </div>
          )}

          <label className="mt-4 block text-sm font-medium text-ink" htmlFor="list-name">
            Name
          </label>
          <input
            id="list-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Dynamic programming"
            className="input mt-1.5 w-full px-3 py-2"
          />

          <label
            className="mt-4 block text-sm font-medium text-ink"
            htmlFor="list-description"
          >
            Description <span className="text-ink-subtle">(optional)</span>
          </label>
          <textarea
            id="list-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            rows={2}
            className="input mt-1.5 w-full px-3 py-2"
          />

          <label className="mt-4 flex items-start gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Make it public
              <span className="block text-xs text-ink-subtle">
                Anyone with the link can view it. You can change this later.
              </span>
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-secondary px-5 py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || createList.isPending}
              className="btn btn-primary px-5 py-2.5 disabled:opacity-50"
            >
              {createList.isPending ? "Creating…" : "Create list"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
