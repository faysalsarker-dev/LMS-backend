import { z } from "zod"


// 


export const iCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  instructor: z.string().min(1, "Instructor ID is required"),
  milestones: z.array(z.string()).optional(),
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

