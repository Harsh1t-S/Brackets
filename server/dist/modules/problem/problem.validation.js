"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProblemSchema = void 0;
const zod_1 = require("zod");
exports.createProblemSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    slug: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    difficulty: zod_1.z.enum([
        "EASY",
        "MEDIUM",
        "HARD",
    ]),
    constraints: zod_1.z.string().optional(),
    examples: zod_1.z.any(),
    starterCode: zod_1.z.any(),
    solutionCode: zod_1.z.any(),
    tags: zod_1.z.array(zod_1.z.string())
});
