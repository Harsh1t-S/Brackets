import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
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

type Tab = "description" | "solution" | "related";

const TABS: { id: Tab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "solution", label: "Solution" },
  { id: "related", label: "Related" },
];

export default function ProblemDetailsPage() {
  // `key` may be a number ("1") or a legacy slug ("two-sum").
  const { key = "", slug } = useParams();
  const { data: problem, isLoading, isError } = useProblem(key);
  const [tab, setTab] = useState<Tab>("description");

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
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-hard">Problem not found.</p>
        <Link to="/problems" className="btn btn-secondary px-4 py-2 text-sm">
          Back to problems
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
      <ProblemTopNav problemId={problem.id} />

      {/* Three panels: statement | code | testcases. On large screens each
          scrolls independently so the page itself never moves. */}
      <div className="grid gap-4 lg:h-[calc(100vh-9.5rem)] lg:grid-cols-2">
        {/* ── Panel: statement ──────────────────────────────────── */}
        <section className="card flex flex-col overflow-hidden lg:min-h-0">
          {/* Tab strip pinned to the top of the panel */}
          <div
            role="tablist"
            aria-label="Problem sections"
            className="flex shrink-0 items-center gap-5 border-b border-line bg-surface-2 px-5"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-brand text-ink"
                    : "border-transparent text-ink-subtle hover:text-ink-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {/* Header: title, one quiet meta line, one action row. */}
            <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight text-ink">
              <span>
                <span className="mr-2 text-ink-subtle">#{problem.number}</span>
                {problem.title}
              </span>
              <span className={difficultyBadgeClass(problem.difficulty)}>
                {difficultyLabel(problem.difficulty)}
              </span>
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-subtle">
              <span>{problem.acceptance}% acceptance</span>
              {problem.tags.length > 0 && <span aria-hidden>·</span>}
              {problem.tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-2">
                  <Link
                    to={`/problems?tags=${encodeURIComponent(tag)}`}
                    className="text-ink-muted transition-colors hover:text-brand"
                  >
                    {tag}
                  </Link>
                  {i < problem.tags.length - 1 && <span aria-hidden>·</span>}
                </span>
              ))}
            </div>

            <ProblemActions problem={problem} />

            <div className="mt-6 border-t border-line pt-6">
            {tab === "description" && (
              <>
                <div
                  className="prose prose-invert max-w-none prose-pre:bg-surface-2 prose-code:text-brand"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />

                {problem.constraints && (
                  <div className="mt-6 whitespace-pre-wrap rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm leading-6 text-ink-muted">
                    {/* Constraints read as part of the statement, not a section */}
                    <span
                      dangerouslySetInnerHTML={{ __html: problem.constraints }}
                    />
                  </div>
                )}

                {/* Light treatment (bold label + rule) rather than a boxed
                    card each — three stacked cards read as clutter. */}
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

                {/* Companies are context, not a headline — keep them last. */}
                {problem.companies && problem.companies.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                    <span className="text-sm text-ink-subtle">Asked by</span>
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
              </>
            )}

            {tab === "solution" && <SolutionPanel problem={problem} />}

            {tab === "related" && <ProblemNav problemId={problem.id} />}
            </div>
          </div>
        </section>

        {/* ── Panels: code + testcases ───────────────────────────── */}
        <CodeWorkspace problem={problem} />
      </div>
    </div>
  );
}
