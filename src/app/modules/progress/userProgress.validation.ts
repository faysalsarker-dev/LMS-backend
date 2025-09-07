import { z } from "zod";

const ModuleProgressSchema = z.object({
  module: z.string(),
  videosCompleted: z.array(z.string()).optional(),
  notesCompleted: z.array(z.string()).optional(),
  docsCompleted: z.array(z.string()).optional(),
  quizzesCompleted: z.array(z.string()).optional(),
});

const MilestoneProgressSchema = z.object({
  milestone: z.string(),
  modules: z.array(ModuleProgressSchema).optional(),
});

export const createUserProgressSchema = z.object({
  user: z.string(),
  course: z.string(),
  milestones: z.array(MilestoneProgressSchema).optional(),
});
