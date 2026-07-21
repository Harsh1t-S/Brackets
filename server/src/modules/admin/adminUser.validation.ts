import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"], { message: "Invalid role." }),
});
