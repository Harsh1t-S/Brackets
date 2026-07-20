import { Request, Response } from "express";
import { ZodError } from "zod";
import { register, login } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  updateMeSchema,
} from "./auth.validation";
import prisma from "../../prisma/prisma";

function zodMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);

    const result = await register(body);

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, message: zodMessage(error) });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await login(body);

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, message: zodMessage(error) });
      return;
    }
    res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }
};

export const me = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const body = updateMeSchema.parse(req.body);

    if (body.name === undefined && body.avatar === undefined) {
      res.status(400).json({ success: false, message: "Nothing to update." });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, message: zodMessage(error) });
      return;
    }
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile." });
  }
};
