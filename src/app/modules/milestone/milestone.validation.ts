import { z } from "zod";

export const createMilestoneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course: z.string().min(1, "Course ID is required"),
  order: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateMilestoneSchema = z.object({
  title: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
