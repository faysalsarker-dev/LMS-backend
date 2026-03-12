"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMockTestSchema = exports.createMockTestSchema = void 0;
const zod_1 = require("zod");
exports.createMockTestSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Title is required" }).trim().min(1, "Title cannot be empty"),
    course: zod_1.z.string({ required_error: "Course ID is required" }).regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID"),
    status: zod_1.z.enum(["draft", "published", "archived"]).optional().default("draft"),
});
exports.updateMockTestSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title cannot be empty").optional(),
    course: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Course ID").optional(),
    status: zod_1.z.enum(["draft", "published", "archived"]).optional(),
});
