import { z } from "zod";

export const toggleBookmarkSchema = z.object({
  problemId: z.string().min(1, "problemId is required."),
});
