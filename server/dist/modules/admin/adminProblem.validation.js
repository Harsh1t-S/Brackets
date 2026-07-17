"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProblemSchema = exports.createProblemSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createProblemSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters.")
        .max(200, "Title cannot exceed 200 characters."),
    slug: zod_1.z
        .string()
        .trim()
        .regex(/^[a-z0-9-]+$/, "Slug may contain only lowercase letters, numbers and hyphens."),
    description: zod_1.z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters."),
    difficulty: zod_1.z.nativeEnum(client_1.Difficulty),
    constraints: zod_1.z.string().optional(),
    examples: zod_1.z.any(),
    starterCode: zod_1.z.any(),
    solutionCode: zod_1.z.any(),
    tags: zod_1.z
        .array(zod_1.z.string().trim().min(1))
        .min(1, "At least one tag is required.")
        .max(10, "Maximum 10 tags are allowed."),
    premium: zod_1.z.boolean().default(false),
    acceptance: zod_1.z
        .number()
        .min(0, "Acceptance cannot be below 0.")
        .max(100, "Acceptance cannot exceed 100.")
        .default(0),
});
exports.updateProblemSchema = exports.createProblemSchema.partial();
