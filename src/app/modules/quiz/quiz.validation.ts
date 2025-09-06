import { Types } from "mongoose"
import { z } from "zod"

export const iQuizOptionSchema = z.object({
  label: z.string(),
  text: z.string()
})

export const iQuizSchema = z.object({
  question: z.string(),
  options: z.array(iQuizOptionSchema),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  module: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId"
  }),
  timer: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})
