import { z } from "zod";

// Regex explanation:
// - (?=.*[A-Za-z])   → At least one letter
// - (?=.*\d)         → At least one digit
// - (?=.*[@$!%*?&#]) → At least one special character from this set
// - .{8,}            → Minimum 8 characters long
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const signInSchema = z.object({
  identifier: z.union([
    z.email("Please enter a valid email address").min(1, "Email is required"),
    usernameSchema,
  ]),

  password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  username: usernameSchema,
  password: z.string().regex(passwordRegex, {
    message:
      "Password must be at least 8 characters, include a letter, a number, and a special character.",
  }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
