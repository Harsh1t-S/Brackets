import { Router } from "express";
import { protect, adminOnly } from "../../middleware/admin.middleware";
import { list, updateRole } from "./adminUser.controller";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/", list);
router.patch("/:id/role", updateRole);

export default router;
