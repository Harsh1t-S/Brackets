import { Request, Response } from "express";
import { getAllUsers, setUserRole, deleteUser } from "./adminUser.service";
import { updateRoleSchema } from "./adminUser.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { toLimit, toPage } from "../problem/problem.filters";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;

  const data = await getAllUsers({
    search,
    page: toPage(req.query.page),
    limit: toLimit(req.query.limit, 100),
  });

  res.status(200).json({ success: true, data });
});

export const updateRole = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { role } = updateRoleSchema.parse(req.body);

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (req.user.id === req.params.id && role !== "ADMIN") {
      throw new ApiError(400, "You cannot remove your own admin access.");
    }

    const user = await setUserRole(req.params.id, role, req.user.id);
    res.status(200).json({ success: true, data: user });
  }
);

export const remove = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    // Deleting yourself would drop the account you're acting with — and could
    // strand the platform with no admin. Block it, same as self-demotion.
    if (req.user.id === req.params.id) {
      throw new ApiError(400, "You cannot delete your own account.");
    }

    await deleteUser(req.params.id);
    res.status(200).json({ success: true, data: { id: req.params.id } });
  }
);
