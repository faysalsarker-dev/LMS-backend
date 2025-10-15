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
exports.deleteLessonController = exports.updateLessonController = exports.getSingleLessonController = exports.getAllLessonsController = exports.createLessonController = void 0;
const LessonService = __importStar(require("./lesson.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// Create
exports.createLessonController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (req.body.videoSourceType === "upload" && req.file?.path) {
        req.body.videoUrl = req.file.path;
    }
    const lesson = await LessonService.createLesson(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lesson Created successfully",
        data: lesson,
    });
});
// Get All
exports.getAllLessonsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { search, status, course, milestone, page = '1', limit = '10' } = req.query;
    const { data, meta } = await LessonService.getAllLessons({
        milestone: milestone,
        search: search,
        status: status,
        course: course,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    });
    ;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lessons fetchedsuccessfully",
        data: data,
        meta: meta
    });
});
// Get Single
exports.getSingleLessonController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lesson = await LessonService.getSingleLesson(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lesson fetched successfully",
        data: lesson,
    });
});
// Update
exports.updateLessonController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const lesson = await LessonService.updateLesson(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lesson updated successfully",
        data: lesson,
    });
});
// Delete
exports.deleteLessonController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await LessonService.deleteLesson(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Lesson deleted successfully",
        data: null,
    });
});
