import { describe, it, expect } from "vitest";
import { voteTransition } from "./problem.service";

/**
 * Like/dislike totals are denormalised onto Problem, so these deltas are the
 * only thing keeping the counters in step with the ProblemVote rows. Drift
 * here has shipped twice, and it is invisible until the numbers have already
 * diverged — hence covering every transition rather than the happy path.
 */
describe("voteTransition", () => {
  it("adds a like from no vote", () => {
    expect(voteTransition(0, 1)).toEqual({
      next: 1,
      likesDelta: 1,
      dislikesDelta: 0,
    });
  });

  it("adds a dislike from no vote", () => {
    expect(voteTransition(0, -1)).toEqual({
      next: -1,
      likesDelta: 0,
      dislikesDelta: 1,
    });
  });

  it("clears a like when the same button is clicked again", () => {
    expect(voteTransition(1, 1)).toEqual({
      next: 0,
      likesDelta: -1,
      dislikesDelta: 0,
    });
  });

  it("clears a dislike when the same button is clicked again", () => {
    expect(voteTransition(-1, -1)).toEqual({
      next: 0,
      likesDelta: 0,
      dislikesDelta: -1,
    });
  });

  it("moves a like to a dislike in one step", () => {
    // Both counters must move, or switching sides inflates one of them.
    expect(voteTransition(1, -1)).toEqual({
      next: -1,
      likesDelta: -1,
      dislikesDelta: 1,
    });
  });

  it("moves a dislike to a like in one step", () => {
    expect(voteTransition(-1, 1)).toEqual({
      next: 1,
      likesDelta: 1,
      dislikesDelta: -1,
    });
  });

  it("keeps the two counters in balance across any transition", () => {
    // A vote is worth exactly one row, so a transition can never add (or
    // remove) more than one unit of weight in total.
    for (const old of [-1, 0, 1]) {
      for (const clicked of [1, -1] as const) {
        const { likesDelta, dislikesDelta } = voteTransition(old, clicked);
        expect(Math.abs(likesDelta) + Math.abs(dislikesDelta)).toBeLessThanOrEqual(2);
        expect(likesDelta).toBeGreaterThanOrEqual(-1);
        expect(likesDelta).toBeLessThanOrEqual(1);
        expect(dislikesDelta).toBeGreaterThanOrEqual(-1);
        expect(dislikesDelta).toBeLessThanOrEqual(1);
      }
    }
  });

  it("round-trips to zero: any vote followed by its own toggle is a no-op", () => {
    for (const clicked of [1, -1] as const) {
      const first = voteTransition(0, clicked);
      const second = voteTransition(first.next, clicked);
      expect(first.likesDelta + second.likesDelta).toBe(0);
      expect(first.dislikesDelta + second.dislikesDelta).toBe(0);
      expect(second.next).toBe(0);
    }
  });

  it("never leaves the vote in a state outside -1, 0, 1", () => {
    for (const old of [-1, 0, 1]) {
      for (const clicked of [1, -1] as const) {
        expect([-1, 0, 1]).toContain(voteTransition(old, clicked).next);
      }
    }
  });
});
