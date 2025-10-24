"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProgress = exports.markLessonAsComplete = void 0;
const ApiError_1 = require("../../errors/ApiError");
const Course_model_1 = __importDefault(require("../course/Course.model"));
const progress_model_1 = __importDefault(require("./progress.model"));
const markLessonAsComplete = async (studentId, courseId, lessonId) => {
    const course = await Course_model_1.default.findById(courseId).select("totalLectures");
    if (!course) {
        throw new ApiError_1.ApiError(404, "Course not found");
    }
    if (course.totalLectures === 0) {
        throw new ApiError_1.ApiError(400, "This course has no lessons to complete");
    }
    // 2. Find the student's progress document
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: courseId,
    });
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Student is not enrolled in this course");
    }
    // 3. Add the lesson to the completed list
    // We use $addToSet to prevent duplicate lesson IDs from being added.
    await progress.updateOne({ $addToSet: { completedLessons: lessonId } });
    // 4. Refetch the document to get the updated array length
    const updatedProgress = await progress_model_1.default.findById(progress._id);
    if (!updatedProgress) {
        throw new ApiError_1.ApiError(500, "Failed to update progress");
    }
    const totalLectures = course.totalLectures;
    const completedCount = updatedProgress.completedLessons.length;
    const percentage = Math.min((completedCount / totalLectures) * 100, 100);
    updatedProgress.progressPercentage = parseFloat(percentage.toFixed(2));
    if (completedCount >= totalLectures && !updatedProgress.isCompleted) {
        updatedProgress.isCompleted = true;
        updatedProgress.completedAt = new Date();
    }
    // Save the final updates
    await updatedProgress.save();
    return updatedProgress;
};
exports.markLessonAsComplete = markLessonAsComplete;
/**
 * Gets a student's progress for a specific course.
 */
const getStudentProgress = async (studentId, courseId) => {
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: courseId,
    }).populate("completedLessons", "_id");
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Progress not found for this student and course");
    }
    return progress;
};
exports.getStudentProgress = getStudentProgress;
