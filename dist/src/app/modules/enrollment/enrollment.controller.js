"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSSlFailedController = exports.paymentSSlCancelController = exports.paymentSSlSuccessController = exports.getMonthlyEarningsController = exports.getTotalEarningsController = exports.deleteEnrollmentController = exports.updateEnrollmentController = exports.getEnrollmentByIdController = exports.getAllEnrollmentsController = exports.createEnrollmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ApiError_1 = require("../../errors/ApiError");
const enrollment_service_1 = require("./enrollment.service");
const config_1 = __importDefault(require("../../config/config"));
exports.createEnrollmentController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError_1.ApiError(401, "User not found");
    }
    const payload = {
        user: userId,
        course: req.body.course,
        originalPrice: req.body.originalPrice,
        discountAmount: req.body.discountAmount || 0,
        finalAmount: req.body.finalAmount,
        promoCode: req.body.promoCode,
    };
    console.log("Creating enrollment with payload:", payload);
    const result = await (0, enrollment_service_1.createEnrollment)(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Enrollment created successfully",
        data: result,
    });
});
exports.getAllEnrollmentsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = {
        paymentStatus: req.query.paymentStatus,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
    };
    const result = await (0, enrollment_service_1.getAllEnrollments)(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollments fetched successfully",
        data: result,
    });
});
exports.getEnrollmentByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, enrollment_service_1.getEnrollmentById)(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollment fetched successfully",
        data: result,
    });
});
exports.updateEnrollmentController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, enrollment_service_1.updateEnrollment)(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollment updated successfully",
        data: result,
    });
});
exports.deleteEnrollmentController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await (0, enrollment_service_1.deleteEnrollment)(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollment deleted successfully",
        data: null,
    });
});
// Analytics controllers
exports.getTotalEarningsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, enrollment_service_1.getTotalEarnings)();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Total earnings fetched successfully",
        data: result,
    });
});
exports.getMonthlyEarningsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const result = await (0, enrollment_service_1.getMonthlyEarnings)(year);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Monthly earnings fetched successfully",
        data: result,
    });
});
exports.paymentSSlSuccessController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, enrollment_service_1.handleSuccessPayment)(req.query);
    res.redirect(config_1.default.ssl.sslSuccessFrontendUrl);
});
exports.paymentSSlCancelController = (0, catchAsync_1.catchAsync)(async (req, res) => {
});
exports.paymentSSlFailedController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Handle payment success logic here
    res.send("Payment successful");
});
