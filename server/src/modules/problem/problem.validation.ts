import { z } from "zod";

export const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)], {
    message: "value must be 1 (like) or -1 (dislike).",
  }),
});
