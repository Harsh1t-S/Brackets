import { lazy, Suspense, useState } from "react";
import { ChevronDown, Copy, Check, RotateCcw } from "lucide-react";

import { useSolve } from "../context/SolveContext";
import { useToast } from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";

const CodeEditor = lazy(() => import("../components/CodeEditor"));

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

/** The editor, as a dockable panel. Chrome only — state lives in SolveContext. */
export default function CodePanel() {
  const {
    language,
    languages,
    changeLanguage,
    code,
    setCode,
    isDirty,
    draftSaved,
    resetCode,
    run,
  } = useSolve();

  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Couldn't copy to clipboard", "error");
    }
  }

  function reset() {
    if (isDirty) {
      setConfirmingReset(true);
      return;
    }
    applyReset();
  }

  function applyReset() {
    resetCode();
    setConfirmingReset(false);
    toast("Editor reset to starter code", "info");
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-surface-2 px-3 py-2">
        <span className="inline-flex items-center gap-2 text-xs text-ink-subtle">
          <span className="font-mono">solution.{langExt[language] ?? "txt"}</span>
          {draftSaved && isDirty && (
            <span
              title="Your code is saved in this browser"
              className="inline-flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-easy" />
              Draft saved
            </span>
          )}
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
            onClick={copy}
            title="Copy code"
            aria-label="Copy code"
            className="rounded-md border border-line bg-surface p-1.5 text-ink-muted transition-colors hover:text-ink"
          >
            {copied ? <Check size={14} className="text-easy" /> : <Copy size={14} />}
          </button>
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

      <div className="min-h-0 flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-ink-subtle">
              Loading editor…
            </div>
          }
        >
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onRun={run}
          />
        </Suspense>
      </div>

      <Modal
        open={confirmingReset}
        onClose={() => setConfirmingReset(false)}
        labelledBy="reset-editor-title"
      >
        <>
          <h2 id="reset-editor-title" className="text-lg font-bold text-ink">
            Reset the editor?
          </h2>
          <p className="mt-3 text-ink-muted">
            This discards the code you've written for{" "}
            <span className="font-semibold text-ink">
              {langLabels[language] ?? language}
            </span>{" "}
            and restores the starter template. It can't be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setConfirmingReset(false)}
              className="btn btn-secondary px-5 py-2.5"
            >
              Keep my code
            </button>
            <button
              onClick={applyReset}
              className="btn px-5 py-2.5 text-white"
              style={{ backgroundColor: "var(--color-hard)" }}
            >
              Reset
            </button>
          </div>
        </>
      </Modal>
    </div>
  );
}
