"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProblemService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AdminProblemService {
    async getAllProblems() {
        return prisma.problem.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async getProblemById(id) {
        return prisma.problem.findUnique({
            where: {
                id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async createProblem(data) {
        const existingProblem = await prisma.problem.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (existingProblem) {
            throw new Error("SLUG_ALREADY_EXISTS");
        }
        return prisma.problem.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                difficulty: data.difficulty,
                constraints: data.constraints,
                examples: data.examples,
                starterCode: data.starterCode,
                solutionCode: data.solutionCode,
                tags: data.tags,
                premium: data.premium ?? false,
                acceptance: data.acceptance ?? 0,
                createdById: data.createdById,
            },
        });
    }
    async updateProblem(id, data) {
        if (data.slug) {
            const existingProblem = await prisma.problem.findFirst({
                where: {
                    slug: data.slug,
                    NOT: {
                        id,
                    },
                },
            });
            if (existingProblem) {
                throw new Error("SLUG_ALREADY_EXISTS");
            }
        }
        return prisma.problem.update({
            where: {
                id,
            },
            data,
        });
    }
    async deleteProblem(id) {
        return prisma.problem.delete({
            where: {
                id,
            },
        });
    }
}
exports.AdminProblemService = AdminProblemService;
exports.default = new AdminProblemService();
