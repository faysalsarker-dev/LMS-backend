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
exports.deleteTestimonial = exports.getMyReview = exports.getTopTestimonials = exports.getAllTestimonialsAdmin = exports.getCourseReviewSummary = exports.updateTestimonial = exports.createTestimonial = void 0;
const http_status_1 = __importDefault(require("http-status"));
const testimonialService = __importStar(require("./testimonial.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// ✅ Create testimonial
exports.createTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const testimonial = await testimonialService.createTestimonial({
        userId: req.user.id,
        ...req.body,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Review added successfully",
        data: testimonial,
    });
});
// ✅ Update testimonial
exports.updateTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { testimonialId } = req.params;
    const testimonial = await testimonialService.updateTestimonial({
        testimonialId,
        userId: req.user.id,
        ...req.body,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review updated successfully",
        data: testimonial,
    });
});
// ✅ Public: get summary for a single course
exports.getCourseReviewSummary = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    const data = await testimonialService.getCourseReviewSummary(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course reviews fetched successfully",
        data,
    });
});
// ✅ Admin: paginated + sorted
exports.getAllTestimonialsAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, sort = "newest" } = req.query;
    const data = await testimonialService.getAllTestimonialsAdmin(Number(page), Number(limit), String(sort));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All testimonials fetched successfully",
        data,
    });
});
// ✅ Public homepage
exports.getTopTestimonials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await testimonialService.getTopTestimonials();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Top testimonials fetched successfully",
        data,
    });
});
exports.getMyReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;
    const testimonial = await testimonialService.getMyReview(userId, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your review fetched successfully",
        data: testimonial,
    });
});
// ✅ Delete
exports.deleteTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { testimonialId } = req.params;
    const deletedId = await testimonialService.deleteTestimonial(testimonialId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Testimonial deleted successfully",
        data: deletedId,
    });
});
