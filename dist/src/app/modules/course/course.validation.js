"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iCourseSchema = void 0;
const zod_1 = require("zod");
// 
exports.iCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    instructor: zod_1.z.string().min(1, "Instructor ID is required"),
    milestones: zod_1.z.array(zod_1.z.string()).optional(),
    image: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(["draft", "published", "archived"]).default("draft"),
});
