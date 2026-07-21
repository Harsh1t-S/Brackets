// Single source of truth for difficulty presentation — was duplicated across
// the dashboard, profile, bookmarks, problem table and card.

export function difficultyBadgeClass(difficulty: string): string {
  switch (difficulty) {
    case "EASY":
      return "badge badge-easy";
    case "MEDIUM":
      return "badge badge-medium";
    case "HARD":
      return "badge badge-hard";
    default:
      return "badge badge-easy";
  }
}

export function difficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case "EASY":
      return "Easy";
    case "MEDIUM":
      return "Medium";
    case "HARD":
      return "Hard";
    default:
      return difficulty;
  }
}

/** "1 problem" / "2 problems" — appends "s" unless count is exactly 1. */
export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
