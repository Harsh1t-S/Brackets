import { Request, Response } from "express";
import adminProblemService from "./adminProblem.service";
import {
  createProblemSchema,
  updateProblemSchema,
} from "./adminProblem.validation";

export class AdminProblemController {
  async getAllProblems(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { page, limit, search, difficulty } = req.query;

      const result = await adminProblemService.getAllProblems({
        page: Math.max(Number(page) || 1, 1),
        // Clamp so an admin request can't ask for an unbounded page size.
        limit: Math.min(Math.max(Number(limit) || 10, 1), 100),
        search: search as string,
        difficulty: difficulty as string,
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
  }

  async getProblemById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const problem = await adminProblemService.getProblemById(id);

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
  }

  async createProblem(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const parsed = createProblemSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const problem = await adminProblemService.createProblem({
        ...parsed.data,
        createdById: req.user?.id,
      });

      res.status(201).json({
        success: true,
        message: "Problem created successfully.",
        data: problem,
      });
    } catch (error) {
  console.error(error);

  if (
    error instanceof Error &&
    error.message === "SLUG_ALREADY_EXISTS"
  ) {
    res.status(409).json({
      success: false,
      message: "A problem with this slug already exists.",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Failed to create problem.",
  });
}
  }

  async updateProblem(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const parsed = updateProblemSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const updated = await adminProblemService.updateProblem(
        id,
        parsed.data
      );

      res.status(200).json({
        success: true,
        message: "Problem updated successfully.",
        data: updated,
      });
    } catch (error) {
  console.error(error);

  if (
    error instanceof Error &&
    error.message === "SLUG_ALREADY_EXISTS"
  ) {
    res.status(409).json({
      success: false,
      message: "A problem with this slug already exists.",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Failed to update problem.",
  });
}
}

  async deleteProblem(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      await adminProblemService.deleteProblem(id);

      res.status(200).json({
        success: true,
        message: "Problem deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to delete problem.",
      });
    }
  }
}

export default new AdminProblemController();