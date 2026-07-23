import { z } from "zod";

const visibility = z.enum(["PRIVATE", "PUBLIC"]);

export const createListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give the list a name.")
    .max(60, "Keep the name under 60 characters."),
  description: z
    .string()
    .trim()
    .max(300, "Keep the description under 300 characters.")
    .optional(),
  visibility: visibility.optional(),
});

export const updateListSchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    description: z.string().trim().max(300).optional(),
    visibility: visibility.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "Nothing to update.",
  });

export const problemIdSchema = z.object({
  problemId: z.string().min(1, "problemId is required."),
});
