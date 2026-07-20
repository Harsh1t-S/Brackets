import { Router } from "express";
import {
  registerUser,
  loginUser,
  me,
  updateMe,
} from "./auth.controller";
import { protect } from "./auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, me);
router.patch("/me", protect, updateMe);
export default router;
