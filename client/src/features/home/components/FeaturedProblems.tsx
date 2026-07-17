import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProblemCard from "../../../components/common/ProblemCard";
import { useProblems } from "../../problems/hooks/useProblems";

export default function FeaturedProblems() {
  const { data, isLoading } = useProblems({ page: 1, limit: 6 });
  const problems = data?.problems ?? [];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Featured problems
            </h2>
            <p className="mt-2 text-ink-muted">
              A sample of what's waiting for you in the problem set.
            </p>
          </div>
          <Link
            to="/problems"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-opacity hover:opacity-80"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-40 animate-pulse" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="card p-10 text-center text-ink-muted">
            No problems yet — check back soon.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                number={problem.number}
                title={problem.title}
                slug={problem.slug}
                difficulty={problem.difficulty}
                acceptance={problem.acceptance}
                tags={problem.tags}
                premium={problem.premium}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
