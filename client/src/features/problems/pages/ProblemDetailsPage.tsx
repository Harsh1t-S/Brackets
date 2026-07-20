import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProblem } from "../hooks/useProblem";
import ProblemActions from "../components/ProblemActions";
import SolutionPanel from "../components/SolutionPanel";
import CodeWorkspace from "../components/CodeWorkspace";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const badgeClass: Record<string, string> = {
  EASY: "badge badge-easy",
  MEDIUM: "badge badge-medium",
  HARD: "badge badge-hard",
};

const label: Record<string, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

// Known company -> domain map for logo lookup; anything unknown falls back
// to a guessed "<name>.com" (the favicon service returns a generic globe
// for bad domains, and we hide the img entirely on load error).
const companyDomains: Record<string, string> = {
  google: "google.com",
  amazon: "amazon.com",
  meta: "meta.com",
  facebook: "facebook.com",
  microsoft: "microsoft.com",
  apple: "apple.com",
  adobe: "adobe.com",
  bloomberg: "bloomberg.com",
  uber: "uber.com",
  linkedin: "linkedin.com",
  netflix: "netflix.com",
  yelp: "yelp.com",
  palantir: "palantir.com",
  oracle: "oracle.com",
  salesforce: "salesforce.com",
  airbnb: "airbnb.com",
  stripe: "stripe.com",
  spotify: "spotify.com",
  twitter: "x.com",
  x: "x.com",
  tesla: "tesla.com",
  nvidia: "nvidia.com",
  intel: "intel.com",
  ibm: "ibm.com",
  "goldman sachs": "goldmansachs.com",
};

function companyLogoUrl(name: string): string {
  const key = name.trim().toLowerCase();
  const domain = companyDomains[key] ?? `${key.replace(/\s+/g, "")}.com`;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export default function ProblemDetailsPage() {
  // `key` may be a number ("1") or a legacy slug ("two-sum").
  const { key = "", slug } = useParams();
  const { data: problem, isLoading, isError } = useProblem(key);

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
    return (
      <div className="flex h-96 items-center justify-center text-ink-muted">
        Loading problem...
      </div>
    );
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
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link
        to="/problems"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} />
        All problems
      </Link>

      <div className="grid grid-cols-12 gap-8">
        {/* Left — problem statement */}
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              <span className="mr-2 text-ink-subtle">#{problem.number}</span>
              {problem.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={badgeClass[problem.difficulty] ?? "badge badge-easy"}>
                {label[problem.difficulty] ?? problem.difficulty}
              </span>
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <ProblemActions problem={problem} />

            {problem.companies && problem.companies.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-ink-subtle">Asked by</span>
                {problem.companies.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink"
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
                  </span>
                ))}
              </div>
            )}
          </div>

          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold text-ink">Description</h2>
            <div
              className="prose prose-invert max-w-none prose-pre:bg-surface-2 prose-code:text-brand"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />
          </section>

          {problem.constraints && (
            <section className="mb-10">
              <h2 className="mb-3 text-lg font-semibold text-ink">Constraints</h2>
              <div
                className="whitespace-pre-wrap rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm leading-6 text-ink-muted"
                dangerouslySetInnerHTML={{ __html: problem.constraints }}
              />
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="border-b border-line bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    Example {index + 1}
                  </div>
                  <div className="space-y-2 p-4 font-mono text-sm">
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
          </section>

          <SolutionPanel problem={problem} />
        </div>

        {/* Right — code workspace (sticks while the statement scrolls) */}
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <CodeWorkspace problem={problem} />
          </div>
        </div>
      </div>
    </div>
  );
}
