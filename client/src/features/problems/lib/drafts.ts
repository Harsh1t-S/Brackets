/**
 * Per-problem, per-language persistence for the code editor.
 *
 * Without this, switching language or moving to the next problem silently
 * replaced whatever you had typed with the starter code — the editor had no
 * memory at all. Drafts are keyed by problem *and* language so the two
 * buffers never overwrite each other.
 *
 * localStorage can throw (private mode, quota), and a lost draft must never
 * take the editor down with it, so every access is guarded.
 */

const PREFIX = "bracket:draft:";

const keyFor = (problemId: string, language: string) =>
  `${PREFIX}${problemId}:${language}`;

export function readDraft(
  problemId: string,
  language: string
): string | null {
  try {
    return localStorage.getItem(keyFor(problemId, language));
  } catch {
    return null;
  }
}

/**
 * Store a draft, or drop it when the code is back to the starter — there's no
 * point keeping (or restoring) a buffer identical to what we'd seed anyway.
 */
export function writeDraft(
  problemId: string,
  language: string,
  code: string,
  starter: string
): void {
  try {
    if (code === starter) localStorage.removeItem(keyFor(problemId, language));
    else localStorage.setItem(keyFor(problemId, language), code);
  } catch {
    // Quota or a disabled store — the in-memory buffer still works.
  }
}

export function clearDraft(problemId: string, language: string): void {
  try {
    localStorage.removeItem(keyFor(problemId, language));
  } catch {
    // Ignore — see writeDraft.
  }
}

/** The saved draft if there is one, otherwise the problem's starter code. */
export function initialCode(
  problemId: string,
  language: string,
  starter: string
): string {
  return readDraft(problemId, language) ?? starter;
}
