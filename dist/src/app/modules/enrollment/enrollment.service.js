"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEarningsByDateRange = exports.getMonthlyEarnings = exports.getTotalEarnings = exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.handleCancelledPayment = exports.handleFailedPayment = exports.handleSuccessPayment = exports.createEnrollment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../auth/User.model"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const Enrollment_model_1 = __importDefault(require("./Enrollment.model"));
const ApiError_1 = require("../../errors/ApiError");
const Promo_model_1 = __importDefault(require("../promoCode/Promo.model"));
const sslCommersz_service_1 = require("../sslCommersz/sslCommersz.service");
const transactionId_1 = require("../../utils/transactionId");
// Create enrollment with payment
const createEnrollment = async (data) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1. Check if already enrolled
        const existingEnrollment = await Enrollment_model_1.default.findOne({
            user: data.user,
            course: data.course,
            paymentStatus: "completed",
        }).session(session);
        if (existingEnrollment) {
            throw new ApiError_1.ApiError(400, "User is already enrolled in this course");
        }
        const course = await Course_model_1.default.findById(data.course).session(session);
        if (!course)
            throw new ApiError_1.ApiError(404, "Course not found");
        const user = await User_model_1.default.findById(data.user).session(session);
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        let finalAmount = course.price;
        let appliedPromo = null;
        if (data.promoCode) {
            const validation = await Promo_model_1.default.validatePromo({
                code: data.promoCode,
                userId: data.user,
                originalPrice: course.price,
            });
            finalAmount = validation.finalAmount;
            appliedPromo = validation.promoCode;
        }
        const transactionId = (0, transactionId_1.generateTransactionId)();
        await Enrollment_model_1.default.create([
            {
                user: data.user,
                course: data.course,
                amount: finalAmount,
                currency: course.currency || "BDT",
                paymentStatus: "pending",
                promoCode: appliedPromo,
                transactionId: transactionId,
                paymentDate: new Date(),
            },
        ], { session });
        const paymentData = {
            amount: finalAmount,
            courseId: course._id.toString(),
            transactionId: transactionId,
            name: user.name,
            email: user.email,
            phoneNumber: user.phone || "01700000000",
            city: user.address?.city || "Dhaka",
            country: user.address?.country || "Bangladesh",
        };
        const sslPayment = await sslCommersz_service_1.SSLService.sslPaymentInit(paymentData);
        await session.commitTransaction();
        return sslPayment.GatewayPageURL;
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
// Handle successful payment
const handleSuccessPayment = async (query) => {
    const { transactionId, promoCode } = query;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1. Find the pending enrollment
        const enrollment = await Enrollment_model_1.default.findOne({ transactionId }).session(session);
        if (!enrollment)
            throw new ApiError_1.ApiError(404, "Enrollment record not found");
        if (enrollment.paymentStatus === "completed") {
            return enrollment;
        }
        enrollment.paymentStatus = "completed";
        await enrollment.save({ session });
        await User_model_1.default.findByIdAndUpdate(enrollment.user, { $addToSet: { courses: enrollment.course } }, { session });
        await Course_model_1.default.findByIdAndUpdate(enrollment.course, {
            $inc: { totalEnrolled: 1 },
            $addToSet: { enrolledStudents: enrollment.user },
        }, { session });
        if (promoCode) {
            await Promo_model_1.default.usePromo({
                promoCode: promoCode,
                userId: enrollment.user,
                courseId: enrollment.course,
                price: enrollment.amount,
            });
        }
        const progress = await progress_model_1.default.create([
            {
                student: enrollment.user,
                course: enrollment.course,
                completedLessons: [],
                quizResults: [],
                assignmentSubmissions: [],
                progressPercentage: 0,
                isCompleted: false,
            },
        ], { session });
        console.log("Enrollment and progress created successfully for transaction:", progress);
        await session.commitTransaction();
        return enrollment;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.handleSuccessPayment = handleSuccessPayment;
// Handle failed payment
const handleFailedPayment = async (data) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
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
exports.handleFailedPayment = handleFailedPayment;
// Handle cancelled payment
const handleCancelledPayment = async (data) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Main logic here
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
exports.handleCancelledPayment = handleCancelledPayment;
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
