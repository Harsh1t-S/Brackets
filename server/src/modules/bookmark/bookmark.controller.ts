import { Request, Response } from "express";
import { toggleBookmark, getBookmarks } from "./bookmark.service";
import { toggleBookmarkSchema } from "./bookmark.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const toggle = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { problemId } = toggleBookmarkSchema.parse(req.body);
  const result = await toggleBookmark(req.user.id, problemId);

  res.status(200).json({ success: true, data: result });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const bookmarks = await getBookmarks(req.user.id);
  res.status(200).json({ success: true, data: bookmarks });
});
