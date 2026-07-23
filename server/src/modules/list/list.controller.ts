import { Request, Response } from "express";
import * as service from "./list.service";
import {
  createListSchema,
  updateListSchema,
  problemIdSchema,
} from "./list.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

/** Every authenticated handler needs the caller; centralise the check. */
function requireUser(req: Request): string {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user.id;
}

export const myLists = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getMyLists(requireUser(req));
  res.status(200).json({ success: true, data });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = createListSchema.parse(req.body);
  const data = await service.createList(requireUser(req), input);
  res.status(201).json({ success: true, data });
});

// Public read: optionalAuth, so a PUBLIC list opens for anyone with the link
// while a PRIVATE one stays invisible to everyone but its owner.
export const detail = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response) => {
    const data = await service.getList(req.params.slug, req.user?.id);
    res.status(200).json({ success: true, data });
  }
);

export const update = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const input = updateListSchema.parse(req.body);
    const data = await service.updateList(req.params.id, requireUser(req), input);
    res.status(200).json({ success: true, data });
  }
);

export const remove = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const data = await service.deleteList(req.params.id, requireUser(req));
    res.status(200).json({ success: true, data });
  }
);

export const addItem = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { problemId } = problemIdSchema.parse(req.body);
    const data = await service.addProblem(
      req.params.id,
      requireUser(req),
      problemId
    );
    res.status(200).json({ success: true, data });
  }
);

export const removeItem = asyncHandler(
  async (req: Request<{ id: string; problemId: string }>, res: Response) => {
    const data = await service.removeProblem(
      req.params.id,
      requireUser(req),
      req.params.problemId
    );
    res.status(200).json({ success: true, data });
  }
);

export const forProblem = asyncHandler(
  async (req: Request<{ problemId: string }>, res: Response) => {
    const data = await service.getListsForProblem(
      requireUser(req),
      req.params.problemId
    );
    res.status(200).json({ success: true, data });
  }
);

export const toggleFavourite = asyncHandler(
  async (req: Request<{ problemId: string }>, res: Response) => {
    const data = await service.toggleFavourite(
      requireUser(req),
      req.params.problemId
    );
    res.status(200).json({ success: true, data });
  }
);
