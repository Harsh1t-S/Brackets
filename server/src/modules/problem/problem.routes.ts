import { Router } from "express";

import * as controller from "./problem.controller";
import { protect, optionalAuth } from "../auth/auth.middleware";

const router = Router();

// optionalAuth so signed-in users get solved marks and status filters.
router.get("/", optionalAuth, controller.list);

router.get("/stats", controller.stats);
router.get("/filters", controller.filters);

router.post("/:id/vote", protect, controller.vote);
router.get("/:id/vote", protect, controller.myVote);

router.post("/:id/solved", protect, controller.solved);
router.get("/:id/solved", protect, controller.mySolved);

router.get("/:slug", optionalAuth, controller.details);

export default router;
