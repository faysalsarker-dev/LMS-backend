"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMockTestSectionSchema = exports.createMockTestSectionSchema = void 0;
const zod_1 = require("zod");
exports.createMockTestSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        mockTest: zod_1.z.string({ required_error: "MockTest ID is required" }).regex(/^[0-9a-fA-F]{24}$/, "Invalid MockTest ID"),
        name: zod_1.z.enum(["listening", "reading", "writing", "speaking"], { required_error: "Section name is required" }),
        timeLimit: zod_1.z.number({ required_error: "Time limit is required" }).min(1, "Time limit must be at least 1 minute"),
        instruction: zod_1.z.string().optional(),
        questions: zod_1.z.array(zod_1.z.any()).optional().default([]), // More detailed validation for questions can be added
    })
});
exports.updateMockTestSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        mockTest: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MockTest ID").optional(),
        name: zod_1.z.enum(["listening", "reading", "writing", "speaking"]).optional(),
        timeLimit: zod_1.z.number().min(1).optional(),
        instruction: zod_1.z.string().optional(),
        questions: zod_1.z.array(zod_1.z.any()).optional(),
    })
});
