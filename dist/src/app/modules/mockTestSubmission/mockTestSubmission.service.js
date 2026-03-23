"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockTestProgress = exports.gradeSubmission = exports.getSubmissionById = exports.getPendingSubmissions = exports.getStudentSubmissions = exports.submitMockTest = void 0;
const mongoose_1 = require("mongoose");
const mockTestSubmission_model_1 = __importDefault(require("./mockTestSubmission.model"));
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
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
            // Handle studentAnswers: if it's an object (mapping ID to answer), convert to the new array format
            let studentAnswersArray = incoming.studentAnswers;
            if (incoming.studentAnswers &&
                typeof incoming.studentAnswers === "object" &&
                !Array.isArray(incoming.studentAnswers)) {
                // If it's a map (and not the special speaking {audioUrl} case if sent directly)
                if (!("audioUrl" in incoming.studentAnswers)) {
                    studentAnswersArray = Object.entries(incoming.studentAnswers).map(([questionId, answer]) => ({
                        questionId,
                        answer: answer,
                    }));
                }
                else {
                    // It's the speaking special case {audioUrl: "..."}
                    // We'll treat it as an answer for the sectionId if no questionId is involved
                    // But ideally the controller should have fixed this already.
                    studentAnswersArray = [
                        {
                            questionId: incoming.sectionId,
                            answer: incoming.studentAnswers.audioUrl,
                        },
                    ];
                }
            }
            const sectionData = {
                sectionId: new mongoose_1.Types.ObjectId(incoming.sectionId),
                studentAnswers: studentAnswersArray,
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
        if (!progress.mockTestSubmissions.some((id) => id.toString() === subId.toString())) {
            progress.mockTestSubmissions.push(subId);
        }
        await progress.save();
        // If completely graded, trigger progress update
        if (submission.status === "graded" &&
            typeof progress.updateWithMockTest === "function") {
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
const getPendingSubmissions = async (query) => {
    const baseQuery = { status: "pending_review" };
    const submissionQuery = new QueryBuilder_1.default(mockTestSubmission_model_1.default.find(baseQuery)
        .populate("student", "name email")
        .populate("course", "title")
        .populate("mockTest", "title")
        .populate("sections.sectionId", "name type"), query)
        .filter()
        .sort()
        .paginate();
    const result = await submissionQuery.modelQuery;
    const meta = await submissionQuery.countTotal();
    return { meta, result };
};
exports.getPendingSubmissions = getPendingSubmissions;
const getSubmissionById = async (submissionId) => {
    const submission = await mockTestSubmission_model_1.default.findById(submissionId)
        .populate("student", "name email phone")
        .populate("course", "title description")
        .populate("mockTest", "title type")
        .populate("sections.sectionId")
        .lean(); // Use lean for easier transformation
    if (!submission) {
        throw new Error("Submission not found");
    }
    // Transform sections to include full question data paired with user answers
    const transformedSections = submission.sections.map((section) => {
        const sectionData = section.sectionId;
        if (!sectionData || !sectionData.questions)
            return section;
        // studentAnswers is now an array: [{ questionId, answer }]
        const studentAnswers = section.studentAnswers || [];
        // Create a map for quick lookup from the current array format
        const answerMap = new Map();
        studentAnswers.forEach((ans) => {
            if (ans.questionId) {
                answerMap.set(ans.questionId.toString(), ans.answer);
            }
        });
        // Map through the original questions from the section and attach the user's answer
        const questionsWithAnswers = sectionData.questions.map((question) => {
            const qId = question._id.toString();
            return {
                ...question,
                userAnswer: answerMap.get(qId) || null,
            };
        });
        return {
            ...section,
            questionsWithAnswers, // This is the combined view the admin needs
        };
    });
    return {
        ...submission,
        sections: transformedSections,
    };
};
exports.getSubmissionById = getSubmissionById;
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
            const sectionName = sec.sectionId?.name;
            if (sectionName && sectionName in progress) {
                progress[sectionName] = "submitted";
            }
        });
    }
    return progress;
};
exports.getMockTestProgress = getMockTestProgress;
