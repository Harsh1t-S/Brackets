import { Request, Response } from "express";
import {
  getProblems,
  getProblem,
  getStats,
  setVote,
  getMyVote,
  toggleSolved,
  getMySolved,
  getFilterFacets,
} from "./problem.service";
import { voteSchema } from "./problem.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const vote = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { value } = voteSchema.parse(req.body);

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = await setVote(req.user.id, req.params.id, value);
    res.status(200).json({ success: true, data: result });
  }
);

export const myVote = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const value = await getMyVote(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { value } });
  }
);

export const solved = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = await toggleSolved(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: result });
  }
);

export const mySolved = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const value = await getMySolved(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { solved: value } });
  }
);

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await getStats();
  res.status(200).json({ success: true, data: result });
});

/** "a,b" | ["a","b"] -> ["a","b"] (trimmed, de-duped, capped). */
function toList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : [value];
  const parts = raw
    .filter((v): v is string => typeof v === "string")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set(parts)].slice(0, 25);
}

const STATUSES = new Set(["solved", "unsolved", "bookmarked"]);

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, difficulty, tag, tags, companies, match, status, sort } =
    req.query;

  const statusValue = typeof status === "string" && STATUSES.has(status)
    ? (status as "solved" | "unsolved" | "bookmarked")
    : undefined;

  const result = await getProblems({
    page: Math.max(Number(page) || 1, 1),
    // Cap the page size so one request can't dump the whole set.
    limit: Math.min(Math.max(Number(limit) || 10, 1), 100),
    search: search as string,
    difficulties: toList(difficulty),
    // `tag` (singular) kept for the older links that point at one topic.
    tags: [...new Set([...toList(tag), ...toList(tags)])],
    companies: toList(companies),
    match: match === "all" ? "all" : "any",
    status: statusValue,
    sort: sort as string,
    userId: req.user?.id,
  });

  res.status(200).json({ success: true, data: result });
});

export const filters = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getFilterFacets();
  res.status(200).json({ success: true, data });
});

export const details = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response) => {
    const problem = await getProblem(req.params.slug);

    if (!problem) {
      throw new ApiError(404, "Problem not found.");
    }

    // The reference solution is only for signed-in users; anonymous
    // visitors get everything else (statement, examples, starter code).
    const data = req.user ? problem : { ...problem, solutionCode: {} };

    res.status(200).json({ success: true, data });
  }
);
