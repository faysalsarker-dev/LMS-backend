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
exports.deleteCourse = exports.updateCourse = exports.getAllCourses = exports.getCourseById = exports.getCourseBySlug = exports.createCourse = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const CourseService = __importStar(require("./course.service"));
const http_status_1 = __importDefault(require("http-status"));
// Create Course
exports.createCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        thumbnail: req?.file?.path,
        instructor: req?.user?._id
    };
    const course = await CourseService.createCourse(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course created successfully",
        data: course,
    });
});
// Get Course by ID
exports.getCourseBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const course = await CourseService.getCourseBySlug(req.params.slug);
    if (!course) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Course not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course fetched successfully",
        data: course,
    });
});
exports.getCourseById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const course = await CourseService.getCourseById(req.params.id);
    if (!course) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Course not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course fetched successfully",
        data: course,
    });
});
// Get All Courses
exports.getAllCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await CourseService.getAllCourses(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Courses fetched successfully",
        data: result,
    });
});
// Update Course
exports.updateCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        thumbnail: req?.file?.path,
    };
    const course = await CourseService.updateCourse(req.params.id, payload);
    if (!course) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Course not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course updated successfully",
        data: course,
    });
});
// Delete Course
exports.deleteCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const course = await CourseService.deleteCourse(req.params.id);
    if (!course) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Course not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course deleted successfully",
    });
});
