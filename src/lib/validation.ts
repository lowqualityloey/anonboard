import { z } from "zod";

export const createThreadSchema = z.object({
  boardId: z.string().min(1, "Board is required"),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or fewer"),
  body: z
    .string()
    .trim()
    .min(10, "Body must be at least 10 characters")
    .max(5000, "Body must be 5000 characters or fewer"),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;
