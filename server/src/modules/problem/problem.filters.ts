/**
 * Pure request-parsing helpers for the problem list. Kept separate from the
 * controller so the filter semantics can be unit-tested without a database
 * or an HTTP layer.
 */

export const DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);
export const STATUSES = new Set(["solved", "unsolved", "bookmarked"]);
export type ProblemStatus = "solved" | "unsolved" | "bookmarked";

/** "a,b" | ["a","b"] -> ["a","b"] (trimmed, de-duped, capped). */
export function toList(value: unknown, cap = 25): string[] {
  const raw = Array.isArray(value) ? value : [value];
  const parts = raw
    .filter((v): v is string => typeof v === "string")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set(parts)].slice(0, cap);
}

/** Clamp a page number to a sane positive integer. */
export function toPage(value: unknown): number {
  return Math.max(Number(value) || 1, 1);
}

/** Clamp page size so one request can't dump the whole table. */
export function toLimit(value: unknown, max = 100): number {
  return Math.min(Math.max(Number(value) || 10, 1), max);
}

export function toStatus(value: unknown): ProblemStatus | undefined {
  return typeof value === "string" && STATUSES.has(value)
    ? (value as ProblemStatus)
    : undefined;
}

export function toMatch(value: unknown): "all" | "any" {
  return value === "all" ? "all" : "any";
}

/** Only real difficulty enum members survive. */
export function toDifficulties(value: unknown): string[] {
  return toList(value).filter((d) => DIFFICULTIES.has(d));
}
