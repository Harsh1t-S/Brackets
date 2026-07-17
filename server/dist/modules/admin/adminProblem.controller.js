"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProblemController = void 0;
const adminProblem_service_1 = __importDefault(require("./adminProblem.service"));
const adminProblem_validation_1 = require("./adminProblem.validation");
class AdminProblemController {
    async getAllProblems(req, res) {
        try {
            const problems = await adminProblem_service_1.default.getAllProblems();
            res.status(200).json({
                success: true,
                data: problems,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch problems.",
            });
        }
    }
    async getProblemById(req, res) {
        try {
            const { id } = req.params;
            const problem = await adminProblem_service_1.default.getProblemById(id);
            if (!problem) {
                res.status(404).json({
                    success: false,
                    message: "Problem not found.",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: problem,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch problem.",
            });
        }
    }
    async createProblem(req, res) {
        try {
            const parsed = adminProblem_validation_1.createProblemSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed.",
                    errors: parsed.error.flatten().fieldErrors,
                });
                return;
            }
            const problem = await adminProblem_service_1.default.createProblem({
                ...parsed.data,
                createdById: req.user?.id,
            });
            res.status(201).json({
                success: true,
                message: "Problem created successfully.",
                data: problem,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error &&
                error.message === "SLUG_ALREADY_EXISTS") {
                res.status(409).json({
                    success: false,
                    message: "A problem with this slug already exists.",
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Failed to create problem.",
            });
        }
    }
    async updateProblem(req, res) {
        try {
            const { id } = req.params;
            const parsed = adminProblem_validation_1.updateProblemSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed.",
                    errors: parsed.error.flatten().fieldErrors,
                });
                return;
            }
            const updated = await adminProblem_service_1.default.updateProblem(id, parsed.data);
            res.status(200).json({
                success: true,
                message: "Problem updated successfully.",
                data: updated,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error &&
                error.message === "SLUG_ALREADY_EXISTS") {
                res.status(409).json({
                    success: false,
                    message: "A problem with this slug already exists.",
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Failed to update problem.",
            });
        }
    }
    async deleteProblem(req, res) {
        try {
            const { id } = req.params;
            await adminProblem_service_1.default.deleteProblem(id);
            res.status(200).json({
                success: true,
                message: "Problem deleted successfully.",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to delete problem.",
            });
        }
    }
}
exports.AdminProblemController = AdminProblemController;
exports.default = new AdminProblemController();
