import { Types } from "mongoose"
import { z } from "zod"

export const iEnrollmentSchema = z.object({
  user: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for user"
  }),
  course: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for course"
  }),
  status: z.union([
    z.literal("active"),
    z.literal("completed"),
    z.literal("cancelled")
  ]),
  paymentStatus: z.union([
    z.literal("pending"),
    z.literal("paid"),
    z.literal("failed")
  ]),
  method: z.union([z.literal("alipay"), z.literal("wechat")]),
  enrolledAt: z.date(),
  completedAt: z.date().optional()
})
