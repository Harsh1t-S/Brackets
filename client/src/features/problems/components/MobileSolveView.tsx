import { useState } from "react";
import { FileText, Lightbulb, Code2, FlaskConical } from "lucide-react";

import DescriptionPanel from "../panels/DescriptionPanel";
import CodePanel from "../panels/CodePanel";
import TestcasesPanel from "../panels/TestcasesPanel";
import SolutionPanel from "./SolutionPanel";
import { useSolve } from "../context/SolveContext";

type Tab = "description" | "solution" | "code" | "tests";

const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: "description", label: "Problem", icon: FileText },
  { key: "solution", label: "Solution", icon: Lightbulb },
  { key: "code", label: "Code", icon: Code2 },
  { key: "tests", label: "Tests", icon: FlaskConical },
];

/**
 * The solve view on phones and small tablets.
 *
 * dockview is a desktop docking manager — its groups have a ~750px minimum,
 * so the docked layout overflows horizontally below roughly a laptop width.
 * Rather than shrink a dock that can't shrink, narrow screens get a single
 * full-height panel with a tab switcher, the way mobile LeetCode works. The
 * panels are the same components the dock renders, so nothing forks except
 * the arrangement.
 */
export default function MobileSolveView() {
  const { problem } = useSolve();
  const [tab, setTab] = useState<Tab>("description");

  return (
    <div className="flex h-full flex-col">
      <div
        role="tablist"
        aria-label="Solve view"
        className="flex shrink-0 gap-1 border-b border-line bg-surface px-2 py-1.5"
      >
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${
              tab === key
                ? "bg-brand-soft text-brand"
                : "text-ink-subtle hover:text-ink"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {/* DescriptionPanel manages its own scroll + pinned action bar. */}
        {tab === "description" && <DescriptionPanel />}
        {tab === "solution" && (
          <div className="h-full overflow-y-auto bg-surface p-5">
            <SolutionPanel problem={problem} />
          </div>
        )}
        {tab === "code" && <CodePanel />}
        {tab === "tests" && <TestcasesPanel />}
      </div>
    </div>
  );
}
