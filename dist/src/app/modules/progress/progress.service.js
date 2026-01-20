"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProgress = exports.markQuizAsComplete = exports.markLessonAsComplete = void 0;
const mongoose_1 = require("mongoose");
const ApiError_1 = require("../../errors/ApiError");
const Course_model_1 = __importDefault(require("../course/Course.model"));
const progress_model_1 = __importDefault(require("./progress.model"));
const updateProgressPercentage = async (progress, courseId) => {
    const course = await Course_model_1.default.findById(courseId).select("totalLectures");
    if (!course) {
        throw new ApiError_1.ApiError(404, "Course not found");
    }
    if (course.totalLectures > 0) {
        const completedCount = progress.completedLessons.length;
        const percentage = Math.min((completedCount / course.totalLectures) * 100, 100);
        progress.progressPercentage = parseFloat(percentage.toFixed(2));
        // Check if course is completed
        if (completedCount >= course.totalLectures && !progress.isCompleted) {
            progress.isCompleted = true;
            progress.completedAt = new Date();
        }
    }
};
// export const markLessonAsComplete = async (
//   studentId: string,
//   courseId: string,
//   lessonId: string,
// ): Promise<IProgress> => {
//   // 2. Find the student's progress document
//   const progress = await Progress.findOne({
//     student: studentId,
//     course: courseId,
//   });
//   if (!progress) {
//     throw new ApiError(404,"Student is not enrolled in this course");
//   }
//   // 3. Add the lesson to the completed list
//   // We use $addToSet to prevent duplicate lesson IDs from being added.
//   await progress.updateOne({ $addToSet: { completedLessons: lessonId } });
//   // 4. Refetch the document to get the updated array length
//   const updatedProgress = await Progress.findById(progress._id);
//   if (!updatedProgress) {
//     throw new ApiError(500,"Failed to update progress");
//   }
// // Instead of updateOne then refetch, you could:
//    if (!progress.completedLessons.some((l) => l.toString() === lessonId)) {
//      progress.completedLessons.push(lessonId as any);
//    }
//    await updateProgressPercentage(progress, courseId);
//    await progress.save();
//   return updatedProgress;
// };
const markLessonAsComplete = async (studentId, courseId, lessonId) => {
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: courseId,
    });
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Student is not enrolled in this course");
    }
    // Add lesson if not already completed
    if (!progress.completedLessons.some((l) => l.toString() === lessonId)) {
        progress.completedLessons.push(lessonId);
    }
    await updateProgressPercentage(progress, courseId);
    await progress.save();
    return progress;
};
exports.markLessonAsComplete = markLessonAsComplete;
const markQuizAsComplete = async (studentId, courseId, lessonId, passed) => {
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: courseId,
    });
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Student is not enrolled in this course");
    }
    // Check if quiz result already exists
    const existingIndex = progress.quizResults.findIndex((qr) => qr.lesson.toString() === lessonId);
    const result = {
        lesson: lessonId,
        passed,
        attemptedAt: new Date(),
    };
    if (existingIndex >= 0) {
        progress.quizResults[existingIndex] = result;
    }
    else {
        progress.quizResults.push(result);
    }
    if (!progress.completedLessons.some((l) => l.toString() === lessonId)) {
        progress.completedLessons.push(lessonId);
    }
    await updateProgressPercentage(progress, courseId);
    await progress.save();
    console.log(progress, 'progress');
    return progress;
};
exports.markQuizAsComplete = markQuizAsComplete;
/**
 * Gets a student's progress for a specific course.
 */
// export const getStudentProgress = async (
//   studentId: string,
//   courseId: string
// ): Promise<any> => {
//   const progress = await Progress.findOne({
//     student: new Types.ObjectId(studentId),
//     course: new Types.ObjectId(courseId),
//   })
//     .populate("completedLessons", "_id title")
//     .populate({
//       path: "assignmentSubmissions",
//       select: "lesson result feedback status submittedAt",
//       populate: { path: "lesson", select: "title" }
//     });
//   if (!progress) {
//     throw new ApiError(404, "Progress not found for this student and course");
//   }
//   // 2. Calculate Quiz Statistics
//   const totalQuizzes = progress.quizResults.length;
//   const passedCount = progress.quizResults.filter(q => q.passed === true).length;
//   const failedCount = totalQuizzes - passedCount;
//   // 3. Transform data for the Student Overview
//   return {
//     overview: {
//       progressPercentage: progress.progressPercentage,
//       isCompleted: progress.isCompleted,
//       completedAt: progress.completedAt,
//       totalLessonsCompleted: progress.completedLessons.length,
//     },
//     quizStats: {
//       totalAttempted: totalQuizzes,
//       passed: passedCount,
//       failed: failedCount,
//     },
//     assignmentStats: {
//       avgMarks: progress.avgMarks,
//       submissions: progress.assignmentSubmissions.map((sub: any) => ({
//         lessonName: sub.lesson?.title || "Assignment",
//         status: sub.status,
//         marks: sub.result,
//         feedback: sub.feedback,
//         submittedAt: sub.submittedAt
//       }))
//     }
//   };
// };
const getStudentProgress = async (studentId, courseId) => {
    // Fetch progress with populated data
    const progress = await progress_model_1.default.findOne({
        student: new mongoose_1.Types.ObjectId(studentId),
        course: new mongoose_1.Types.ObjectId(courseId),
    })
        .populate("completedLessons", "_id title")
        .populate({
        path: "assignmentSubmissions",
        select: "lesson result feedback status submittedAt",
        populate: {
            path: "lesson",
            select: "title assignment" // Add assignment field to get maxMarks
        }
    });
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Progress not found for this student and course");
    }
    const course = await Course_model_1.default.findById(courseId).select("totalLectures").lean();
    if (!course) {
        throw new ApiError_1.ApiError(404, "Course not found");
    }
    // Calculate Quiz Statistics
    const totalQuizzes = progress.quizResults.length;
    const passedCount = progress.quizResults.filter(q => q.passed === true).length;
    const failedCount = totalQuizzes - passedCount;
    // Transform data for the Student Overview
    return {
        overview: {
            progressPercentage: progress.progressPercentage,
            isCompleted: progress.isCompleted,
            completedAt: progress.completedAt,
            totalLessonsCompleted: progress.completedLessons.length,
            totalLessons: course.totalLectures,
        },
        quizStats: {
            totalAttempted: totalQuizzes,
            passed: passedCount,
            failed: failedCount,
        },
        assignmentStats: {
            avgMarks: progress.avgMarks,
            submissions: progress.assignmentSubmissions.map((sub) => ({
                lessonName: sub.lesson?.title || "Assignment",
                status: sub.status,
                marks: sub.result,
                maxMarks: sub.lesson?.assignment?.maxMarks || null,
                feedback: sub.feedback,
                date: sub.submittedAt
            }))
        }
    };
};
exports.getStudentProgress = getStudentProgress;
