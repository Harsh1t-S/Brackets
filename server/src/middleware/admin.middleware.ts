import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

// Re-export the single canonical `protect` so admin routes and everything
// else share one implementation (was previously duplicated here).
export { protect } from "../modules/auth/auth.middleware";

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== Role.ADMIN) {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
};
