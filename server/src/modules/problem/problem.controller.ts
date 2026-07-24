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
  getProblemContext,
  getRandomProblem,
} from "./problem.service";
import { voteSchema } from "./problem.validation";
import {
  toList,
  toPage,
  toLimit,
  toStatus,
  toMatch,
  toDifficulties,
} from "./problem.filters";
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

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, difficulty, tag, tags, companies, match, status, sort } =
    req.query;

  const result = await getProblems({
    page: toPage(page),
    limit: toLimit(limit),
    search: search as string,
    difficulties: toDifficulties(difficulty),
    // `tag` (singular) kept for the older links that point at one topic.
    tags: [...new Set([...toList(tag), ...toList(tags)])],
    companies: toList(companies),
    match: toMatch(match),
    status: toStatus(status),
    sort: sort as string,
    userId: req.user?.id,
  });

  res.status(200).json({ success: true, data: result });
});

export const filters = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getFilterFacets();
  res.status(200).json({ success: true, data });
});

export const random = asyncHandler(async (req: Request, res: Response) => {
  const { search, difficulty, tag, tags, companies, match, status } = req.query;

  // Shuffle honours whatever the list is currently filtered to.
  const data = await getRandomProblem({
    search: search as string,
    difficulties: toDifficulties(difficulty),
    tags: [...new Set([...toList(tag), ...toList(tags)])],
    companies: toList(companies),
    match: toMatch(match),
    status: toStatus(status),
    userId: req.user?.id,
  });

  if (!data) throw new ApiError(404, "No problems match those filters.");
  res.status(200).json({ success: true, data });
});

export const context = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const data = await getProblemContext(req.params.id);
    res.status(200).json({ success: true, data });
  }
);

export const details = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response) => {
    const problem = await getProblem(req.params.slug);

    if (!problem) {
      throw new ApiError(404, "Problem not found.");
    }

    // The route is behind `protect`, so every caller here is authenticated
    // and gets the full problem including the reference solution.
    res.status(200).json({ success: true, data: problem });
  }
);
