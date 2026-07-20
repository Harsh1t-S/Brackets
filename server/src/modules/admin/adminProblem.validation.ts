import { z } from "zod";
import { Difficulty } from "@prisma/client";

export const createProblemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title cannot exceed 200 characters."),

  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may contain only lowercase letters, numbers and hyphens."
    ),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters."),

  difficulty: z.nativeEnum(Difficulty),

  constraints: z.string().optional(),

  examples: z.any(),

starterCode: z.any(),

solutionCode: z.any(),

  tags: z
    .array(z.string().trim().min(1))
    .min(1, "At least one tag is required.")
    .max(10, "Maximum 10 tags are allowed."),

  companies: z
    .array(z.string().trim().min(1))
    .max(15, "Maximum 15 companies are allowed.")
    .optional()
    .default([]),

  acceptance: z
    .number()
    .min(0, "Acceptance cannot be below 0.")
    .max(100, "Acceptance cannot exceed 100.")
    .default(0),

  testCases: z
    .array(
      z.object({
        input: z.string().trim().min(1),
        output: z.string().trim().min(1),
        isHidden: z.boolean().default(false),
      })
    )
    .optional(),
});

export const updateProblemSchema = createProblemSchema.partial();

export type CreateProblemInput = z.infer<typeof createProblemSchema>;

export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;