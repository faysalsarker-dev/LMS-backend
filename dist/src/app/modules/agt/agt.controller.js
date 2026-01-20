"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentSubmissionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const agt_service_1 = require("./agt.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
exports.AssignmentSubmissionController = {
    createSubmission: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const file = req.file;
        if (file) {
            req.body.fileUrl = file.path;
        }
        const data = { ...req.body, student: req.user._id };
        const submission = await agt_service_1.AssignmentSubmissionService.createSubmission(data);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "Submission created successfully",
            data: submission,
        });
    }),
    // ---------------------------
    // Get single submission
    // ---------------------------
    getSubmission: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const submission = await agt_service_1.AssignmentSubmissionService.getSubmissionById(req.params.id);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Submission retrieved successfully",
            data: submission,
        });
    }),
    // ---------------------------
    // Get all submissions
    // ---------------------------
    getAllSubmissions: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await agt_service_1.AssignmentSubmissionService.getAllSubmissions(req.query);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Submissions retrieved successfully",
            data: result.submissions,
            meta: result.pagination,
        });
    }),
    getStudentAssignmentByLesson: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const studentId = req.user._id;
        const result = await agt_service_1.AssignmentSubmissionService.getStudentAssignmentByLesson(studentId, req.params.id);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Submissions retrieved successfully",
            data: result,
        });
    }),
    // ---------------------------
    // Update submission
    // ---------------------------
    updateSubmission: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const updated = await agt_service_1.AssignmentSubmissionService.updateSubmission(req.params.id, req.body);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Submission updated successfully",
            data: updated,
        });
    }),
    // ---------------------------
    // Delete submission
    // ---------------------------
    deleteSubmission: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const deleted = await agt_service_1.AssignmentSubmissionService.deleteSubmission(req.params.id);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Submission deleted successfully",
            data: deleted,
        });
    }),
    // ---------------------------
    // Admin review (marks & feedback)
    // ---------------------------
    adminReview: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { marks, feedback, status } = req.body;
        const submission = await agt_service_1.AssignmentSubmissionService.reviewSubmission(req.params.id, marks, feedback, status);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Submission reviewed successfully",
            data: null,
        });
    }),
};
