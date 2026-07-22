import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Bookmark,
  ChevronRight,
  Check,
  CheckCircle2,
  Upload,
  Trash2,
  Pencil,
} from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  avatarDataUri,
  getSavedAvatarHue,
  setSavedAvatarHue,
} from "../../../lib/avatar";
import { fileToAvatarDataUri } from "../../../lib/image";
import { updateMe } from "../../auth/services/auth.service";
import { useBookmarks } from "../../bookmarks/hooks/useBookmarks";
import { useDashboard } from "../../dashboard/hooks/useDashboard";
import Pagination from "../../../components/common/Pagination";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useToast } from "../../../components/common/Toast";
import { difficultyBadgeClass, plural } from "../../../lib/difficulty";
import { errorMessage } from "../../../lib/errors";

const HUES = [258, 210, 190, 160, 140, 45, 25, 350];
const PAGE_SIZE = 5;

export default function ProfilePage() {
  useDocumentTitle("Profile");
  const { user, refresh } = useAuth();
  const { data: bookmarks = [] } = useBookmarks();
  const { data: dashboard } = useDashboard();
  const toast = useToast();

  const [hue, setHue] = useState<number | undefined>(() => getSavedAvatarHue());
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function pickHue(h: number) {
    setHue(h);
    setSavedAvatarHue(h);
  }

  async function onPhotoPicked(file: File | undefined) {
    if (!file) return;
    setSaving(true);
    try {
      const avatar = await fileToAvatarDataUri(file);
      await updateMe({ avatar });
      await refresh();
      toast("Profile photo updated", "success");
    } catch (e) {
      toast(errorMessage(e, "Couldn't update photo"), "error");
    } finally {
      setSaving(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removePhoto() {
    setSaving(true);
    try {
      await updateMe({ avatar: null });
      await refresh();
      toast("Photo removed", "info");
    } catch {
      toast("Couldn't remove photo", "error");
    } finally {
      setSaving(false);
    }
  }

  async function saveName() {
    const next = nameDraft.trim();
    if (next.length < 3) {
      toast("Name must be at least 3 characters.", "error");
      return;
    }
    setSaving(true);
    try {
      await updateMe({ name: next });
      await refresh();
      setEditingName(false);
      toast("Name updated", "success");
    } catch (e) {
      toast(errorMessage(e, "Couldn't update name"), "error");
    } finally {
      setSaving(false);
    }
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
            src={user?.avatar || avatarDataUri(name, hue)}
            alt=""
            className="h-20 w-20 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="input max-w-xs px-3 py-2"
                  maxLength={50}
                  autoFocus
                />
                <button
                  onClick={saveName}
                  disabled={saving}
                  className="btn btn-primary px-4 py-2 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  disabled={saving}
                  className="btn btn-ghost px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
                {name}
                <button
                  onClick={() => {
                    setNameDraft(name);
                    setEditingName(true);
                  }}
                  aria-label="Edit name"
                  className="text-ink-subtle transition-colors hover:text-ink"
                >
                  <Pencil size={16} />
                </button>
              </h2>
            )}
            <p className="text-ink-muted">{user?.email}</p>
            <span className={`badge mt-2 inline-flex ${roleBadge}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile photo */}
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-sm font-medium text-ink">Profile photo</p>
          <p className="mb-3 text-xs text-ink-subtle">
            Upload your own image — it's resized and stored with your account.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPhotoPicked(e.target.files?.[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={saving}
              className="btn btn-secondary px-4 py-2 text-sm"
            >
              <Upload size={15} /> Upload photo
            </button>
            {user?.avatar && (
              <button
                onClick={removePhoto}
                disabled={saving}
                className="btn btn-ghost px-4 py-2 text-sm text-hard"
              >
                <Trash2 size={15} /> Remove
              </button>
            )}
          </div>
        </div>

        {/* Only meaningful for the generated avatar — a photo overrides it. */}
        {!user?.avatar && (
          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm font-medium text-ink">Avatar colour</p>
            <p className="mb-3 text-xs text-ink-subtle">
              Colours your generated avatar — saved on this device. Upload a
              photo above to use that instead.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {HUES.map((h) => (
                <button
                  key={h}
                  onClick={() => pickHue(h)}
                  aria-label={`Avatar colour ${h}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 transition ${
                    hue === h
                      ? "ring-brand"
                      : "ring-transparent hover:ring-line-strong"
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
        )}

        {/* Details */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <Mail size={14} /> Email
            </p>
            <p className="mt-1.5 truncate font-medium text-ink">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <CheckCircle2 size={14} /> Solved
            </p>
            <p className="mt-1.5 font-medium text-ink">
              {plural(dashboard?.solvedCount ?? 0, "problem")}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <Bookmark size={14} /> Bookmarked
            </p>
            <p className="mt-1.5 font-medium text-ink">
              {plural(bookmarks.length, "problem")}
            </p>
          </div>
        </div>
      </div>

      {/* Recently solved */}
      {dashboard && dashboard.recentSolved?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold tracking-tight text-ink">
            Recently solved
          </h2>
          <div className="space-y-3">
            {dashboard.recentSolved.map((row) => (
              <Link
                key={row.id}
                to={`/problems/${row.problem.number}/${row.problem.slug}`}
                className="card group flex items-center justify-between p-4 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="shrink-0 text-easy" />
                  <h3 className="font-semibold text-ink transition-colors group-hover:text-brand">
                    <span className="mr-2 text-ink-subtle">
                      #{row.problem.number}
                    </span>
                    {row.problem.title}
                  </h3>
                </span>
                <span className={difficultyBadgeClass(row.problem.difficulty)}>
                  {row.problem.difficulty}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

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
                      <span className={difficultyBadgeClass(b.problem.difficulty)}>
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
