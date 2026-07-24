import { useCallback, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useProblem } from "../hooks/useProblem";
import ProblemTopNav from "../components/ProblemTopNav";
import SolveDock, { type SolveDockHandle } from "../components/SolveDock";
import MobileSolveView from "../components/MobileSolveView";
import { SolveProvider } from "../context/SolveContext";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { PageLoader } from "../../../components/common/Spinner";
import { useToast } from "../../../components/common/Toast";

export default function ProblemDetailsPage() {
  // `key` may be a number ("1") or a legacy slug ("two-sum").
  const { key = "", slug } = useParams();
  const { data: problem, isLoading, isError } = useProblem(key);
  const toast = useToast();

  const [dock, setDock] = useState<SolveDockHandle | null>(null);

  // dockview needs ~1500px for its two-column default; below that it can't
  // shrink, so narrow screens get the stacked mobile view instead.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // The dock hands these to CodeEditor's keymap, so a stable identity keeps
  // CodeMirror from rebuilding its extensions on every render.
  const run = useCallback(() => {
    dock?.focusPanel("result");
    toast("Runtime isn't connected yet — coming soon", "info");
  }, [toast, dock]);

  const submit = useCallback(() => {
    dock?.focusPanel("result");
    toast("Submissions aren't wired up yet — coming soon", "info");
  }, [toast, dock]);

  useDocumentTitle(problem ? `${problem.number}. ${problem.title}` : "Problem");

  // Canonicalize to /problems/{number}/{slug} (handles /problems/1,
  // /problems/two-sum, and stale slugs after a rename).
  if (problem && (key !== String(problem.number) || slug !== problem.slug)) {
    return (
      <Navigate to={`/problems/${problem.number}/${problem.slug}`} replace />
    );
  }

  if (isLoading) {
    return <PageLoader label="Loading problem…" />;
  }

  if (isError || !problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-canvas">
        <p className="text-hard">Problem not found.</p>
        <Link to="/problems" className="btn btn-secondary px-4 py-2 text-sm">
          Back to problems
        </Link>
      </div>
    );
  }

  return (
    <SolveProvider problem={problem} onRun={run} onSubmit={submit}>
      <div className="flex h-screen flex-col overflow-hidden bg-canvas">
        <ProblemTopNav
          problemId={problem.id}
          onRun={run}
          onSubmit={submit}
          // The reset-layout button is meaningless without a dock to reset.
          onResetLayout={isDesktop ? dock?.resetLayout : undefined}
        />

        {/* dockview measures itself, so the wrapper must have a real height. */}
        <main className="min-h-0 flex-1 p-2 lg:p-2">
          {isDesktop ? <SolveDock onReady={setDock} /> : <MobileSolveView />}
        </main>
      </div>
    </SolveProvider>
  );
}
