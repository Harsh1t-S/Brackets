"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.details = exports.list = exports.create = void 0;
const problem_service_1 = require("./problem.service");
const create = async (req, res) => {
    try {
        const problem = await (0, problem_service_1.createProblem)(req.body, req.user?.id);
        res.status(201).json({
            success: true,
            data: problem,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create problem.",
        });
    }
};
exports.create = create;
const list = async (req, res) => {
    try {
        const { page, limit, search, difficulty, tag, } = req.query;
        const result = await (0, problem_service_1.getProblems)({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search: search,
            difficulty: difficulty,
            tag: tag,
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch problems.",
        });
    }
};
exports.list = list;
const details = async (req, res) => {
    try {
        const problem = await (0, problem_service_1.getProblem)(req.params.slug);
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
};
exports.details = details;
const update = async (req, res) => {
    try {
        const problem = await (0, problem_service_1.updateProblem)(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: problem,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update problem.",
        });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await (0, problem_service_1.deleteProblem)(req.params.id);
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
};
exports.remove = remove;
