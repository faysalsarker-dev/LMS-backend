"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseTestimonialSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
// Ensure one review per user per course
courseTestimonialSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const CourseTestimonial = (0, mongoose_1.model)("CourseTestimonial", courseTestimonialSchema);
exports.default = CourseTestimonial;
