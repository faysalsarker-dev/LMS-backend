"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Agt_model_1 = __importDefault(require("../agt/Agt.model"));
const User_model_1 = __importDefault(require("../auth/User.model"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
const mongoose_1 = require("mongoose");
const quizResultSchema = new mongoose_1.Schema({
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lesson", required: true },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now },
}, { _id: false });
const progressSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Lesson" }],
    assignmentSubmissions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "AssignmentSubmission" }],
    mockTestSubmissions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "MockTestSubmission" }],
    avgMarks: { type: Number, default: 0 },
    quizResults: { type: [quizResultSchema], default: [] },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    certificates: {
        name: { type: String, default: null },
        title: { type: String, default: null },
        description: { type: String, default: null },
        issuedAt: { type: Date, default: null },
    },
}, { timestamps: true });
progressSchema.index({ student: 1, course: 1 }, { unique: true });
// ---------------------------
// Add completed lesson
// ---------------------------
progressSchema.methods.addCompletedLesson = async function (lessonId) {
    if (!this.completedLessons.some((l) => l.toString() === lessonId)) {
        this.completedLessons.push(lessonId);
        await this.save();
    }
    return this;
};
// ---------------------------
// Update progress with assignment submission
// ---------------------------
progressSchema.methods.updateWithAssignment = async function (submissionId) {
    if (!this.assignmentSubmissions.includes(submissionId)) {
        this.assignmentSubmissions.push(submissionId);
    }
    const submissions = await Agt_model_1.default.find({
        _id: { $in: this.assignmentSubmissions },
        status: "graded",
    });
    if (submissions.length) {
        const totalMarks = submissions.reduce((sum, s) => sum + (s.result || 0), 0);
        this.avgMarks = totalMarks / submissions.length;
    }
    const totalItems = this.completedLessons.length + this.assignmentSubmissions.length;
    this.progressPercentage = Math.min(100, totalItems);
    if (this.progressPercentage >= 100) {
        this.isCompleted = true;
    }
    await this.save();
    return this;
};
progressSchema.methods.recalculateFromSubmissions = async function () {
    const submissions = await Agt_model_1.default.find({
        _id: { $in: this.assignmentSubmissions },
        status: "graded",
    });
    if (submissions.length) {
        const total = submissions.reduce((sum, s) => sum + (s.result || 0), 0);
        this.avgMarks = total / submissions.length;
    }
    else {
        this.avgMarks = 0;
    }
    await this.save();
};
// ---------------------------
// Update progress with mock test submission
// ---------------------------
progressSchema.methods.updateWithMockTest = async function () {
    const MockTestSubmission = (0, mongoose_1.model)("MockTestSubmission");
    const submissions = await MockTestSubmission.find({
        _id: { $in: this.mockTestSubmissions },
        status: "graded",
    });
    if (submissions.length) {
        const totalMockTestScore = submissions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
        const avgMockTestScore = totalMockTestScore / submissions.length;
        this.avgMarks = (this.avgMarks + avgMockTestScore) / 2;
    }
    await this.save();
    return this;
};
// ---------------------------
// Store certificate snapshot
// ---------------------------
progressSchema.methods.generateCertificate = async function (description) {
    const [student, course] = await Promise.all([
        User_model_1.default.findById(this.student).select("name"),
        Course_model_1.default.findById(this.course).select("title"),
    ]);
    if (!student) {
        throw new Error("Student not found");
    }
    if (!course) {
        throw new Error("Course not found");
    }
    this.certificates = {
        name: student.name,
        title: course.title,
        description,
        issuedAt: new Date(),
    };
    await this.save();
    return this;
};
const Progress = (0, mongoose_1.model)("Progress", progressSchema);
exports.default = Progress;
