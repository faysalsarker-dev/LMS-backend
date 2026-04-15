"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificateSvg = exports.getStudentProgress = exports.markQuizAsComplete = exports.markLessonAsComplete = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const ApiError_1 = require("../../errors/ApiError");
const Course_model_1 = __importDefault(require("../course/Course.model"));
const progress_model_1 = __importDefault(require("./progress.model"));
const CERTIFICATE_TEMPLATE_PATH = path_1.default.resolve(process.cwd(), "src/app/certificates/Certificate.svg");
const escapeXml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
const updateProgressPercentage = async (progress, courseId) => {
    const course = await Course_model_1.default.findById(courseId).select("totalLectures");
    if (!course) {
        throw new ApiError_1.ApiError(404, "Course not found");
    }
    if (course.totalLectures > 0) {
        const completedCount = progress.completedLessons.length;
        const percentage = Math.min((completedCount / course.totalLectures) * 100, 100);
        progress.progressPercentage = parseFloat(percentage.toFixed(2));
        if (completedCount >= course.totalLectures && !progress.isCompleted) {
            progress.isCompleted = true;
            progress.completedAt = new Date();
            await progress.generateCertificate("Congratulations on completing the course!");
        }
    }
};
const markLessonAsComplete = async (studentId, courseId, lessonId) => {
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: courseId,
    });
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Student is not enrolled in this course");
    }
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
    if (!passed) {
        throw new ApiError_1.ApiError(400, "Quiz not complete. Cannot mark lesson as complete.");
    }
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
    return progress;
};
exports.markQuizAsComplete = markQuizAsComplete;
const getStudentProgress = async (studentId, courseId) => {
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
            select: "title assignment"
        }
    })
        .populate({
        path: "mockTestSubmissions",
        select: "totalScore sections status submittedAt totalMarks",
    });
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Progress not found for this student and course");
    }
    const course = await Course_model_1.default.findById(courseId).select("totalLectures").lean();
    if (!course) {
        throw new ApiError_1.ApiError(404, "Course not found");
    }
    const totalQuizzes = progress.quizResults.length;
    const passedCount = progress.quizResults.filter(q => q.passed === true).length;
    const failedCount = totalQuizzes - passedCount;
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
        },
        mockTestStats: {
            submissions: progress.mockTestSubmissions.map((sub) => ({
                status: sub.status,
                totalScore: sub.totalScore,
                submittedAt: sub.submittedAt,
                sections: sub.sections.map((section) => ({
                    autoGradedScore: section.autoGradedScore,
                    adminScore: section.adminScore,
                    adminFeedback: section.adminFeedback,
                    isAutoGraded: section.isAutoGraded,
                    name: section.name,
                    totalMarks: section.totalMarks,
                })),
            })),
        },
    };
};
exports.getStudentProgress = getStudentProgress;
const generateCertificateSvg = async (studentId, courseId) => {
    const progress = await progress_model_1.default.findOne({
        student: new mongoose_1.Types.ObjectId(studentId),
        course: new mongoose_1.Types.ObjectId(courseId),
    }).select("isCompleted certificates");
    if (!progress) {
        throw new ApiError_1.ApiError(404, "Progress not found");
    }
    if (!progress.isCompleted) {
        throw new ApiError_1.ApiError(400, "Course is not completed yet");
    }
    if (!progress.certificates?.name ||
        !progress.certificates?.title ||
        !progress.certificates?.description ||
        !progress.certificates?.issuedAt) {
        throw new ApiError_1.ApiError(400, "Certificate data not found in progress");
    }
    const template = await promises_1.default.readFile(CERTIFICATE_TEMPLATE_PATH, "utf-8");
    return template
        .replace(/\{\{student_name\}\}/g, escapeXml(progress.certificates.name))
        .replace(/\{\{course_title\}\}/g, escapeXml(progress.certificates.title))
        .replace(/\{\{course_description\}\}/g, escapeXml(progress.certificates.description));
};
exports.generateCertificateSvg = generateCertificateSvg;
