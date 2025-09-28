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
exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getAllQuizzes = exports.createQuiz = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QuizService = __importStar(require("./quiz.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
exports.createQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await QuizService.createQuiz(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Quiz created successfully",
        data: result,
    });
});
exports.getAllQuizzes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await QuizService.getAllQuizzes();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quizzes retrieved successfully",
        data: result,
    });
});
exports.getQuizById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await QuizService.getQuizById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quiz retrieved successfully",
        data: result,
    });
});
exports.updateQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await QuizService.updateQuiz(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quiz updated successfully",
        data: result,
    });
});
exports.deleteQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await QuizService.deleteQuiz(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quiz deleted successfully",
        data: result,
    });
});
