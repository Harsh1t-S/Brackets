import { describe, it, expect } from "vitest";
import { escapeLike } from "./problem.service";

/**
 * Search terms are bound parameters, so this was never an injection risk —
 * but `%` and `_` are wildcards *inside* a LIKE pattern. Before escaping,
 * searching "%" matched every problem in the table.
 */
describe("escapeLike", () => {
  it("neutralises the percent wildcard", () => {
    expect(escapeLike("%")).toBe("\\%");
    expect(escapeLike("50%")).toBe("50\\%");
  });

  it("neutralises the single-character wildcard", () => {
    expect(escapeLike("a_b")).toBe("a\\_b");
  });

  it("escapes backslashes before the wildcards they would escape", () => {
    // Postgres' default LIKE escape character is a backslash, so a literal
    // one has to be doubled or it swallows the character after it.
    expect(escapeLike("\\")).toBe("\\\\");
    expect(escapeLike("\\%")).toBe("\\\\\\%");
  });

  it("leaves ordinary terms untouched", () => {
    expect(escapeLike("two sum")).toBe("two sum");
    expect(escapeLike("Binary Search")).toBe("Binary Search");
  });

  it("does not treat regex metacharacters as special", () => {
    // Only LIKE metacharacters matter; these must survive verbatim.
    expect(escapeLike("a.b*c+d")).toBe("a.b*c+d");
  });
});
