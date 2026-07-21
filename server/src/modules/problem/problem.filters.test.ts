import { describe, it, expect } from "vitest";
import {
  toList,
  toPage,
  toLimit,
  toStatus,
  toMatch,
  toDifficulties,
} from "./problem.filters";

describe("toList", () => {
  it("splits a comma-separated string", () => {
    expect(toList("Array,Hash Map")).toEqual(["Array", "Hash Map"]);
  });

  it("accepts a repeated query param array", () => {
    expect(toList(["Array", "Math"])).toEqual(["Array", "Math"]);
  });

  it("trims whitespace and drops empties", () => {
    expect(toList(" Array , , Math ")).toEqual(["Array", "Math"]);
  });

  it("de-duplicates", () => {
    expect(toList("Array,Array,Math")).toEqual(["Array", "Math"]);
  });

  it("caps the number of values", () => {
    const many = Array.from({ length: 40 }, (_, i) => `t${i}`).join(",");
    expect(toList(many)).toHaveLength(25);
  });

  it("ignores non-string input", () => {
    expect(toList(undefined)).toEqual([]);
    expect(toList(42)).toEqual([]);
  });
});

describe("toPage", () => {
  it("defaults to 1 and never goes below it", () => {
    expect(toPage(undefined)).toBe(1);
    expect(toPage("0")).toBe(1);
    expect(toPage("-5")).toBe(1);
    expect(toPage("abc")).toBe(1);
  });

  it("passes through valid pages", () => {
    expect(toPage("3")).toBe(3);
  });
});

describe("toLimit", () => {
  it("defaults to 10", () => {
    expect(toLimit(undefined)).toBe(10);
  });

  it("caps at the maximum so the set can't be dumped", () => {
    expect(toLimit("100000")).toBe(100);
  });

  it("keeps a sensible value", () => {
    expect(toLimit("25")).toBe(25);
  });
});

describe("toStatus", () => {
  it("accepts only known statuses", () => {
    expect(toStatus("solved")).toBe("solved");
    expect(toStatus("unsolved")).toBe("unsolved");
    expect(toStatus("bookmarked")).toBe("bookmarked");
  });

  it("rejects anything else", () => {
    expect(toStatus("deleted")).toBeUndefined();
    expect(toStatus(undefined)).toBeUndefined();
  });
});

describe("toMatch", () => {
  it("only 'all' opts into AND semantics", () => {
    expect(toMatch("all")).toBe("all");
    expect(toMatch("any")).toBe("any");
    expect(toMatch(undefined)).toBe("any");
    expect(toMatch("ALL")).toBe("any");
  });
});

describe("toDifficulties", () => {
  it("keeps valid enum members", () => {
    expect(toDifficulties("EASY,HARD")).toEqual(["EASY", "HARD"]);
  });

  it("drops anything not in the enum (no SQL cast errors)", () => {
    expect(toDifficulties("EASY,BOGUS")).toEqual(["EASY"]);
    expect(toDifficulties("easy")).toEqual([]);
  });
});
