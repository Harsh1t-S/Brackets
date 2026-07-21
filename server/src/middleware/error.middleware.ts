import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { isProduction } from "../config/env";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Expected, client-facing errors are the normal control flow — no need to
  // log them as if they were crashes. Only log the unexpected ones.
  if (!(error instanceof ApiError)) {
    console.error(error);
  }

  if (error instanceof ApiError) {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          message: "A unique field already exists.",
        });
        return;

      case "P2025":
        res.status(404).json({
          success: false,
          message: "Record not found.",
        });
        return;

      case "P2003":
        res.status(404).json({
          success: false,
          message: "Related record not found.",
        });
        return;
    }
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "SLUG_ALREADY_EXISTS":
        res.status(409).json({
          success: false,
          message: "A problem with this slug already exists.",
        });
        return;
    }
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    // Never leak internal error detail to clients in production; surface it in
    // development to make debugging easier.
    ...(!isProduction &&
      error instanceof Error && { detail: error.message }),
  });
};