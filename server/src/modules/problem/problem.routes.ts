import { Router } from "express";

import * as controller from "./problem.controller";
import { protect, optionalAuth } from "../auth/auth.middleware";

const router = Router();

// optionalAuth so signed-in users get solved marks and status filters.
router.get("/", optionalAuth, controller.list);

// Static paths must precede "/:slug" so they aren't swallowed by it.
router.get("/stats", controller.stats);
router.get("/filters", controller.filters);
// optionalAuth so shuffle can honour the solved/bookmarked status filters.
router.get("/random", optionalAuth, controller.random);

router.post("/:id/vote", protect, controller.vote);
router.get("/:id/vote", protect, controller.myVote);

router.post("/:id/solved", protect, controller.solved);
router.get("/:id/solved", protect, controller.mySolved);

router.get("/:id/context", controller.context);

router.get("/:slug", optionalAuth, controller.details);

export default router;
