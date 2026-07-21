import { useMemo, useState } from "react";
import { Play, Send, RotateCcw, Terminal, ChevronDown, Code2 } from "lucide-react";
import type { Problem } from "../../../types/problem";
import { useToast } from "../../../components/common/Toast";

interface Props {
  problem: Problem;
}

const langLabels: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  go: "Go",
  rust: "Rust",
};

const langExt: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rs",
};

/**
 * Two stacked panels — code above, testcases below — each with its own
 * chrome and its own scroll, so the workspace reads as distinct regions
 * rather than one long card.
 */
export default function CodeWorkspace({ problem }: Props) {
  const toast = useToast();
  const languages = useMemo(
    () => Object.keys(problem.starterCode),
    [problem]
  );

  const [language, setLanguage] = useState(languages[0] ?? "javascript");
  const [code, setCode] = useState(problem.starterCode[languages[0]] ?? "");
  const [tab, setTab] = useState<"testcase" | "result">("testcase");
  const [activeCase, setActiveCase] = useState(0);

  function changeLanguage(lang: string) {
    setLanguage(lang);
    setCode(problem.starterCode[lang] ?? "");
  }

  function reset() {
    setCode(problem.starterCode[language] ?? "");
    toast("Editor reset to starter code", "info");
  }

  function run() {
    setTab("result");
    toast("Runtime isn't connected yet — coming soon", "info");
  }

  function submit() {
    setTab("result");
    toast("Submissions aren't wired up yet — coming soon", "info");
  }

  const lines = code.split("\n").length;

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
      {/* ── Panel: code ─────────────────────────────────────────── */}
      <section className="card flex min-h-[22rem] flex-col overflow-hidden lg:min-h-0 lg:flex-1">
        <header className="flex shrink-0 items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <Code2 size={15} className="text-brand" />
            Code
            <span className="font-mono text-xs font-normal text-ink-subtle">
              solution.{langExt[language] ?? "txt"}
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                aria-label="Language"
                className="appearance-none rounded-md border border-line bg-surface py-1 pl-2.5 pr-7 text-xs font-medium text-ink outline-none focus:border-brand"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {langLabels[l] ?? l}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
            </div>
            <button
              onClick={reset}
              title="Reset to starter code"
              aria-label="Reset to starter code"
              className="rounded-md border border-line bg-surface p-1.5 text-ink-muted transition-colors hover:text-ink"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </header>

        {/* Gutter and textarea share one scroll container so they stay
            aligned; flex stretch makes the textarea fill short files. */}
        <div className="min-h-0 flex-1 overflow-auto bg-surface">
          <div className="flex min-h-full">
            <div
              aria-hidden
              className="shrink-0 select-none py-4 pl-4 pr-3 text-right font-mono text-sm leading-6 text-ink-subtle/60"
            >
              {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={lines}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Code editor"
              className="flex-1 resize-none overflow-hidden bg-transparent py-4 pr-4 font-mono text-sm leading-6 text-ink outline-none"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const start = el.selectionStart;
                  const end = el.selectionEnd;
                  const next = code.slice(0, start) + "  " + code.slice(end);
                  setCode(next);
                  requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = start + 2;
                  });
                }
              }}
            />
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-line bg-surface-2 px-4 py-2.5">
          <span className="hidden items-center gap-1.5 text-xs text-ink-subtle sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-medium" />
            Not connected to a runtime
          </span>
          <div className="flex items-center gap-2">
            <button onClick={run} className="btn btn-secondary px-4 py-2 text-sm">
              <Play size={15} /> Run
            </button>
            <button
              onClick={submit}
              className="btn btn-primary btn-glow px-4 py-2 text-sm"
            >
              <Send size={15} /> Submit
            </button>
          </div>
        </footer>
      </section>

      {/* ── Panel: testcases / result ───────────────────────────── */}
      {/* Deliberately short: the editor should get most of the column. */}
      <section className="card flex shrink-0 flex-col overflow-hidden lg:h-[13rem]">
        <div
          role="tablist"
          aria-label="Console"
          className="flex shrink-0 items-center gap-5 border-b border-line bg-surface-2 px-4"
        >
          {(["testcase", "result"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 py-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-brand text-ink"
                  : "border-transparent text-ink-subtle hover:text-ink-muted"
              }`}
            >
              {t === "testcase" ? "Testcases" : "Result"}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "testcase" ? (
            problem.examples.length ? (
              <>
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
                    <span className="text-ink">
                      {problem.examples[activeCase]?.input}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-subtle">Expected:</span>{" "}
                    <span className="text-ink">
                      {problem.examples[activeCase]?.output}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-subtle">
                No sample test cases for this problem.
              </p>
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Terminal size={22} className="text-ink-subtle" />
              <p className="text-sm text-ink-muted">
                Run your code to see results here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
