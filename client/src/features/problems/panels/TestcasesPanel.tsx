import { useSolve } from "../context/SolveContext";

/**
 * Sample test cases.
 *
 * Testcases and Result are sibling dock panels rather than tabs inside one
 * panel — the dock already draws a tab strip, so an inner one was the same
 * control rendered twice, a few pixels apart.
 */
export default function TestcasesPanel() {
  const { problem, activeCase, setActiveCase } = useSolve();

  if (!problem.examples.length) {
    return (
      <div className="h-full bg-surface p-4">
        <p className="text-sm text-ink-subtle">
          No sample test cases for this problem.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {problem.examples.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCase(i)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeCase === i
                ? "bg-brand-soft text-brand"
                : "bg-surface-2 text-ink-muted hover:text-ink"
            }`}
          >
            Case {i + 1}
          </button>
        ))}
      </div>

      <div className="space-y-2.5 rounded-lg bg-surface-2 p-3.5 font-mono text-sm">
        <div>
          <span className="text-ink-subtle">Input:</span>{" "}
          <span className="text-ink">{problem.examples[activeCase]?.input}</span>
        </div>
        <div>
          <span className="text-ink-subtle">Expected:</span>{" "}
          <span className="text-ink">
            {problem.examples[activeCase]?.output}
          </span>
        </div>
      </div>
    </div>
  );
}
