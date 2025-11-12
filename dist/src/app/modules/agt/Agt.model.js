"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const assignmentSubmissionSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lesson", required: true },
    submissionType: {
        type: String,
        enum: ["link", "text", "file"],
        default: "file",
        required: true,
    },
    file: {
        url: { type: String, required: function () { return this.submissionType === "file"; } },
    },
    textResponse: { type: String, default: null },
    submittedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["pending", "reviewed", "graded"],
        default: "pending",
    },
    result: { type: Number, default: null },
    feedback: { type: String, default: null },
}, { timestamps: true });
assignmentSubmissionSchema.index({ student: 1, course: 1, lesson: 1 }, { unique: true });
assignmentSubmissionSchema.index({ course: 1, lesson: 1 });
const AssignmentSubmission = (0, mongoose_1.model)("AssignmentSubmission", assignmentSubmissionSchema);
exports.default = AssignmentSubmission;
