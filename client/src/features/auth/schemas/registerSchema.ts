import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
