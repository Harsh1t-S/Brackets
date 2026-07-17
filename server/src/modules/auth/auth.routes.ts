import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "./auth.controller";
import { protect } from "./auth.middleware";
import { me } from "./auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, me);
export default router;