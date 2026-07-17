import { Router } from "express";
import * as controller from "./bookmark.controller";
import { protect } from "../auth/auth.middleware";

const router = Router();

// Get all bookmarks of logged-in user
router.get("/", protect, controller.list);

// Toggle bookmark
router.post("/", protect, controller.toggle);

export default router;