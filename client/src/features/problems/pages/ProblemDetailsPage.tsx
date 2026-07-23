import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Tag, Building2, Lightbulb, ChevronDown } from "lucide-react";
import { useProblem } from "../hooks/useProblem";
import ProblemTopNav from "../components/ProblemTopNav";
import ProblemActions from "../components/ProblemActions";
import SolutionPanel from "../components/SolutionPanel";
import ProblemNav from "../components/ProblemNav";
import CodeWorkspace from "../components/CodeWorkspace";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { difficultyBadgeClass, difficultyLabel } from "../../../lib/difficulty";
import { PageLoader } from "../../../components/common/Spinner";
import { companyLogoUrl } from "../../../lib/companyLogo";
import { useToast } from "../../../components/common/Toast";
import { useSplitPane } from "../hooks/useSplitPane";

type Pill = "topics" | "companies" | "solution";

export default function ProblemDetailsPage() {
  // `key` may be a number ("1") or a legacy slug ("two-sum").
  const { key = "", slug } = useParams();
  const { data: problem, isLoading, isError } = useProblem(key);
  const [openPill, setOpenPill] = useState<Pill | null>(null);
  const toast = useToast();

  // Console tab is owned here so the top bar's Run/Submit can drive it.
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result">(
    "testcase"
  );

  // Statement / workspace split — drag the divider to rebalance.
  const { size, dragging, containerRef, handleProps } = useSplitPane({
    initial: 55,
    min: 30,
    max: 72,
    direction: "horizontal",
    storageKey: "bracket:split:statement",
  });

  // Collapse any open pill and reset the console when moving problems.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenPill(null);
     
    setConsoleTab("testcase");
  }, [problem?.id]);

  // Memoised because `run` reaches CodeEditor as a prop and feeds its
  // extensions useMemo. A fresh identity each render rebuilt the CodeMirror
  // keymap on every render of this page — including every pointermove while
  // the divider is being dragged.
  const run = useCallback(() => {
    setConsoleTab("result");
    toast("Runtime isn't connected yet — coming soon", "info");
  }, [toast]);

  const submit = useCallback(() => {
    setConsoleTab("result");
    toast("Submissions aren't wired up yet — coming soon", "info");
  }, [toast]);

  useDocumentTitle(
    problem ? `${problem.number}. ${problem.title}` : "Problem"
  );

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

  const toggle = (p: Pill) => setOpenPill((cur) => (cur === p ? null : p));

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors";
  const pillIdle =
    "border-line bg-surface-2 text-ink-muted hover:text-ink";
  const pillOpen = "border-brand/40 bg-brand-soft text-brand";

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:h-screen lg:overflow-hidden">
      <ProblemTopNav problemId={problem.id} onRun={run} onSubmit={submit} />

      <main className="flex-1 p-3 lg:min-h-0">
        {/* Statement | code | testcases, with draggable dividers. */}
        <div
          ref={containerRef}
          className="flex flex-col gap-3 lg:h-full lg:flex-row lg:gap-0"
        >
          {/* ── Panel: statement ────────────────────────────────── */}
          <section
            className="card flex flex-col overflow-hidden lg:min-h-0"
            style={{ flexBasis: `${size}%`, flexGrow: 0, flexShrink: 0 }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                <span className="mr-2 text-ink-subtle">#{problem.number}</span>
                {problem.title}
              </h1>

              {/* Collapsible pills keep topics/companies/solution one click
                  away without crowding the statement. */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={difficultyBadgeClass(problem.difficulty)}>
                  {difficultyLabel(problem.difficulty)}
                </span>

                {problem.tags.length > 0 && (
                  <button
                    onClick={() => toggle("topics")}
                    aria-expanded={openPill === "topics"}
                    className={`${pill} ${
                      openPill === "topics" ? pillOpen : pillIdle
                    }`}
                  >
                    <Tag size={12} /> Topics
                    <ChevronDown
                      size={12}
                      className={openPill === "topics" ? "rotate-180" : ""}
                    />
                  </button>
                )}

                {problem.companies && problem.companies.length > 0 && (
                  <button
                    onClick={() => toggle("companies")}
                    aria-expanded={openPill === "companies"}
                    className={`${pill} ${
                      openPill === "companies" ? pillOpen : pillIdle
                    }`}
                  >
                    <Building2 size={12} /> Companies
                    <ChevronDown
                      size={12}
                      className={openPill === "companies" ? "rotate-180" : ""}
                    />
                  </button>
                )}

                <button
                  onClick={() => toggle("solution")}
                  aria-expanded={openPill === "solution"}
                  className={`${pill} ${
                    openPill === "solution" ? pillOpen : pillIdle
                  }`}
                >
                  <Lightbulb size={12} /> Solution
                  <ChevronDown
                    size={12}
                    className={openPill === "solution" ? "rotate-180" : ""}
                  />
                </button>

                <span className="ml-auto text-xs text-ink-subtle">
                  {problem.acceptance}% acceptance
                </span>
              </div>

              {/* Expanded pill content */}
              {openPill === "topics" && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {problem.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/problems?tags=${encodeURIComponent(tag)}`}
                      className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {openPill === "companies" && problem.companies && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {problem.companies.map((c) => (
                    <Link
                      key={c}
                      to={`/problems?companies=${encodeURIComponent(c)}`}
                      title={`All problems asked by ${c}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      <img
                        src={companyLogoUrl(c)}
                        alt=""
                        loading="lazy"
                        className="h-3.5 w-3.5 rounded-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {c}
                    </Link>
                  ))}
                </div>
              )}

              {openPill === "solution" && (
                <div className="mt-3">
                  <SolutionPanel problem={problem} />
                </div>
              )}

              <ProblemActions problem={problem} />

              <div className="mt-5 border-t border-line pt-5">
                <div
                  className="prose prose-invert max-w-none prose-pre:bg-surface-2 prose-code:text-brand"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />

                {problem.constraints && (
                  <div className="mt-6">
                    <p className="mb-2 text-sm font-semibold text-ink">
                      Constraints
                    </p>
                    <div
                      className="whitespace-pre-wrap border-l-2 border-line pl-4 font-mono text-sm leading-6 text-ink-muted"
                      dangerouslySetInnerHTML={{ __html: problem.constraints }}
                    />
                  </div>
                )}

                <div className="mt-8 space-y-6">
                  {problem.examples.map((example, index) => (
                    <div key={index}>
                      <p className="mb-2 text-sm font-semibold text-ink">
                        Example {index + 1}
                      </p>
                      <div className="space-y-1.5 border-l-2 border-line pl-4 font-mono text-sm">
                        <p className="text-ink">
                          <span className="text-ink-subtle">Input: </span>
                          {example.input}
                        </p>
                        <p className="text-ink">
                          <span className="text-ink-subtle">Output: </span>
                          {example.output}
                        </p>
                        {example.explanation && (
                          <p className="font-sans text-ink-muted">
                            <span className="font-semibold text-ink">
                              Explanation:{" "}
                            </span>
                            {example.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related problems close out the statement column. */}
              <div className="mt-10 border-t border-line pt-5">
                <p className="mb-3 text-sm font-semibold text-ink">
                  Related problems
                </p>
                <ProblemNav problemId={problem.id} />
              </div>
            </div>
          </section>

          {/* Draggable divider between statement and workspace */}
          <div
            {...handleProps}
            aria-label="Resize statement and workspace"
            className={`group hidden shrink-0 cursor-col-resize items-center justify-center px-1.5 lg:flex ${
              dragging ? "text-brand" : "text-ink-subtle"
            }`}
          >
            <span
              className={`h-10 w-1 rounded-full transition-colors ${
                dragging ? "bg-brand" : "bg-line-strong group-hover:bg-brand/60"
              }`}
            />
          </div>

          {/* ── Panels: code + testcases ──────────────────────────── */}
          <div className="min-w-0 flex-1 lg:min-h-0">
            <CodeWorkspace
              problem={problem}
              consoleTab={consoleTab}
              onConsoleTabChange={setConsoleTab}
              onRun={run}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
