"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mockTestSectionSubmissionSchema = new mongoose_1.Schema({
    sectionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "MockTestSection", required: true },
    studentAnswers: { type: String, default: "" },
    autoGradedScore: { type: Number, default: 0 },
    adminScore: { type: Number, default: 0 },
    adminFeedback: { type: String },
    isAutoGraded: { type: Boolean, default: false },
}, { _id: false });
const mockTestSubmissionSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    mockTest: { type: mongoose_1.Schema.Types.ObjectId, ref: "MockTest", required: true },
    sections: { type: [mockTestSectionSubmissionSchema], default: [] },
    totalScore: { type: Number, default: 0 },
    status: { type: String, enum: ["pending_review", "graded"], default: "pending_review" },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const MockTestSubmission = (0, mongoose_1.model)("MockTestSubmission", mockTestSubmissionSchema);
exports.default = MockTestSubmission;
