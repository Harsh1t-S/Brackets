import { Router } from "express";

import controller from "./adminDashboard.controller";

import {
  protect,
  adminOnly,
} from "../../middleware/admin.middleware";

const router = Router();

router.use(protect);

router.use(adminOnly);

router.get(
  "/stats",
  controller.getDashboardStats
);

export default router;