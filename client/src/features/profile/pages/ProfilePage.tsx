import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Bookmark, ChevronRight, Check } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  avatarDataUri,
  getSavedAvatarHue,
  setSavedAvatarHue,
} from "../../../lib/avatar";
import { useBookmarks } from "../../bookmarks/hooks/useBookmarks";
import Pagination from "../../../components/common/Pagination";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

const HUES = [258, 210, 190, 160, 140, 45, 25, 350];
const PAGE_SIZE = 5;

export default function ProfilePage() {
  useDocumentTitle("Profile");
  const { user } = useAuth();
  const { data: bookmarks = [] } = useBookmarks();

  const [hue, setHue] = useState<number | undefined>(() => getSavedAvatarHue());
  const [page, setPage] = useState(1);

  function pickHue(h: number) {
    setHue(h);
    setSavedAvatarHue(h);
  }

  const totalPages = Math.max(1, Math.ceil(bookmarks.length / PAGE_SIZE));
  const visible = useMemo(
    () => bookmarks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [bookmarks, page]
  );

  const name = user?.name ?? "?";
  const roleBadge =
    user?.role === "ADMIN"
      ? "bg-brand-soft text-brand"
      : "bg-surface-2 text-ink-muted";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Profile</h1>
      <p className="mt-2 text-ink-muted">
        Manage your identity and review your activity.
      </p>

      {/* Identity */}
      <div className="card mt-8 p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={avatarDataUri(name, hue)}
            alt=""
            className="h-20 w-20 rounded-2xl"
          />
          <div>
            <h2 className="text-2xl font-semibold text-ink">{name}</h2>
            <p className="text-ink-muted">{user?.email}</p>
            <span className={`badge mt-2 inline-flex ${roleBadge}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Avatar colour picker */}
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-sm font-medium text-ink">Avatar colour</p>
          <p className="mb-3 text-xs text-ink-subtle">
            Make it yours — saved on this device.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {HUES.map((h) => (
              <button
                key={h}
                onClick={() => pickHue(h)}
                aria-label={`Avatar colour ${h}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 transition ${
                  hue === h ? "ring-brand" : "ring-transparent hover:ring-line-strong"
                }`}
                style={{
                  background: `linear-gradient(135deg, hsl(${h},72%,46%), hsl(${
                    (h + 45) % 360
                  },80%,58%))`,
                }}
              >
                {hue === h && <Check size={16} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <Mail size={14} /> Email
            </p>
            <p className="mt-1.5 font-medium text-ink">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <Bookmark size={14} /> Bookmarked
            </p>
            <p className="mt-1.5 font-medium text-ink">
              {bookmarks.length} problem{bookmarks.length !== 1 && "s"}
            </p>
          </div>
        </div>
      </div>

      {/* Bookmarked problems */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Bookmarked problems
          </h2>
          <span className="rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-ink-muted">
            {bookmarks.length}
          </span>
        </div>

        {bookmarks.length === 0 ? (
          <div className="card flex flex-col items-center p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-subtle">
              <Bookmark size={22} />
            </span>
            <p className="mt-4 text-ink-muted">
              You haven't bookmarked any problems yet.
            </p>
            <Link to="/problems" className="btn btn-primary mt-5 px-5 py-2.5">
              Browse problems
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visible.map((b) => (
                <Link
                  key={b.id}
                  to={`/problems/${b.problem.number}/${b.problem.slug}`}
                  className="card group flex items-center justify-between p-4 transition-colors hover:border-line-strong"
                >
                  <div>
                    <h3 className="font-semibold text-ink transition-colors group-hover:text-brand">
                      <span className="mr-2 text-ink-subtle">
                        #{b.problem.number}
                      </span>
                      {b.problem.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={
                          badgeClass[b.problem.difficulty] ?? "badge badge-easy"
                        }
                      >
                        {b.problem.difficulty}
                      </span>
                      {b.problem.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-ink-subtle transition-colors group-hover:text-brand"
                  />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
