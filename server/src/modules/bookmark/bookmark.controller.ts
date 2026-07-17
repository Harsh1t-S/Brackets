import { Request, Response } from "express";
import {
  toggleBookmark,
  getBookmarks,
} from "./bookmark.service";

export const toggle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { problemId } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await toggleBookmark(
      req.user.id,
      problemId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const list = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const bookmarks = await getBookmarks(req.user.id);

    res.status(200).json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};