import { Router } from "express";

import controller from "./dashboard.controller";
import { protect } from "../../middleware/admin.middleware";

const router = Router();

router.use(protect);

router.get(
  "/",
  controller.getDashboard
);

export default router;