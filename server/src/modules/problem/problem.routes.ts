import { Router } from "express";

import * as controller from "./problem.controller";
import { protect, optionalAuth } from "../auth/auth.middleware";

const router = Router();

router.get("/", controller.list);

router.get("/stats", controller.stats);

router.post("/:id/vote", protect, controller.vote);
router.get("/:id/vote", protect, controller.myVote);

router.post("/:id/solved", protect, controller.solved);
router.get("/:id/solved", protect, controller.mySolved);

router.get("/:slug", optionalAuth, controller.details);

export default router;
