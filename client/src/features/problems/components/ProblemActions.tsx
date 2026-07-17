import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck } from "lucide-react";
import type { Problem } from "../../../types/problem";
import { useAuth } from "../../auth/context/AuthContext";
import { useMyVote, useVote } from "../hooks/useVote";
import {
  useBookmarks,
  useToggleBookmark,
} from "../../bookmarks/hooks/useBookmarks";

interface Props {
  problem: Problem;
}

export default function ProblemActions({ problem }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: myVote = 0 } = useMyVote(problem.id, !!user);
  const voteMutation = useVote(problem.id);

  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();
  const bookmarked =
    !!user && bookmarks.some((b) => b.problem.id === problem.id);

  function guard(action: () => void) {
    return () => {
      if (!user) {
        navigate("/login");
        return;
      }
      action();
    };
  }

  const pill =
    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm">
        <span className="text-ink-subtle">Acceptance</span>
        <span className="font-semibold text-easy">{problem.acceptance}%</span>
      </span>

      <button
        onClick={guard(() => voteMutation.mutate(1))}
        disabled={voteMutation.isPending}
        aria-pressed={myVote === 1}
        title={user ? "Like" : "Sign in to vote"}
        className={`${pill} ${
          myVote === 1
            ? "border-easy/40 bg-easy/10 text-easy"
            : "border-line bg-surface-2 text-ink-muted hover:text-easy"
        }`}
      >
        <ThumbsUp size={15} /> {problem.likes}
      </button>

      <button
        onClick={guard(() => voteMutation.mutate(-1))}
        disabled={voteMutation.isPending}
        aria-pressed={myVote === -1}
        title={user ? "Dislike" : "Sign in to vote"}
        className={`${pill} ${
          myVote === -1
            ? "border-hard/40 bg-hard/10 text-hard"
            : "border-line bg-surface-2 text-ink-muted hover:text-hard"
        }`}
      >
        <ThumbsDown size={15} /> {problem.dislikes}
      </button>

      <button
        onClick={guard(() => toggleBookmark.mutate(problem.id))}
        disabled={toggleBookmark.isPending}
        title={user ? undefined : "Sign in to bookmark"}
        className={`${pill} ${
          bookmarked
            ? "border-brand/40 bg-brand-soft text-brand"
            : "border-line bg-surface-2 text-ink-muted hover:text-ink"
        }`}
      >
        {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {bookmarked ? "Saved" : "Save"}
      </button>
    </div>
  );
}
