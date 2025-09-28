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
exports.getProgressController = exports.markIncompleteController = exports.markCompleteController = void 0;
const ProgressService = __importStar(require("./progress.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// Mark complete
exports.markCompleteController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { lessonId } = req.body;
    const studentId = req.user.id; // auth middleware required
    const progress = await ProgressService.markLessonComplete(studentId, lessonId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lesson marked complete successfully",
        data: progress,
    });
});
// Mark incomplete
exports.markIncompleteController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { lessonId } = req.body;
    const studentId = req.user.id;
    const progress = await ProgressService.markLessonIncomplete(studentId, lessonId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lesson marked incomplete successfully",
        data: progress,
    });
});
// Get all progress for student
exports.getProgressController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user.id;
    const progressList = await ProgressService.getStudentProgress(studentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Progress fetched successfully",
        data: progressList,
    });
});
