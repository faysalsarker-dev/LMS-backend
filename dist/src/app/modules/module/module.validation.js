"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModuleSchema = exports.createModuleSchema = void 0;
const zod_1 = require("zod");
exports.createModuleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    milestone: zod_1.z.string().min(1, "Milestone ID is required"),
    type: zod_1.z.enum(["video", "quiz", "document", "note"]),
    videoUrl: zod_1.z.string().optional(),
    documentUrl: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    quiz: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
exports.updateModuleSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["video", "quiz", "document", "note"]).optional(),
    videoUrl: zod_1.z.string().optional(),
    documentUrl: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    quiz: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
