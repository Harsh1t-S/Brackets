import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Problem } from "../../../types/problem";
import { clearDraft, initialCode, writeDraft } from "../lib/drafts";

/**
 * Shared state for the solve view.
 *
 * The editor and the testcase console used to live inside one component, so
 * they could just share `useState`. Now that each is an independently
 * dockable panel — and either may be closed, re-tabbed or moved — the state
 * they share has to sit above the dock rather than inside any one panel.
 */
interface SolveContextValue {
  problem: Problem;

  language: string;
  languages: string[];
  changeLanguage: (lang: string) => void;

  code: string;
  setCode: (code: string) => void;
  starter: string;
  isDirty: boolean;
  draftSaved: boolean;
  resetCode: () => void;

  activeCase: number;
  setActiveCase: (index: number) => void;

  run: () => void;
  submit: () => void;
}

const SolveContext = createContext<SolveContextValue | null>(null);

export function SolveProvider({
  problem,
  onRun,
  onSubmit,
  children,
}: {
  problem: Problem;
  onRun: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}) {
  const languages = useMemo(
    () => Object.keys(problem.starterCode),
    [problem.starterCode]
  );

  const firstLang = languages[0] ?? "javascript";
  const [language, setLanguage] = useState(firstLang);
  const [code, setCode] = useState(() =>
    initialCode(problem.id, firstLang, problem.starterCode[firstLang] ?? "")
  );
  const [activeCase, setActiveCase] = useState(0);
  const [draftSaved, setDraftSaved] = useState(false);

  const starter = problem.starterCode[language] ?? "";
  const isDirty = code !== starter;

  // Navigating to an already-cached problem doesn't unmount the tree, so
  // re-seed from that problem's draft whenever the id changes.
  useEffect(() => {
    const first = Object.keys(problem.starterCode)[0] ?? "javascript";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(first);
    setCode(initialCode(problem.id, first, problem.starterCode[first] ?? ""));
    setActiveCase(0);
    setDraftSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  // Persist on an idle window rather than per keystroke.
  const saveTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      writeDraft(problem.id, language, code, starter);
      setDraftSaved(code !== starter);
    }, 400);
    return () => window.clearTimeout(saveTimer.current);
  }, [code, language, problem.id, starter]);

  // Flush the pending write if this unmounts mid-edit. The buffer is read
  // through a ref so `code` can stay out of the dependency list — with it
  // there, the cleanup fired on every keystroke and wrote synchronously,
  // which is exactly what the debounce above exists to avoid.
  const buffer = useRef({ code, starter });
  useEffect(() => {
    buffer.current = { code, starter };
  }, [code, starter]);
  useEffect(() => {
    const flush = () =>
      writeDraft(
        problem.id,
        language,
        buffer.current.code,
        buffer.current.starter
      );
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [problem.id, language]);

  const changeLanguage = useCallback(
    (lang: string) => {
      writeDraft(problem.id, language, code, starter);
      setLanguage(lang);
      setCode(initialCode(problem.id, lang, problem.starterCode[lang] ?? ""));
    },
    [problem.id, problem.starterCode, language, code, starter]
  );

  const resetCode = useCallback(() => {
    clearDraft(problem.id, language);
    setCode(starter);
    setDraftSaved(false);
  }, [problem.id, language, starter]);

  const value = useMemo<SolveContextValue>(
    () => ({
      problem,
      language,
      languages,
      changeLanguage,
      code,
      setCode,
      starter,
      isDirty,
      draftSaved,
      resetCode,
      activeCase,
      setActiveCase,
      run: onRun,
      submit: onSubmit,
    }),
    [
      problem,
      language,
      languages,
      changeLanguage,
      code,
      starter,
      isDirty,
      draftSaved,
      resetCode,
      activeCase,
      onRun,
      onSubmit,
    ]
  );

  return (
    <SolveContext.Provider value={value}>{children}</SolveContext.Provider>
  );
}

// Matches the codebase's existing pattern for context hooks (see AuthContext).
// eslint-disable-next-line react-refresh/only-export-components
export function useSolve(): SolveContextValue {
  const value = useContext(SolveContext);
  if (!value) {
    throw new Error("useSolve must be used inside a SolveProvider");
  }
  return value;
}
