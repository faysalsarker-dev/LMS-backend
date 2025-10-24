"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const progressSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    completedLessons: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Lesson",
        },
    ],
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
progressSchema.index({ student: 1, course: 1 }, { unique: true });
progressSchema.methods.addCompletedLesson = async function (lessonId) {
    if (!this.completedLessons.some((l) => l.toString() === lessonId)) {
        this.completedLessons.push(lessonId);
        await this.save();
    }
    return this;
};
const Progress = (0, mongoose_1.model)("Progress", progressSchema);
exports.default = Progress;
