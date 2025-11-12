"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentSubmissionService = void 0;
const ApiError_1 = require("../../errors/ApiError");
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const Agt_model_1 = __importDefault(require("./Agt.model"));
exports.AssignmentSubmissionService = {
    async createSubmission(data) {
        const existing = await Agt_model_1.default.findOne({
            student: data.student,
            lesson: data.lesson,
        });
        if (existing)
            throw new ApiError_1.ApiError(400, "Submission already exists");
        return Agt_model_1.default.create(data);
    },
    async getSubmissionById(id) {
        const submission = await Agt_model_1.default.findById(id)
            .populate("student", "name email")
            .populate("lesson", "title assignment")
            .populate("course", "title");
        if (!submission)
            throw new ApiError_1.ApiError(404, "Submission not found");
        return submission;
    },
    async getAllSubmissions(query = {}) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        // Filter by status
        if (query.status)
            filter.status = query.status;
        // Filter by submissionType
        if (query.submissionType)
            filter.submissionType = query.submissionType;
        // Filter by course
        if (query.course)
            filter.course = query.course;
        // Filter by lesson
        if (query.lesson)
            filter.lesson = query.lesson;
        // Search by student name or email
        const search = query.search ? query.search.trim() : null;
        let submissionsQuery = Agt_model_1.default.find(filter)
            .populate("student", "name email")
            .populate("lesson", "title assignment")
            .populate("course", "title")
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);
        if (search) {
            submissionsQuery = submissionsQuery.where({
                $or: [
                    { "student.name": { $regex: search, $options: "i" } },
                    { "student.email": { $regex: search, $options: "i" } },
                ],
            });
        }
        const [submissions, total] = await Promise.all([
            submissionsQuery.exec(),
            Agt_model_1.default.countDocuments(filter),
        ]);
        return {
            submissions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async updateSubmission(id, data) {
        const updated = await Agt_model_1.default.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updated)
            throw new ApiError_1.ApiError(404, "Submission not found");
        return updated;
    },
    async deleteSubmission(id) {
        const deleted = await Agt_model_1.default.findByIdAndDelete(id);
        if (!deleted)
            throw new ApiError_1.ApiError(404, "Submission not found");
        return deleted;
    },
    // -----------------------
    // Admin review (give marks/feedback)
    // -----------------------
    async reviewSubmission(id, marks, feedback, status = "graded") {
        const submission = await Agt_model_1.default.findById(id);
        if (!submission)
            throw new ApiError_1.ApiError(404, "Submission not found");
        submission.result = marks;
        submission.feedback = feedback;
        submission.status = status;
        await submission.save();
        const progress = await progress_model_1.default.findOne({
            student: submission.student,
            course: submission.course,
        });
        if (progress && status === "graded") {
            await progress.updateWithAssignment(submission._id.toString());
        }
        return submission;
    },
};
