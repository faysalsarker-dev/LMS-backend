"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockTestProgress = exports.gradeSubmission = exports.getPendingSubmissions = exports.getStudentSubmissions = exports.submitMockTest = void 0;
const mongoose_1 = require("mongoose");
const mockTestSubmission_model_1 = __importDefault(require("./mockTestSubmission.model"));
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const submitMockTest = async (studentId, payload) => {
    // 1. Find existing submission for this student, course, and mock test
    let submission = await mockTestSubmission_model_1.default.findOne({
        student: studentId,
        course: payload.course,
        mockTest: payload.mockTest,
    });
    const incomingSections = payload.sections;
    if (!submission) {
        // Initial submission
        const sectionsToStore = incomingSections.map((sec) => ({
            sectionId: new mongoose_1.Types.ObjectId(sec.sectionId),
            studentAnswers: sec.studentAnswers,
            autoGradedScore: sec.isAutoGraded ? sec.score : 0,
            adminScore: 0,
            isAutoGraded: sec.isAutoGraded,
        }));
        submission = await mockTestSubmission_model_1.default.create({
            student: new mongoose_1.Types.ObjectId(studentId),
            course: new mongoose_1.Types.ObjectId(payload.course),
            mockTest: new mongoose_1.Types.ObjectId(payload.mockTest),
            sections: sectionsToStore,
            totalScore: 0, // Will calculate below
            status: "pending_review",
        });
    }
    else {
        // Update existing submission with new or updated sections
        incomingSections.forEach((incoming) => {
            const existingSecIndex = submission.sections.findIndex((s) => s.sectionId.toString() === incoming.sectionId);
            const sectionData = {
                sectionId: new mongoose_1.Types.ObjectId(incoming.sectionId),
                studentAnswers: incoming.studentAnswers,
                autoGradedScore: incoming.isAutoGraded ? incoming.score : 0,
                adminScore: 0,
                isAutoGraded: incoming.isAutoGraded,
            };
            if (existingSecIndex > -1) {
                submission.sections[existingSecIndex] = sectionData;
            }
            else {
                submission.sections.push(sectionData);
            }
        });
    }
    // 2. Recalculate totalScore and Status based on all currently saved sections
    let totalScore = 0;
    let allSectionsGraded = true;
    submission.sections.forEach((sec) => {
        if (sec.isAutoGraded) {
            totalScore += sec.autoGradedScore || 0;
        }
        else {
            // Manual section: check if it has been graded by admin yet
            if (sec.adminScore > 0) {
                totalScore += sec.adminScore;
            }
            else {
                allSectionsGraded = false;
            }
        }
    });
    submission.totalScore = totalScore;
    submission.status = allSectionsGraded ? "graded" : "pending_review";
    await submission.save();
    // 3. Update Progress array if not already present
    const progress = await progress_model_1.default.findOne({
        student: studentId,
        course: payload.course,
    });
    if (progress) {
        if (!progress.mockTestSubmissions) {
            progress.mockTestSubmissions = [];
        }
        const subId = submission._id;
        if (!progress.mockTestSubmissions.some(id => id.toString() === subId.toString())) {
            progress.mockTestSubmissions.push(subId);
        }
        await progress.save();
        // If completely graded, trigger progress update
        if (submission.status === "graded" && typeof progress.updateWithMockTest === "function") {
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
const getMockTestProgress = async (studentId, mockTestId) => {
    const submission = await mockTestSubmission_model_1.default.findOne({
        student: studentId,
        mockTest: mockTestId,
    }).populate("sections.sectionId");
    const progress = {
        listening: "locked",
        reading: "locked",
        speaking: "locked",
        writing: "locked",
    };
    if (submission) {
        submission.sections.forEach((sec) => {
            const sectionName = sec.sectionId?.name; // assuming population worked and MockTestSection has name
            if (sectionName && sectionName in progress) {
                progress[sectionName] = "submitted";
            }
        });
    }
    return progress;
};
exports.getMockTestProgress = getMockTestProgress;
