"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProgress = exports.markLessonIncomplete = exports.markLessonComplete = void 0;
const progress_model_1 = __importDefault(require("./progress.model"));
// Mark lesson as complete
const markLessonComplete = async (studentId, lessonId) => {
    const progress = await progress_model_1.default.findOneAndUpdate({ student: studentId, lesson: lessonId }, { isCompleted: true, completedAt: new Date() }, { new: true, upsert: true });
    return progress;
};
exports.markLessonComplete = markLessonComplete;
// Mark lesson as incomplete
const markLessonIncomplete = async (studentId, lessonId) => {
    const progress = await progress_model_1.default.findOneAndUpdate({ student: studentId, lesson: lessonId }, { isCompleted: false, completedAt: null }, { new: true });
    return progress;
};
exports.markLessonIncomplete = markLessonIncomplete;
// Get all lessons progress for a student
const getStudentProgress = async (studentId) => {
    const progressList = await progress_model_1.default.find({ student: studentId });
    return progressList;
};
exports.getStudentProgress = getStudentProgress;
