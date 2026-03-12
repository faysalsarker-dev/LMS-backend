"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmission = exports.getPendingSubmissions = exports.getStudentSubmissions = exports.submitMockTest = void 0;
const mongoose_1 = require("mongoose");
const mockTestSubmission_model_1 = __importDefault(require("./mockTestSubmission.model"));
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const submitMockTest = async (studentId, payload) => {
    let totalScore = 0;
    let allSectionsAutoGraded = true;
    const sectionsToStore = payload.sections.map((sec) => {
        totalScore += sec.autoGradedScore;
        if (!sec.isAutoGraded) {
            allSectionsAutoGraded = false;
        }
        return {
            sectionId: new mongoose_1.Types.ObjectId(sec.sectionId),
            studentAnswers: sec.studentAnswers,
            autoGradedScore: sec.autoGradedScore,
            adminScore: 0,
            isAutoGraded: sec.isAutoGraded,
        };
    });
    const status = allSectionsAutoGraded ? "graded" : "pending_review";
    const submission = await mockTestSubmission_model_1.default.create({
        student: new mongoose_1.Types.ObjectId(studentId),
        course: new mongoose_1.Types.ObjectId(payload.course),
        mockTest: new mongoose_1.Types.ObjectId(payload.mockTest),
        sections: sectionsToStore,
        totalScore,
        status,
    });
    // Update Progress array
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: payload.course,
    });
    if (progress) {
        if (!progress.mockTestSubmissions) {
            progress.mockTestSubmissions = [];
        }
        if (!progress.mockTestSubmissions.includes(submission._id)) {
            progress.mockTestSubmissions.push(submission._id);
        }
        await progress.save();
        // If perfectly graded immediately, we can trigger an update
        if (status === "graded" && typeof progress.updateWithMockTest === "function") {
            await progress.updateWithMockTest();
        }
    }
    return submission;
};
exports.submitMockTest = submitMockTest;
const getStudentSubmissions = async (studentId, courseId) => {
    return await mockTestSubmission_model_1.default.find({
        student: studentId,
        course: courseId,
    })
        .populate("mockTest")
        .populate("sections.sectionId");
};
exports.getStudentSubmissions = getStudentSubmissions;
const getPendingSubmissions = async () => {
    return await mockTestSubmission_model_1.default.find({ status: "pending_review" })
        .populate("student", "name email")
        .populate("course", "title")
        .populate("mockTest", "title")
        .populate("sections.sectionId", "name type");
};
exports.getPendingSubmissions = getPendingSubmissions;
const gradeSubmission = async (submissionId, adminGrades) => {
    const submission = await mockTestSubmission_model_1.default.findById(submissionId);
    if (!submission) {
        throw new Error("Submission not found");
    }
    let totalAdminScore = 0;
    let totalAutoScore = 0;
    submission.sections.forEach((section) => {
        // If it's a manual section, see if admin provided a grade
        if (!section.isAutoGraded) {
            const gradeInput = adminGrades.find((g) => g.sectionId === section.sectionId.toString());
            if (gradeInput) {
                section.adminScore = gradeInput.score;
                section.adminFeedback = gradeInput.feedback;
            }
            totalAdminScore += section.adminScore || 0;
        }
        totalAutoScore += section.autoGradedScore || 0;
    });
    // Assume if grade is called, admin provides grades for all manual sections
    submission.totalScore = totalAutoScore + totalAdminScore;
    submission.status = "graded";
    await submission.save();
    // Try updating Progress
    const progress = await progress_model_1.default.findOne({
        student: submission.student,
        course: submission.course,
    });
    if (progress && typeof progress.updateWithMockTest === "function") {
        await progress.updateWithMockTest();
    }
    return submission;
};
exports.gradeSubmission = gradeSubmission;
