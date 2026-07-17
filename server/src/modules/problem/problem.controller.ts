import { Request, Response } from "express";
import {
  getProblems,
  getProblem,
  getStats,
  setVote,
  getMyVote,
} from "./problem.service";
import { Prisma } from "@prisma/client";

export const vote = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { value } = req.body;

    if (value !== 1 && value !== -1) {
      res.status(400).json({
        success: false,
        message: "value must be 1 (like) or -1 (dislike).",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const result = await setVote(req.user.id, req.params.id, value);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ success: false, message: "Problem not found." });
      return;
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to vote." });
  }
};

export const myVote = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const value = await getMyVote(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { value } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch vote." });
  }
};

export const stats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await getStats();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats.",
    });
  }
};

export const list = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page,
      limit,
      search,
      difficulty,
      tag,
    } = req.query;

    const result = await getProblems({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search as string,
      difficulty: difficulty as string,
      tag: tag as string,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problems.",
    });
  }
};

export const details = async (
  req: Request<{ slug: string }>,
  res: Response
): Promise<void> => {
  try {
    const problem = await getProblem(req.params.slug);

    if (!problem) {
      res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problem.",
    });
  }
};
