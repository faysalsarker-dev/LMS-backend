"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEarningsByDateRange = exports.getMonthlyEarnings = exports.getTotalEarnings = exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.createEnrollment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../auth/User.model"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const Enrollment_model_1 = __importDefault(require("./Enrollment.model"));
const ApiError_1 = require("../../errors/ApiError");
const Promo_model_1 = __importDefault(require("../promoCode/Promo.model"));
// Create enrollment with payment
const createEnrollment = async (data) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Check if already enrolled
        const existingEnrollment = await Enrollment_model_1.default.findOne({
            user: data.user,
            course: data.course,
        });
        if (existingEnrollment) {
            throw new ApiError_1.ApiError(400, "User is already enrolled in this course");
        }
        // Verify course exists
        const course = await Course_model_1.default.findById(data.course).session(session);
        if (!course) {
            throw new ApiError_1.ApiError(404, "Course not found");
        }
        // Handle promo code if provided
        let promoCodeId = null;
        if (data.promoCode) {
            const promo = await Promo_model_1.default.findOne({
                code: data.promoCode,
                isActive: true,
            }).session(session);
            if (promo) {
                // Check if user already used this promo
                const userUsedPromo = promo.usedBy.some((usage) => usage.user.toString() === data.user);
                if (userUsedPromo) {
                    throw new ApiError_1.ApiError(400, "You have already used this promo code");
                }
                // Update promo usage
                await Promo_model_1.default.findByIdAndUpdate(promo._id, {
                    $inc: { currentUsageCount: 1 },
                    $push: { usedBy: { user: data.user, usedAt: new Date() } },
                }, { session });
                promoCodeId = promo._id;
            }
        }
        // Create enrollment
        const enrollment = await Enrollment_model_1.default.create([
            {
                user: data.user,
                course: data.course,
                originalPrice: data.originalPrice,
                discountAmount: data.discountAmount || 0,
                finalAmount: data.finalAmount,
                promoCode: promoCodeId,
                promoCodeUsed: data.promoCode || null,
                paymentMethod: data.paymentMethod,
                paymentStatus: "completed",
                transactionId: data.transactionId,
                paymentDate: new Date(),
                status: "active",
            },
        ], { session });
        // Add course to user's courses
        await User_model_1.default.findByIdAndUpdate(data.user, { $addToSet: { courses: data.course } }, { session });
        // Update course enrollment stats
        await Course_model_1.default.findByIdAndUpdate(data.course, {
            $inc: { totalEnrolled: 1 },
            $addToSet: { enrolledStudents: data.user },
        }, { session });
        // Create progress document
        await progress_model_1.default.create([
            {
                student: data.user,
                course: data.course,
                completedLessons: [],
                quizResults: [],
                assignmentSubmissions: [],
                progressPercentage: 0,
                isCompleted: false,
            },
        ], { session });
        await session.commitTransaction();
        return enrollment[0];
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.createEnrollment = createEnrollment;
// Get all enrollments (Admin)
const getAllEnrollments = async (filters) => {
    const query = {};
    if (filters?.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
    }
    if (filters?.startDate || filters?.endDate) {
        query.paymentDate = {};
        if (filters.startDate)
            query.paymentDate.$gte = filters.startDate;
        if (filters.endDate)
            query.paymentDate.$lte = filters.endDate;
    }
    return await Enrollment_model_1.default.find(query)
        .populate("user", "name email")
        .populate("course", "title slug")
        .sort({ createdAt: -1 });
};
exports.getAllEnrollments = getAllEnrollments;
// Get enrollment by ID
const getEnrollmentById = async (id) => {
    const enrollment = await Enrollment_model_1.default.findById(id)
        .populate("user", "name email phone")
        .populate("course", "title slug description thumbnail");
    if (!enrollment) {
        throw new ApiError_1.ApiError(404, "Enrollment not found");
    }
    return enrollment;
};
exports.getEnrollmentById = getEnrollmentById;
// Update enrollment status
const updateEnrollment = async (id, data) => {
    const enrollment = await Enrollment_model_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
        .populate("user", "name email")
        .populate("course", "title slug");
    if (!enrollment) {
        throw new ApiError_1.ApiError(404, "Enrollment not found");
    }
    return enrollment;
};
exports.updateEnrollment = updateEnrollment;
// Delete enrollment (Admin only - careful!)
const deleteEnrollment = async (id) => {
    const enrollment = await Enrollment_model_1.default.findById(id);
    if (!enrollment) {
        throw new ApiError_1.ApiError(404, "Enrollment not found");
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Remove from user's courses
        await User_model_1.default.findByIdAndUpdate(enrollment.user, { $pull: { courses: enrollment.course } }, { session });
        // Update course stats
        await Course_model_1.default.findByIdAndUpdate(enrollment.course, {
            $inc: { totalEnrolled: -1 },
            $pull: { enrolledStudents: enrollment.user },
        }, { session });
        // Delete progress
        await progress_model_1.default.findOneAndDelete({ student: enrollment.user, course: enrollment.course }, { session });
        // Delete enrollment
        await Enrollment_model_1.default.findByIdAndDelete(id, { session });
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.deleteEnrollment = deleteEnrollment;
// ========================================
// ANALYTICS SERVICES
// ========================================
// Get total earnings
const getTotalEarnings = async () => {
    const result = await Enrollment_model_1.default.aggregate([
        { $match: { paymentStatus: "completed" } },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$finalAmount" },
                totalEnrollments: { $count: {} },
                totalDiscounts: { $sum: "$discountAmount" },
            },
        },
    ]);
    return (result[0] || { totalEarnings: 0, totalEnrollments: 0, totalDiscounts: 0 });
};
exports.getTotalEarnings = getTotalEarnings;
// Get monthly earnings for a year
const getMonthlyEarnings = async (year) => {
    const result = await Enrollment_model_1.default.aggregate([
        {
            $match: {
                paymentStatus: "completed",
                paymentDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$paymentDate" },
                earnings: { $sum: "$finalAmount" },
                count: { $count: {} },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    // Fill all 12 months
    const monthlyData = Array(12)
        .fill(0)
        .map((_, i) => ({ month: i + 1, earnings: 0, count: 0 }));
    result.forEach((item) => {
        monthlyData[item._id - 1] = {
            month: item._id,
            earnings: item.earnings,
            count: item.count,
        };
    });
    return monthlyData;
};
exports.getMonthlyEarnings = getMonthlyEarnings;
// Get earnings by date range
const getEarningsByDateRange = async (startDate, endDate) => {
    const result = await Enrollment_model_1.default.aggregate([
        {
            $match: {
                paymentStatus: "completed",
                paymentDate: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$finalAmount" },
                totalEnrollments: { $count: {} },
            },
        },
    ]);
    return result[0] || { totalEarnings: 0, totalEnrollments: 0 };
};
exports.getEarningsByDateRange = getEarningsByDateRange;
