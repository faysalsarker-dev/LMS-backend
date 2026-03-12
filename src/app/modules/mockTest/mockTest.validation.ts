import { z } from "zod";

export const createMockTestSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(1, "Title cannot be empty"),
  course: z.string({ required_error: "Course ID is required" }).regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID"),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
});

export const updateMockTestSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID").optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});
