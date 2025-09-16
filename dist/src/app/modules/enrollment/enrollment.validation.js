"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iEnrollmentSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.iEnrollmentSchema = zod_1.z.object({
    user: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId for user"
    }),
    course: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId for course"
    }),
    status: zod_1.z.union([
        zod_1.z.literal("active"),
        zod_1.z.literal("completed"),
        zod_1.z.literal("cancelled")
    ]),
    paymentStatus: zod_1.z.union([
        zod_1.z.literal("pending"),
        zod_1.z.literal("paid"),
        zod_1.z.literal("failed")
    ]),
    method: zod_1.z.union([zod_1.z.literal("alipay"), zod_1.z.literal("wechat")]),
    enrolledAt: zod_1.z.date(),
    completedAt: zod_1.z.date().optional()
});
