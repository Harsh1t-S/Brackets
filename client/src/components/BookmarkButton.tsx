import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";

import {
  useBookmarks,
  useToggleBookmark,
} from "../features/bookmarks/hooks/useBookmarks";
import { useAuth } from "../features/auth/context/AuthContext";

interface BookmarkButtonProps {
  problemId: string;
}

export default function BookmarkButton({ problemId }: BookmarkButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const bookmarked =
    !!user && bookmarks.some((bookmark) => bookmark.problem.id === problemId);

  function handleClick() {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleBookmark.mutate(problemId);
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggleBookmark.isPending}
      title={user ? undefined : "Sign in to bookmark"}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        bookmarked
          ? "border-brand/30 bg-brand-soft text-brand"
          : "border-line bg-surface-2 text-ink-muted hover:text-ink"
      }`}
    >
      {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
