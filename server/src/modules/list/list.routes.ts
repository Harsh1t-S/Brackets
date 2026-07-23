import { Router } from "express";
import * as controller from "./list.controller";
import { protect, optionalAuth } from "../auth/auth.middleware";

const router = Router();

// Static and owner-scoped paths first, so none of them are swallowed by
// "/:slug" below.
router.get("/mine", protect, controller.myLists);
router.post("/", protect, controller.create);

router.get("/for-problem/:problemId", protect, controller.forProblem);
router.post("/favourite/:problemId", protect, controller.toggleFavourite);

router.patch("/:id", protect, controller.update);
router.delete("/:id", protect, controller.remove);

router.post("/:id/items", protect, controller.addItem);
router.delete("/:id/items/:problemId", protect, controller.removeItem);

// Public read by slug — optionalAuth so the owner also sees private lists
// and solved marks.
router.get("/:slug", optionalAuth, controller.detail);

export default router;
