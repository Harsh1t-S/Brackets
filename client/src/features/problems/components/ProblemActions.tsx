import { useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
} from "lucide-react";
import type { Problem } from "../../../types/problem";
import { useAuth } from "../../auth/context/AuthContext";
import { useMyVote, useVote } from "../hooks/useVote";
import { useMySolved, useToggleSolved } from "../hooks/useSolved";
import {
  useBookmarks,
  useToggleBookmark,
} from "../../bookmarks/hooks/useBookmarks";
import { useToast } from "../../../components/common/Toast";

interface Props {
  problem: Problem;
}

/**
 * One compact row: the two things you *do* on the left, the two things you
 * *rate* on the right. Acceptance lives in the header meta line instead of
 * competing here as a third pill.
 */
export default function ProblemActions({ problem }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: myVote = 0 } = useMyVote(problem.id, !!user);
  const voteMutation = useVote(problem.id);

  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();
  const bookmarked =
    !!user && bookmarks.some((b) => b.problem.id === problem.id);

  const toast = useToast();
  const { data: solved = false } = useMySolved(problem.id, !!user);
  const toggleSolved = useToggleSolved(problem.id);

  function guard(action: () => void) {
    return () => {
      if (!user) {
        navigate("/login");
        return;
      }
      action();
    };
  }

  const action =
    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";
  const vote =
    "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors disabled:opacity-50";

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <button
        onClick={guard(() =>
          toggleSolved.mutate(undefined, {
            onSuccess: (r) =>
              toast(
                r.solved ? "Marked as solved 🎉" : "Unmarked as solved",
                r.solved ? "success" : "info"
              ),
          })
        )}
        disabled={toggleSolved.isPending}
        aria-pressed={solved}
        title={user ? "Mark as solved" : "Sign in to track progress"}
        className={`${action} ${
          solved
            ? "border-easy/40 bg-easy/10 text-easy"
            : "border-line bg-surface-2 text-ink-muted hover:text-easy"
        }`}
      >
        <CheckCircle2 size={15} />
        {solved ? "Solved" : "Mark solved"}
      </button>

      <button
        onClick={guard(() => toggleBookmark.mutate(problem.id))}
        disabled={toggleBookmark.isPending}
        aria-pressed={bookmarked}
        title={user ? undefined : "Sign in to bookmark"}
        className={`${action} ${
          bookmarked
            ? "border-brand/40 bg-brand-soft text-brand"
            : "border-line bg-surface-2 text-ink-muted hover:text-ink"
        }`}
      >
        {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {bookmarked ? "Saved" : "Save"}
      </button>

      {/* Ratings sit apart from the actions so the row reads clearly. */}
      <div className="ml-auto flex items-center gap-0.5">
        <button
          onClick={guard(() => voteMutation.mutate(1))}
          disabled={voteMutation.isPending}
          aria-pressed={myVote === 1}
          title={user ? "Like" : "Sign in to vote"}
          className={`${vote} ${
            myVote === 1
              ? "text-easy"
              : "text-ink-subtle hover:text-easy"
          }`}
        >
          <ThumbsUp size={15} /> {problem.likes}
        </button>
        <button
          onClick={guard(() => voteMutation.mutate(-1))}
          disabled={voteMutation.isPending}
          aria-pressed={myVote === -1}
          title={user ? "Dislike" : "Sign in to vote"}
          className={`${vote} ${
            myVote === -1 ? "text-hard" : "text-ink-subtle hover:text-hard"
          }`}
        >
          <ThumbsDown size={15} /> {problem.dislikes}
        </button>
      </div>
    </div>
  );
}
