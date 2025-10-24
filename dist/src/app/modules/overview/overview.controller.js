"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const overview_service_1 = __importDefault(require("./overview.service"));
class OverviewController {
    constructor() {
        // 📊 Get Complete Dashboard Overview
        this.getDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const result = await overview_service_1.default.getDashboardStats();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Dashboard statistics retrieved successfully",
                data: result.data,
            });
        });
        // 👥 Get User Statistics
        this.getUserStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userStats = await overview_service_1.default.getUserStats();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "User statistics retrieved successfully",
                data: userStats,
            });
        });
        // 📚 Get Course Statistics
        this.getCourseStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const courseStats = await overview_service_1.default.getCourseStats();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Course statistics retrieved successfully",
                data: courseStats,
            });
        });
        // 📝 Get Enrollment Statistics
        this.getEnrollmentStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const enrollmentStats = await overview_service_1.default.getEnrollmentStats();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Enrollment statistics retrieved successfully",
                data: enrollmentStats,
            });
        });
        // 💰 Get Revenue Statistics
        this.getRevenueStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const revenueStats = await overview_service_1.default.getRevenueStats();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Revenue statistics retrieved successfully",
                data: revenueStats,
            });
        });
        // 🔥 Get Popular Courses
        this.getPopularCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const limit = parseInt(req.query.limit) || 10;
            const popularCourses = await overview_service_1.default.getPopularCourses(limit);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Popular courses retrieved successfully",
                data: popularCourses,
            });
        });
        // 🕐 Get Recent Enrollments
        this.getRecentEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const limit = parseInt(req.query.limit) || 10;
            const recentEnrollments = await overview_service_1.default.getRecentEnrollments(limit);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Recent enrollments retrieved successfully",
                data: recentEnrollments,
            });
        });
        // 📈 Get Content Statistics
        this.getContentStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const contentStats = await overview_service_1.default.getContentStats();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Content statistics retrieved successfully",
                data: contentStats,
            });
        });
        // 📊 Get Growth Analytics
        this.getGrowthAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const growthData = await overview_service_1.default.getGrowthAnalytics();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Growth analytics retrieved successfully",
                data: growthData,
            });
        });
    }
}
exports.default = new OverviewController();
