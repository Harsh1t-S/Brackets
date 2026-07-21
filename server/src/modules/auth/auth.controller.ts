import { Request, Response } from "express";
import { register, login } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  updateMeSchema,
} from "./auth.validation";
import prisma from "../../prisma/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const result = await register(body);
    res.status(201).json({ success: true, data: result });
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  const result = await login(body);
  res.status(200).json({ success: true, data: result });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  res.status(200).json({ success: true, data: { user: req.user } });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const body = updateMeSchema.parse(req.body);

  if (body.name === undefined && body.avatar === undefined) {
    throw new ApiError(400, "Nothing to update.");
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.avatar !== undefined && { avatar: body.avatar }),
    },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });

  res.status(200).json({ success: true, data: { user } });
});
