import { Router } from "express";

import * as controller from "./problem.controller";
import { protect } from "../auth/auth.middleware";

const router = Router();

router.get("/", controller.list);

router.get("/stats", controller.stats);

router.post("/:id/vote", protect, controller.vote);
router.get("/:id/vote", protect, controller.myVote);

router.get("/:slug", controller.details);

export default router;
