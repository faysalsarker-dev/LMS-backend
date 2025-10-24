"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../auth/User.model"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
const Enrollment_model_1 = __importDefault(require("../enrollment/Enrollment.model"));
const Lesson_model_1 = __importDefault(require("../lesson/Lesson.model"));
const Milestone_model_1 = __importDefault(require("../milestone/Milestone.model"));
class OverviewService {
    // 📊 Get Complete Dashboard Statistics
    async getDashboardStats() {
        const [userStats, courseStats, enrollmentStats, revenueStats, popularCourses, recentEnrollments,] = await Promise.all([
            this.getUserStats(),
            this.getCourseStats(),
            this.getEnrollmentStats(),
            this.getRevenueStats(),
            this.getPopularCourses(5),
            this.getRecentEnrollments(10),
        ]);
        return {
            success: true,
            data: {
                users: userStats,
                courses: courseStats,
                enrollments: enrollmentStats,
                revenue: revenueStats,
                popularCourses,
                recentEnrollments,
                timestamp: new Date(),
            },
        };
    }
    // 👥 User Statistics
    async getUserStats() {
        const stats = await User_model_1.default.aggregate([
            {
                $facet: {
                    total: [{ $count: "count" }],
                    byRole: [
                        { $group: { _id: "$role", count: { $sum: 1 } } },
                        { $sort: { _id: 1 } },
                    ],
                    byStatus: [
                        {
                            $group: {
                                _id: null,
                                active: { $sum: { $cond: ["$isActive", 1, 0] } },
                                inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
                                verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
                                unverified: { $sum: { $cond: ["$isVerified", 0, 1] } },
                            },
                        },
                    ],
                    newThisMonth: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                },
                            },
                        },
                        { $count: "count" },
                    ],
                    topInstructors: [
                        { $match: { role: "instructor" } },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "instructor",
                                as: "coursesCreated",
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                totalCourses: { $size: "$coursesCreated" },
                            },
                        },
                        { $sort: { totalCourses: -1 } },
                        { $limit: 5 },
                    ],
                },
            },
        ]);
        const result = stats[0];
        return {
            total: result.total[0]?.count || 0,
            roles: {
                students: result.byRole.find((r) => r._id === "student")?.count || 0,
                instructors: result.byRole.find((r) => r._id === "instructor")?.count || 0,
                admins: result.byRole.find((r) => r._id === "admin")?.count || 0,
                superAdmins: result.byRole.find((r) => r._id === "super_admin")?.count || 0,
            },
            status: {
                active: result.byStatus[0]?.active || 0,
                inactive: result.byStatus[0]?.inactive || 0,
                verified: result.byStatus[0]?.verified || 0,
                unverified: result.byStatus[0]?.unverified || 0,
            },
            newThisMonth: result.newThisMonth[0]?.count || 0,
            topInstructors: result.topInstructors,
        };
    }
    // 📚 Course Statistics
    async getCourseStats() {
        const stats = await Course_model_1.default.aggregate([
            {
                $facet: {
                    total: [{ $count: "count" }],
                    byStatus: [
                        { $group: { _id: "$status", count: { $sum: 1 } } },
                        { $sort: { _id: 1 } },
                    ],
                    byLevel: [
                        { $group: { _id: "$level", count: { $sum: 1 } } },
                        { $sort: { _id: 1 } },
                    ],
                    totalEnrollments: [
                        { $group: { _id: null, total: { $sum: "$totalEnrolled" } } },
                    ],
                    averageRating: [
                        {
                            $match: { averageRating: { $gt: 0 } },
                        },
                        {
                            $group: {
                                _id: null,
                                avgRating: { $avg: "$averageRating" },
                                totalRatedCourses: { $sum: 1 },
                            },
                        },
                    ],
                    featured: [
                        { $match: { isFeatured: true } },
                        { $count: "count" },
                    ],
                    withDiscount: [
                        { $match: { isDiscounted: true } },
                        { $count: "count" },
                    ],
                    certificateOffering: [
                        { $match: { certificateAvailable: true } },
                        { $count: "count" },
                    ],
                    topRated: [
                        { $match: { status: "published", averageRating: { $gt: 0 } } },
                        {
                            $project: {
                                title: 1,
                                averageRating: 1,
                                totalEnrolled: 1,
                                price: 1,
                            },
                        },
                        { $sort: { averageRating: -1, totalEnrolled: -1 } },
                        { $limit: 5 },
                    ],
                },
            },
        ]);
        const result = stats[0];
        return {
            total: result.total[0]?.count || 0,
            status: {
                draft: result.byStatus.find((s) => s._id === "draft")?.count || 0,
                published: result.byStatus.find((s) => s._id === "published")?.count || 0,
                archived: result.byStatus.find((s) => s._id === "archived")?.count || 0,
            },
            levels: {
                beginner: result.byLevel.find((l) => l._id === "Beginner")?.count || 0,
                intermediate: result.byLevel.find((l) => l._id === "Intermediate")?.count || 0,
                advanced: result.byLevel.find((l) => l._id === "Advanced")?.count || 0,
            },
            totalEnrollments: result.totalEnrollments[0]?.total || 0,
            averageRating: result.averageRating[0]?.avgRating?.toFixed(2) || 0,
            totalRatedCourses: result.averageRating[0]?.totalRatedCourses || 0,
            featured: result.featured[0]?.count || 0,
            withDiscount: result.withDiscount[0]?.count || 0,
            certificateOffering: result.certificateOffering[0]?.count || 0,
            topRated: result.topRated,
        };
    }
    // 📝 Enrollment Statistics
    async getEnrollmentStats() {
        const stats = await Enrollment_model_1.default.aggregate([
            {
                $facet: {
                    total: [{ $count: "count" }],
                    byStatus: [
                        { $group: { _id: "$status", count: { $sum: 1 } } },
                    ],
                    byPaymentStatus: [
                        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
                    ],
                    byPaymentMethod: [
                        { $group: { _id: "$method", count: { $sum: 1 } } },
                    ],
                    thisMonth: [
                        {
                            $match: {
                                enrolledAt: {
                                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                },
                            },
                        },
                        { $count: "count" },
                    ],
                    completionRate: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                completed: {
                                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                                },
                            },
                        },
                        {
                            $project: {
                                rate: {
                                    $multiply: [{ $divide: ["$completed", "$total"] }, 100],
                                },
                            },
                        },
                    ],
                },
            },
        ]);
        const result = stats[0];
        return {
            total: result.total[0]?.count || 0,
            status: {
                active: result.byStatus.find((s) => s._id === "active")?.count || 0,
                completed: result.byStatus.find((s) => s._id === "completed")?.count || 0,
                cancelled: result.byStatus.find((s) => s._id === "cancelled")?.count || 0,
            },
            payment: {
                paid: result.byPaymentStatus.find((p) => p._id === "paid")?.count || 0,
                pending: result.byPaymentStatus.find((p) => p._id === "pending")?.count || 0,
                failed: result.byPaymentStatus.find((p) => p._id === "failed")?.count || 0,
            },
            paymentMethods: {
                alipay: result.byPaymentMethod.find((m) => m._id === "alipay")?.count || 0,
                wechat: result.byPaymentMethod.find((m) => m._id === "wechat")?.count || 0,
            },
            thisMonth: result.thisMonth[0]?.count || 0,
            completionRate: result.completionRate[0]?.rate?.toFixed(2) || 0,
        };
    }
    // 💰 Revenue Statistics
    async getRevenueStats() {
        const stats = await Enrollment_model_1.default.aggregate([
            {
                $match: { paymentStatus: "paid" },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $unwind: "$courseDetails",
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                "$courseDetails.isDiscounted",
                                "$courseDetails.discountPrice",
                                "$courseDetails.price",
                            ],
                        },
                    },
                    totalTransactions: { $sum: 1 },
                    averageOrderValue: {
                        $avg: {
                            $cond: [
                                "$courseDetails.isDiscounted",
                                "$courseDetails.discountPrice",
                                "$courseDetails.price",
                            ],
                        },
                    },
                },
            },
        ]);
        // Revenue this month
        const monthlyRevenue = await Enrollment_model_1.default.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    enrolledAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $unwind: "$courseDetails",
            },
            {
                $group: {
                    _id: null,
                    monthlyRevenue: {
                        $sum: {
                            $cond: [
                                "$courseDetails.isDiscounted",
                                "$courseDetails.discountPrice",
                                "$courseDetails.price",
                            ],
                        },
                    },
                },
            },
        ]);
        return {
            totalRevenue: stats[0]?.totalRevenue?.toFixed(2) || 0,
            totalTransactions: stats[0]?.totalTransactions || 0,
            averageOrderValue: stats[0]?.averageOrderValue?.toFixed(2) || 0,
            monthlyRevenue: monthlyRevenue[0]?.monthlyRevenue?.toFixed(2) || 0,
            currency: "USD",
        };
    }
    // 🔥 Popular Courses
    async getPopularCourses(limit = 10) {
        return await Course_model_1.default.find({ status: "published" })
            .select("title slug totalEnrolled averageRating price thumbnail")
            .sort({ totalEnrolled: -1, averageRating: -1 })
            .limit(limit)
            .lean();
    }
    // 🕐 Recent Enrollments
    async getRecentEnrollments(limit = 10) {
        return await Enrollment_model_1.default.find()
            .populate("user", "name email profile")
            .populate("course", "title slug thumbnail price")
            .sort({ enrolledAt: -1 })
            .limit(limit)
            .lean();
    }
    // 📈 Content Statistics
    async getContentStats() {
        const [milestoneCount, lessonCount, lessonsByType] = await Promise.all([
            Milestone_model_1.default.countDocuments(),
            Lesson_model_1.default.countDocuments(),
            Lesson_model_1.default.aggregate([
                { $group: { _id: "$contentType", count: { $sum: 1 } } },
            ]),
        ]);
        return {
            totalMilestones: milestoneCount,
            totalLessons: lessonCount,
            lessonTypes: {
                video: lessonsByType.find((l) => l._id === "video")?.count || 0,
                doc: lessonsByType.find((l) => l._id === "doc")?.count || 0,
                quiz: lessonsByType.find((l) => l._id === "quiz")?.count || 0,
                assignment: lessonsByType.find((l) => l._id === "assignment")?.count || 0,
            },
        };
    }
    // 📊 Growth Analytics (Last 6 Months)
    async getGrowthAnalytics() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const [userGrowth, enrollmentGrowth] = await Promise.all([
            User_model_1.default.aggregate([
                {
                    $match: { createdAt: { $gte: sixMonthsAgo } },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Enrollment_model_1.default.aggregate([
                {
                    $match: { enrolledAt: { $gte: sixMonthsAgo } },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$enrolledAt" },
                            month: { $month: "$enrolledAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
        ]);
        return {
            userGrowth,
            enrollmentGrowth,
        };
    }
}
exports.default = new OverviewService();
