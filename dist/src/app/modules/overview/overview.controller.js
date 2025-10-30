"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overview_service_1 = __importDefault(require("./overview.service"));
class AdminDashboardController {
    // GET /api/admin/dashboard
    async getDashboard(req, res) {
        try {
            const stats = await overview_service_1.default.getDashboardStats();
            return res.status(200).json(stats);
        }
        catch (error) {
            console.error("Dashboard Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard stats",
                error: error.message,
            });
        }
    }
    // GET /api/admin/users
    async getUsers(req, res) {
        try {
            const users = await overview_service_1.default.getUserStats();
            return res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/courses
    async getCourses(req, res) {
        try {
            const courses = await overview_service_1.default.getCourseStats();
            return res.status(200).json({ success: true, data: courses });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/enrollments
    async getEnrollments(req, res) {
        try {
            const enrollments = await overview_service_1.default.getEnrollmentStats();
            return res.status(200).json({ success: true, data: enrollments });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/revenue
    async getRevenue(req, res) {
        try {
            const revenue = await overview_service_1.default.getRevenueStats();
            return res.status(200).json({ success: true, data: revenue });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/popular-courses
    async getPopularCourses(req, res) {
        try {
            const limit = Number(req.query.limit) || 10;
            const courses = await overview_service_1.default.getPopularCourses(limit);
            return res.status(200).json({ success: true, data: courses });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/top-instructors
    async getTopInstructors(req, res) {
        try {
            const limit = Number(req.query.limit) || 5;
            const instructors = await overview_service_1.default.getTopInstructors(limit);
            return res.status(200).json({ success: true, data: instructors });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/recent-enrollments
    async getRecentEnrollments(req, res) {
        try {
            const limit = Number(req.query.limit) || 10;
            const enrollments = await overview_service_1.default.getRecentEnrollments(limit);
            return res.status(200).json({ success: true, data: enrollments });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/content-stats
    async getContentStats(req, res) {
        try {
            const stats = await overview_service_1.default.getContentStats();
            return res.status(200).json({ success: true, data: stats });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // GET /api/admin/growth-analytics
    async getGrowthAnalytics(req, res) {
        try {
            const analytics = await overview_service_1.default.getGrowthAnalytics();
            return res.status(200).json({ success: true, data: analytics });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.default = new AdminDashboardController();
