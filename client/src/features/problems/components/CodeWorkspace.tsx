import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Terminal, ChevronDown, Code2 } from "lucide-react";
import type { Problem } from "../../../types/problem";
import { useToast } from "../../../components/common/Toast";
import { useSplitPane } from "../hooks/useSplitPane";
import { clearDraft, initialCode, writeDraft } from "../lib/drafts";

interface Props {
  problem: Problem;
  /** Console tab is lifted so Run/Submit can live in the top bar. */
  consoleTab: "testcase" | "result";
  onConsoleTabChange: (tab: "testcase" | "result") => void;
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
 * Code above, testcases below, with a draggable divider between them.
 */
export default function CodeWorkspace({
  problem,
  consoleTab,
  onConsoleTabChange,
}: Props) {
  const toast = useToast();
  const languages = useMemo(
    () => Object.keys(problem.starterCode),
    [problem]
  );

  const firstLang = languages[0] ?? "javascript";
  const [language, setLanguage] = useState(firstLang);
  const [code, setCode] = useState(() =>
    initialCode(problem.id, firstLang, problem.starterCode[firstLang] ?? "")
  );
  const [activeCase, setActiveCase] = useState(0);

  const starter = problem.starterCode[language] ?? "";
  const isDirty = code !== starter;

  // Editor takes ~68% of the column by default; drag to rebalance.
  const { size, dragging, containerRef, handleProps } = useSplitPane({
    initial: 68,
    min: 25,
    max: 85,
    direction: "vertical",
    storageKey: "bracket:split:workspace",
  });

  // Navigating to an already-cached problem doesn't unmount this component
  // (no loading state to tear it down), so the editor would keep showing the
  // previous problem's code. Re-seed it whenever the problem changes, from
  // this problem's saved draft when there is one.
  useEffect(() => {
    const first = Object.keys(problem.starterCode)[0] ?? "javascript";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(first);

    setCode(
      initialCode(problem.id, first, problem.starterCode[first] ?? "")
    );

    setActiveCase(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  // Persist as you type, but not on every keystroke — a short idle window
  // keeps localStorage writes off the typing path.
  const saveTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      writeDraft(problem.id, language, code, starter);
    }, 400);
    return () => window.clearTimeout(saveTimer.current);
  }, [code, language, problem.id, starter]);

  // Flush the pending draft if the component goes away mid-edit (navigation,
  // tab close) so the last few keystrokes aren't lost to the debounce.
  //
  // The current code/starter are read through a ref so this effect can leave
  // `code` out of its dependencies. With `code` in the deps, the cleanup ran
  // on every keystroke and wrote to localStorage synchronously each time —
  // exactly the work the debounce above exists to avoid. Keeping only
  // problem.id/language means the cleanup still flushes when you switch
  // problem or language (saving the buffer you're leaving), plus on unmount.
  const buffer = useRef({ code, starter });
  useEffect(() => {
    buffer.current = { code, starter };
  }, [code, starter]);
  useEffect(() => {
    const flush = () =>
      writeDraft(problem.id, language, buffer.current.code, buffer.current.starter);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [problem.id, language]);

  /**
   * Switching language keeps each buffer intact — the old one is saved and
   * the new one restored. Previously this threw away whatever you had typed.
   */
  function changeLanguage(lang: string) {
    writeDraft(problem.id, language, code, starter);
    setLanguage(lang);
    setCode(
      initialCode(problem.id, lang, problem.starterCode[lang] ?? "")
    );
  }

  function reset() {
    // The only destructive action left in the editor, so confirm it when
    // there is actually something to lose.
    if (
      isDirty &&
      !window.confirm("Discard your code and restore the starter template?")
    ) {
      return;
    }
    clearDraft(problem.id, language);
    setCode(starter);
    toast("Editor reset to starter code", "info");
  }

  const lines = code.split("\n").length;

  return (
    <div ref={containerRef} className="flex flex-col lg:h-full lg:min-h-0">
      {/* ── Panel: code ─────────────────────────────────────────── */}
      <section
        className="card flex min-h-[20rem] flex-col overflow-hidden lg:min-h-0"
        style={{ flexBasis: `${size}%`, flexGrow: 0, flexShrink: 0 }}
      >
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
              // Soft-wrapping made a long line occupy two visual rows while
              // the gutter still counted one, so the numbers drifted out of
              // alignment for the rest of the file. Scroll instead of wrap.
              wrap="off"
              aria-label="Code editor"
              className="flex-1 resize-none overflow-y-hidden overflow-x-auto whitespace-pre bg-transparent py-4 pr-4 font-mono text-sm leading-6 text-ink outline-none"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  // insertText goes through the browser's own edit pipeline,
                  // so Ctrl+Z still works. Rewriting value via setState
                  // wiped the native undo stack on every Tab.
                  document.execCommand("insertText", false, "  ");
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Draggable divider (desktop only — panes stack on mobile) */}
      <div
        {...handleProps}
        aria-label="Resize code and testcases"
        className={`group hidden shrink-0 cursor-row-resize items-center justify-center py-1.5 lg:flex ${
          dragging ? "text-brand" : "text-ink-subtle"
        }`}
      >
        <span
          className={`h-1 w-10 rounded-full transition-colors ${
            dragging ? "bg-brand" : "bg-line-strong group-hover:bg-brand/60"
          }`}
        />
      </div>

      {/* ── Panel: testcases / result ───────────────────────────── */}
      <section className="card mt-3 flex min-h-0 flex-1 flex-col overflow-hidden lg:mt-0">
        <div
          role="tablist"
          aria-label="Console"
          className="flex shrink-0 items-center gap-5 border-b border-line bg-surface-2 px-4"
        >
          {(["testcase", "result"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={consoleTab === t}
              onClick={() => onConsoleTabChange(t)}
              className={`-mb-px border-b-2 py-2.5 text-sm font-medium transition-colors ${
                consoleTab === t
                  ? "border-brand text-ink"
                  : "border-transparent text-ink-subtle hover:text-ink-muted"
              }`}
            >
              {t === "testcase" ? "Testcases" : "Result"}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {consoleTab === "testcase" ? (
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
