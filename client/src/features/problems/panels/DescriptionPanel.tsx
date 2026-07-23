import { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Building2, ChevronDown } from "lucide-react";

import { useSolve } from "../context/SolveContext";
import ProblemActions from "../components/ProblemActions";
import ProblemNav from "../components/ProblemNav";
import { difficultyBadgeClass, difficultyLabel } from "../../../lib/difficulty";
import { companyLogoUrl } from "../../../lib/companyLogo";

type Pill = "topics" | "companies";

/**
 * The problem statement.
 *
 * Topics and Companies stay as inline collapsibles here rather than becoming
 * dock panels of their own — they're a handful of chips, not a workspace, and
 * LeetCode keeps them in the description for the same reason. Solution is the
 * one that graduated to its own tab.
 */
export default function DescriptionPanel() {
  const { problem } = useSolve();
  const [openPill, setOpenPill] = useState<Pill | null>(null);

  const toggle = (p: Pill) => setOpenPill((cur) => (cur === p ? null : p));

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors";
  const pillIdle = "border-line bg-surface-2 text-ink-muted hover:text-ink";
  const pillOpen = "border-brand/40 bg-brand-soft text-brand";

  return (
    <div className="h-full overflow-y-auto bg-surface px-6 py-5">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        <span className="mr-2 text-ink-subtle">#{problem.number}</span>
        {problem.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={difficultyBadgeClass(problem.difficulty)}>
          {difficultyLabel(problem.difficulty)}
        </span>

        {problem.tags.length > 0 && (
          <button
            onClick={() => toggle("topics")}
            aria-expanded={openPill === "topics"}
            className={`${pill} ${openPill === "topics" ? pillOpen : pillIdle}`}
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

        <span className="ml-auto text-xs text-ink-subtle">
          {problem.solvedCount === 1
            ? "1 person solved this"
            : `${problem.solvedCount ?? 0} people solved this`}
        </span>
      </div>

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
          {problem.companies.map((company) => (
            <Link
              key={company}
              to={`/problems?companies=${encodeURIComponent(company)}`}
              title={`All problems asked by ${company}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
            >
              <img
                src={companyLogoUrl(company)}
                alt=""
                loading="lazy"
                className="h-3.5 w-3.5 rounded-sm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {company}
            </Link>
          ))}
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
            <p className="mb-2 text-sm font-semibold text-ink">Constraints</p>
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

      <div className="mt-10 border-t border-line pt-5">
        <p className="mb-3 text-sm font-semibold text-ink">Related problems</p>
        <ProblemNav problemId={problem.id} />
      </div>
    </div>
  );
}
