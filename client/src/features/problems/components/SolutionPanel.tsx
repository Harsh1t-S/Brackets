import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, FileQuestion } from "lucide-react";
import type { Problem } from "../../../types/problem";
import { useAuth } from "../../auth/context/AuthContext";

interface Props {
  problem: Problem;
}

export default function SolutionPanel({ problem }: Props) {
  const { user } = useAuth();
  const languages = useMemo(
    () => Object.keys(problem.solutionCode ?? {}),
    [problem]
  );
  const [language, setLanguage] = useState(languages[0] ?? "javascript");
  const [show, setShow] = useState(false);

  // Same remount caveat as the editor: re-seed on problem change so a
  // cached navigation can't leave the previous problem's solution showing.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(Object.keys(problem.solutionCode ?? {})[0] ?? "javascript");
     
    setShow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  // An empty solutionCode means one of two different things: the API
  // withheld it (signed out), or nobody has written one yet. Saying
  // "sign in" to an already-signed-in user is just confusing.
  if (languages.length === 0) {
    return (
      <section>
        <div className="card flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-ink-subtle">
              {user ? <FileQuestion size={18} /> : <Lock size={18} />}
            </span>
            <div>
              <h2 className="font-semibold text-ink">Solution</h2>
              <p className="text-sm text-ink-muted">
                {user
                  ? "No reference solution has been added for this problem yet."
                  : "Sign in to view the reference solution."}
              </p>
            </div>
          </div>
          {!user && (
            <Link to="/login" className="btn btn-secondary px-4 py-2 text-sm">
              Sign in
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section>
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
