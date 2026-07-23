import { Router } from "express";
import { protect, adminOnly } from "../../middleware/admin.middleware";
import { list, updateRole, remove } from "./adminUser.controller";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/", list);
router.patch("/:id/role", updateRole);
router.delete("/:id", remove);

export default router;
