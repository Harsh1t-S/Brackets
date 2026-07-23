import { Terminal } from "lucide-react";

/**
 * Run output.
 *
 * Deliberately empty: the judge is supplied externally, so Run and Submit are
 * placeholders until it's wired up. This panel exists so the layout is
 * already right when it is.
 */
export default function ResultPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-surface p-4 text-center">
      <Terminal size={22} className="text-ink-subtle" />
      <p className="text-sm text-ink-muted">Run your code to see results here.</p>
    </div>
  );
}
