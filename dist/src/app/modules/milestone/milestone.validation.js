"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMilestoneSchema = exports.createMilestoneSchema = void 0;
const zod_1 = require("zod");
exports.createMilestoneSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    course: zod_1.z.string().min(1, "Course ID is required"),
    order: zod_1.z.number().optional(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
exports.updateMilestoneSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
