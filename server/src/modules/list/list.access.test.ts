import { describe, it, expect } from "vitest";
import { canViewList, slugBase } from "./list.service";

/**
 * The visibility matrix is the security boundary for lists: a private list
 * must never be readable by anyone but its owner, and the decision is made
 * here rather than in the route. These lock every cell of that matrix so a
 * later refactor can't quietly open a private list up.
 */
describe("canViewList", () => {
  const OWNER = "user-1";
  const OTHER = "user-2";

  it("lets the owner read their own private list", () => {
    expect(canViewList({ visibility: "PRIVATE", ownerId: OWNER }, OWNER)).toBe(true);
  });

  it("hides a private list from a different signed-in user", () => {
    expect(canViewList({ visibility: "PRIVATE", ownerId: OWNER }, OTHER)).toBe(false);
  });

  it("hides a private list from an anonymous viewer", () => {
    expect(canViewList({ visibility: "PRIVATE", ownerId: OWNER }, undefined)).toBe(false);
  });

  it("shows a public list to its owner", () => {
    expect(canViewList({ visibility: "PUBLIC", ownerId: OWNER }, OWNER)).toBe(true);
  });

  it("shows a public list to any other signed-in user", () => {
    expect(canViewList({ visibility: "PUBLIC", ownerId: OWNER }, OTHER)).toBe(true);
  });

  it("shows a public list to an anonymous viewer", () => {
    expect(canViewList({ visibility: "PUBLIC", ownerId: OWNER }, undefined)).toBe(true);
  });

  it("does not treat an empty-string viewer as the owner", () => {
    // A falsy id must never match a falsy stored owner and leak the list.
    expect(canViewList({ visibility: "PRIVATE", ownerId: "" }, "")).toBe(false);
  });
});

/**
 * Slugs land in public URLs, so the base has to be URL-safe and can't be
 * driven to something dangerous or empty by a hostile name.
 */
describe("slugBase", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugBase("Dynamic Programming")).toBe("dynamic-programming");
  });

  it("strips characters that don't belong in a URL slug", () => {
    expect(slugBase("C++ / Interview!! prep")).toBe("c-interview-prep");
  });

  it("collapses runs of separators", () => {
    expect(slugBase("a   -  b")).toBe("a-b");
  });

  it("falls back to a constant when nothing usable remains", () => {
    // An all-symbol name must not produce an empty slug.
    expect(slugBase("!!!@@@")).toBe("list");
    expect(slugBase("   ")).toBe("list");
  });

  it("caps the length so a huge name can't make an unwieldy URL", () => {
    expect(slugBase("a".repeat(200)).length).toBeLessThanOrEqual(40);
  });
});
