import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { getAllUsers, setUserRole } from "./adminUser.service";

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

export const updateRole = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.body;

    if (role !== Role.ADMIN && role !== Role.USER) {
      res.status(400).json({ success: false, message: "Invalid role." });
      return;
    }

    if (req.user?.id === req.params.id && role !== Role.ADMIN) {
      res.status(400).json({
        success: false,
        message: "You cannot remove your own admin access.",
      });
      return;
    }

    const user = await setUserRole(req.params.id, role);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update role." });
  }
};
