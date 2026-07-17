import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";

const snippet = [
  { t: "function", c: "text-brand" },
  { t: " twoSum", c: "text-ink" },
  { t: "(nums, target) {", c: "text-ink-muted" },
];

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-[32rem] rounded-full bg-accent/10 blur-[130px]" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:justify-between lg:py-0">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-ink-muted">
            <Sparkles size={15} className="text-brand" />
            Practice. Compete. Get hired.
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Master coding,
            <br />
            <span className="text-gradient">one problem</span> at a time.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink-muted lg:mx-0">
            Solve carefully curated challenges, track your progress, and prepare
            for technical interviews — all in one focused workspace.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            {user ? (
              <Link to="/problems" className="btn btn-primary px-7 py-3.5 text-base">
                Continue solving
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary px-7 py-3.5 text-base">
                  Get started
                  <ArrowRight size={18} />
                </Link>
                <Link to="/problems" className="btn btn-secondary px-7 py-3.5 text-base">
                  Browse problems
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-subtle lg:justify-start">
            {["Curated problem set", "Real interview questions", "Free to start"].map(
              (f) => (
                <span key={f} className="inline-flex items-center gap-1.5">
                  <Check size={15} className="text-easy" />
                  {f}
                </span>
              )
            )}
          </div>
        </div>

        {/* Code editor mock */}
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="card overflow-hidden shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-hard/70" />
              <span className="h-3 w-3 rounded-full bg-medium/70" />
              <span className="h-3 w-3 rounded-full bg-easy/70" />
              <span className="ml-2 font-mono text-xs text-ink-subtle">
                two-sum.js
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-7">
              <code>
                <span className="text-ink-subtle">1  </span>
                {snippet.map((s, i) => (
                  <span key={i} className={s.c}>
                    {s.t}
                  </span>
                ))}
                {"\n"}
                <span className="text-ink-subtle">2  </span>
                <span className="text-ink-muted">{"  const map = "}</span>
                <span className="text-brand">new</span>
                <span className="text-ink-muted"> Map();</span>
                {"\n"}
                <span className="text-ink-subtle">3  </span>
                <span className="text-brand">{"  for "}</span>
                <span className="text-ink-muted">(let i = 0; i {"<"} n; i++) {"{"}</span>
                {"\n"}
                <span className="text-ink-subtle">4  </span>
                <span className="text-ink-muted">{"    // your solution here"}</span>
                {"\n"}
                <span className="text-ink-subtle">5  </span>
                <span className="text-ink-muted">{"  }"}</span>
                {"\n"}
                <span className="text-ink-subtle">6  </span>
                <span className="text-ink-muted">{"}"}</span>
              </code>
            </pre>
            <div className="flex items-center justify-between border-t border-line bg-surface-2 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-easy">
                <Check size={16} /> All tests passed
              </span>
              <span className="font-mono text-xs text-ink-subtle">72 ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
