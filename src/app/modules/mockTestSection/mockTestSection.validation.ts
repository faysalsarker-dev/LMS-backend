import { z } from "zod";

export const createMockTestSectionSchema = z.object({
  body: z.object({
    mockTest: z.string({ required_error: "MockTest ID is required" }).regex(/^[0-9a-fA-F]{24}$/, "Invalid MockTest ID"),
    name: z.enum(["listening", "reading", "writing", "speaking"], { required_error: "Section name is required" }),
    timeLimit: z.number({ required_error: "Time limit is required" }).min(1, "Time limit must be at least 1 minute"),
    instruction: z.string().optional(),
    questions: z.array(z.any()).optional().default([]), // More detailed validation for questions can be added
  })
});

export const updateMockTestSectionSchema = z.object({
  body: z.object({
    mockTest: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MockTest ID").optional(),
    name: z.enum(["listening", "reading", "writing", "speaking"]).optional(),
    timeLimit: z.number().min(1).optional(),
    instruction: z.string().optional(),
    questions: z.array(z.any()).optional(),
  })
});
