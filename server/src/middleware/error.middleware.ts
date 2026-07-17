import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(error);

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
  });
};