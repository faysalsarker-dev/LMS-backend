"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyReview = exports.deleteTestimonial = exports.getTopTestimonials = exports.getAllTestimonialsAdmin = exports.getCourseReviewSummary = exports.updateTestimonial = exports.createTestimonial = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = require("../../errors/ApiError");
const Enrollment_model_1 = __importDefault(require("../enrollment/Enrollment.model"));
const Testimonial_model_1 = __importDefault(require("./Testimonial.model"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
// ✅ CREATE testimonial
const createTestimonial = async ({ userId, courseId, rating, review, }) => {
    const enrollment = await Enrollment_model_1.default.findOne({ user: userId, course: courseId });
    if (!enrollment) {
        throw new ApiError_1.ApiError(http_status_1.default.FORBIDDEN, "You must enroll in this course before reviewing.");
    }
    // Prevent multiple reviews per course by the same user
    const existing = await Testimonial_model_1.default.findOne({ user: userId, course: courseId });
    if (existing) {
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "You have already reviewed this course.");
    }
    const testimonial = await Testimonial_model_1.default.create({
        user: userId,
        course: courseId,
        rating,
        review,
    });
    await recalculateCourseAverage(courseId);
    return testimonial;
};
exports.createTestimonial = createTestimonial;
// ✅ UPDATE testimonial
const updateTestimonial = async ({ testimonialId, userId, rating, review, }) => {
    const testimonial = await Testimonial_model_1.default.findById(testimonialId);
    if (!testimonial) {
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Testimonial not found or unauthorized.");
    }
    if (rating !== undefined)
        testimonial.rating = rating;
    if (review !== undefined)
        testimonial.review = review;
    await testimonial.save();
    await recalculateCourseAverage(testimonial.course.toString());
    return testimonial;
};
exports.updateTestimonial = updateTestimonial;
// Helper function — recalculate course average rating
const recalculateCourseAverage = async (courseId) => {
    const allTestimonials = await Testimonial_model_1.default.find({ course: courseId });
    const totalRatings = allTestimonials.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = allTestimonials.length
        ? Number((totalRatings / allTestimonials.length).toFixed(1))
        : 0;
    await Course_model_1.default.findByIdAndUpdate(courseId, { averageRating });
};
// ✅ Public: course details page — total count + top 10 highest ratings
const getCourseReviewSummary = async (courseId) => {
    const totalReviews = await Testimonial_model_1.default.countDocuments({ course: courseId });
    const topTestimonials = await Testimonial_model_1.default.find({ course: courseId })
        .populate("user", "name profile")
        .sort({ rating: -1, createdAt: -1 })
        .limit(10);
    return { totalReviews, topTestimonials };
};
exports.getCourseReviewSummary = getCourseReviewSummary;
// ✅ Admin: paginated + sorted testimonials
const getAllTestimonialsAdmin = async (page, limit, sort) => {
    const skip = (page - 1) * limit;
    const sortOptions = {
        highest: { rating: -1 },
        lowest: { rating: 1 },
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
    };
    const testimonials = await Testimonial_model_1.default.find()
        .populate("user", "name email profileImage")
        .populate("course", "title")
        .sort(sortOptions[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await Testimonial_model_1.default.countDocuments();
    return {
        meta: { total, page, limit },
        data: testimonials,
    };
};
exports.getAllTestimonialsAdmin = getAllTestimonialsAdmin;
// ✅ Public homepage: top 20 highest-rated reviews across all courses
const getTopTestimonials = async () => {
    const testimonials = await Testimonial_model_1.default.find()
        .populate("user", "name profileImage")
        .populate("course", "title")
        .sort({ rating: -1 })
        .limit(20);
    return testimonials;
};
exports.getTopTestimonials = getTopTestimonials;
// ✅ DELETE testimonial
const deleteTestimonial = async (testimonialId) => {
    const testimonial = await Testimonial_model_1.default.findById(testimonialId);
    if (!testimonial) {
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Testimonial not found or unauthorized.");
    }
    await testimonial.deleteOne();
    await recalculateCourseAverage(testimonial.course.toString());
    return testimonialId;
};
exports.deleteTestimonial = deleteTestimonial;
const getMyReview = async (userId, courseId) => {
    const testimonial = await Testimonial_model_1.default.findOne({ user: userId, course: courseId }).populate("user", "name profile");
    return testimonial;
};
exports.getMyReview = getMyReview;
