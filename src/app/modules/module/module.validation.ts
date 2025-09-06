import { z } from "zod";

export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  milestone: z.string().min(1, "Milestone ID is required"),
  type: z.enum(["video", "quiz", "document", "note"]),
  videoUrl: z.string().optional(),
  documentUrl: z.string().optional(),
  notes: z.string().optional(),
  quiz: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateModuleSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["video", "quiz", "document", "note"]).optional(),
  videoUrl: z.string().optional(),
  documentUrl: z.string().optional(),
  notes: z.string().optional(),
  quiz: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
