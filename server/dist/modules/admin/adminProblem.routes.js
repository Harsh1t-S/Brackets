"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminProblem_controller_1 = __importDefault(require("./adminProblem.controller"));
const admin_middleware_1 = require("../../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.use(admin_middleware_1.protect);
router.use(admin_middleware_1.adminOnly);
router.get("/problems", adminProblem_controller_1.default.getAllProblems);
router.get("/problems/:id", adminProblem_controller_1.default.getProblemById);
router.post("/problems", adminProblem_controller_1.default.createProblem);
router.put("/problems/:id", adminProblem_controller_1.default.updateProblem);
router.delete("/problems/:id", adminProblem_controller_1.default.deleteProblem);
exports.default = router;
