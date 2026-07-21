import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useFilterFacets } from "../../problems/hooks/useProblems";
import { companyLogoUrl } from "../../../lib/companyLogo";

// Shown until the real facets load (and if none are tagged yet).
const fallback = [
  "Google",
  "Amazon",
  "Microsoft",
  "Adobe",
  "Netflix",
  "Uber",
  "Meta",
  "Apple",
];

export default function Companies() {
  const { data } = useFilterFacets();

  // Prefer companies that actually tag problems, most-used first.
  const companies = data?.companies?.length
    ? data.companies.slice(0, 8)
    : fallback.map((value) => ({ value, count: 0 }));

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            Prepare for top companies
          </h2>
          <p className="mt-2 text-ink-muted">
            Practice questions asked by leading tech companies.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {companies.map(({ value, count }) => (
            <Link
              key={value}
              to={`/problems?companies=${encodeURIComponent(value)}`}
              className="card group relative flex items-center justify-center gap-3 p-6 text-center transition-all hover:-translate-y-0.5 hover:border-line-strong"
            >
              <img
                src={companyLogoUrl(value)}
                alt=""
                loading="lazy"
                className="h-6 w-6 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-base font-semibold text-ink-muted transition-colors group-hover:text-ink">
                {value}
              </span>
              {count > 0 && (
                <span className="text-sm text-ink-subtle">{count}</span>
              )}
              <ArrowUpRight
                size={15}
                className="absolute right-3 top-3 text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
