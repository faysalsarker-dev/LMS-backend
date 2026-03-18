"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetMockTestProgress = exports.handleGradeSubmission = exports.handleGetPendingSubmissions = exports.handleGetStudentSubmissions = exports.handleSubmitMockTest = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const submissionService = __importStar(require("./mockTestSubmission.service"));
exports.handleSubmitMockTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user._id;
    const submission = await submissionService.submitMockTest(studentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Mock test submitted successfully",
        data: submission,
    });
});
exports.handleGetStudentSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user._id || req.user.id;
    const { courseId } = req.params;
    const submissions = await submissionService.getStudentSubmissions(studentId, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Student mock test submissions retrieved successfully",
        data: submissions,
    });
});
exports.handleGetPendingSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const submissions = await submissionService.getPendingSubmissions();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pending mock test submissions retrieved successfully",
        data: submissions,
    });
});
exports.handleGradeSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { submissionId } = req.params;
    const { grades } = req.body; // Array of { sectionId, score, feedback }
    const gradedSubmission = await submissionService.gradeSubmission(submissionId, grades);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Mock test submission graded successfully",
        data: gradedSubmission,
    });
});
exports.handleGetMockTestProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user._id;
    const { mockTestId } = req.params;
    const progress = await submissionService.getMockTestProgress(studentId, mockTestId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Student mock test progress retrieved successfully",
        data: progress,
    });
});
