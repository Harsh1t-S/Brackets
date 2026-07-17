import { Request, Response } from "express";
import { register, login } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);

    const result = await register(body);

    res.status(201).json(result);
  } catch (error: any) {
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
    res.status(400).json({
      success: false,
      message: error.message,
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