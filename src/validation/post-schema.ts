import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content must be at least 1 character long"),
  feelingEmoji: z.string().min(1, "Feeling emoji is required").optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
