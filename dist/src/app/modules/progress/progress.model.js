"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const progressSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lesson", required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
}, { timestamps: true });
progressSchema.index({ student: 1, lesson: 1 }, { unique: true });
const Progress = (0, mongoose_1.model)("Progress", progressSchema);
exports.default = Progress;
