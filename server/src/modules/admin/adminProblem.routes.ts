import { Router } from "express";
import controller from "./adminProblem.controller";
import { protect, adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/problems", controller.getAllProblems);

router.get("/problems/:id", controller.getProblemById);

router.post("/problems", controller.createProblem);

router.put("/problems/:id", controller.updateProblem);

router.delete("/problems/:id", controller.deleteProblem);

export default router;