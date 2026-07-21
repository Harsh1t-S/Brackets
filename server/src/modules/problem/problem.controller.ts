import { Request, Response } from "express";
import {
  getProblems,
  getProblem,
  getStats,
  setVote,
  getMyVote,
  toggleSolved,
  getMySolved,
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

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, difficulty, tag, sort } = req.query;

  const result = await getProblems({
    page: Math.max(Number(page) || 1, 1),
    // Cap the page size so one request can't dump the whole set.
    limit: Math.min(Math.max(Number(limit) || 10, 1), 100),
    search: search as string,
    difficulty: difficulty as string,
    tag: tag as string,
    sort: sort as string,
  });

  res.status(200).json({ success: true, data: result });
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
