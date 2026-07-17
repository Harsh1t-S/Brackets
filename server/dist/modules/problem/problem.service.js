"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProblem = exports.updateProblem = exports.getProblem = exports.getProblems = exports.createProblem = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const createProblem = async (data, createdById) => {
    return prisma_1.default.problem.create({
        data: {
            ...data,
            createdById,
        },
    });
};
exports.createProblem = createProblem;
const getProblems = async ({ page = 1, limit = 10, search, difficulty, tag, }) => {
    const where = {
        ...(search && {
            title: {
                contains: search,
                mode: "insensitive",
            },
        }),
        ...(difficulty && {
            difficulty: difficulty,
        }),
        ...(tag && {
            tags: {
                has: tag,
            },
        }),
    };
    const [problems, total] = await Promise.all([
        prisma_1.default.problem.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.default.problem.count({ where }),
    ]);
    return {
        problems,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getProblems = getProblems;
const getProblem = async (slug) => {
    return prisma_1.default.problem.findUnique({
        where: { slug },
    });
};
exports.getProblem = getProblem;
const updateProblem = async (id, data) => {
    return prisma_1.default.problem.update({
        where: { id },
        data,
    });
};
exports.updateProblem = updateProblem;
const deleteProblem = async (id) => {
    return prisma_1.default.problem.delete({
        where: { id },
    });
};
exports.deleteProblem = deleteProblem;
