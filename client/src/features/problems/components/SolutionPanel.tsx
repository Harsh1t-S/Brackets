import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Problem } from "../../../types/problem";

interface Props {
  problem: Problem;
}

export default function SolutionPanel({ problem }: Props) {
  const languages = useMemo(
    () => Object.keys(problem.solutionCode),
    [problem]
  );
  const [language, setLanguage] = useState(languages[0] ?? "javascript");
  const [show, setShow] = useState(false);

  return (
    <section className="mt-10">
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Solution</h2>
          <div className="flex items-center gap-2">
            {show && languages.length > 1 && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Solution language"
                className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setShow((v) => !v)}
              className="btn btn-secondary px-4 py-2 text-sm"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
              {show ? "Hide" : "Reveal"}
            </button>
          </div>
        </div>

        {show ? (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-sm leading-6 text-ink">
            <code>{problem.solutionCode[language]}</code>
          </pre>
        ) : (
          <p className="mt-2 text-sm text-ink-subtle">
            Reveal the reference solution once you've given it a try.
          </p>
        )}
      </div>
    </section>
  );
}
