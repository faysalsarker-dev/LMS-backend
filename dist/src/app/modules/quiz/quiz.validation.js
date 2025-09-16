"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iQuizSchema = exports.iQuizOptionSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.iQuizOptionSchema = zod_1.z.object({
    label: zod_1.z.string(),
    text: zod_1.z.string()
});
exports.iQuizSchema = zod_1.z.object({
    question: zod_1.z.string(),
    options: zod_1.z.array(exports.iQuizOptionSchema),
    correctAnswer: zod_1.z.string(),
    explanation: zod_1.z.string().optional(),
    module: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId"
    }),
    timer: zod_1.z.number().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional()
});
