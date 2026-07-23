import { z } from "zod";

// Emails are matched with `findUnique`, i.e. an exact, case-sensitive string
// compare. Without normalising, "Foo@Bar.com" and "foo@bar.com" register as
// two accounts, and a login whose casing differs from sign-up silently fails
// to find the row. Trim + lowercase on the way in so one address is one user.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters."),
  email,
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .optional(),
  // Small client-resized data-URI image, or null to remove it.
  avatar: z
    .string()
    .startsWith("data:image/", "Avatar must be an image.")
    .max(200_000, "Avatar image is too large.")
    .nullable()
    .optional(),
});