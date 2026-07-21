import { Request, Response } from "express";
import { getAllUsers, setUserRole } from "./adminUser.service";
import { updateRoleSchema } from "./adminUser.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json({ success: true, data: users });
});

export const updateRole = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { role } = updateRoleSchema.parse(req.body);

    if (req.user?.id === req.params.id && role !== "ADMIN") {
      throw new ApiError(400, "You cannot remove your own admin access.");
    }

    const user = await setUserRole(req.params.id, role);
    res.status(200).json({ success: true, data: user });
  }
);
