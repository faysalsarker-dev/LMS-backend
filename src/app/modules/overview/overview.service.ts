// import User from "../auth/User.model";
// import Course from "../course/Course.model";
// import Enrollment from "../enrollment/Enrollment.model";
// import Lesson from "../lesson/Lesson.model";
// import Milestone from "../milestone/Milestone.model";

// interface GrowthData {
//   month: string;
//   count: number;
// }

// class OverviewService {
//   // 📊 Full Dashboard Stats
//   async getDashboardStats() {
//     const [
//       userStats,
//       courseStats,
//       enrollmentStats,
//       revenueStats,
//       popularCourses,
//       topInstructors,
//       recentEnrollments,
//       contentStats,
//       growthAnalytics,
//     ] = await Promise.all([
//       this.getUserStats(),
//       this.getEnrollmentStats(),
//       this.getRevenueStats(),
//       this.getPopularCourses(5),
//       this.getRecentEnrollments(10),
//       this.getContentStats(),
//       this.getGrowthAnalytics(),
//     ]);

//     return {
//       success: true,
//       data: {
//         users: userStats,
//         courses: courseStats,
//         enrollments: enrollmentStats,
//         revenue: revenueStats,
//         popularCourses,
//         topInstructors,
//         recentEnrollments,
//         contentStats,
//         growthAnalytics,
//         timestamp: new Date(),
//       },
//     };
//   }

//   // 👥 User Stats
//   async getUserStats() {
//     const stats = await User.aggregate([
//       {
//         $facet: {
//           total: [{ $count: "count" }],
//           byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
//           byStatus: [
//             {
//               $group: {
//                 _id: null,
//                 active: { $sum: { $cond: ["$isActive", 1, 0] } },
//                 inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
//                 verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
//                 unverified: { $sum: { $cond: ["$isVerified", 0, 1] } },
//               },
//             },
//           ],
//           newThisMonth: [
//             {
//               $match: {
//                 createdAt: {
//                   $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//                 },
//               },
//             },
//             { $count: "count" },
//           ],
//         },
//       },
//     ]);

//     const result = stats[0];

//     return {
//       total: result.total[0]?.count || 0,
//       roles: {
//         students: result.byRole.find((r: any) => r._id === "student")?.count || 0,
//         instructors: result.byRole.find((r: any) => r._id === "instructor")?.count || 0,
//         admins: result.byRole.find((r: any) => r._id === "admin")?.count || 0,
//         superAdmins: result.byRole.find((r: any) => r._id === "super_admin")?.count || 0,
//       },
//       status: {
//         active: result.byStatus[0]?.active || 0,
//         inactive: result.byStatus[0]?.inactive || 0,
//         verified: result.byStatus[0]?.verified || 0,
//         unverified: result.byStatus[0]?.unverified || 0,
//       },
//       newThisMonth: result.newThisMonth[0]?.count || 0,
//     };
//   }



//   // 📝 Enrollment Stats
//   async getEnrollmentStats() {
//     const stats = await Enrollment.aggregate([
//       {
//         $facet: {
//           total: [{ $count: "count" }],
//           byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
//           byPaymentStatus: [{ $group: { _id: "$paymentStatus", count: { $sum: 1 } } }],
//           byPaymentMethod: [{ $group: { _id: "$method", count: { $sum: 1 } } }],
//           thisMonth: [
//             { $match: { enrolledAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
//             { $count: "count" },
//           ],
//           completionRate: [
//             { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } } } },
//             { $project: { rate: { $multiply: [{ $divide: ["$completed", "$total"] }, 100] } } },
//           ],
//         },
//       },
//     ]);

//     const result = stats[0];

//     return {
//       total: result.total[0]?.count || 0,
//       status: {
//         active: result.byStatus.find((s: any) => s._id === "active")?.count || 0,
//         completed: result.byStatus.find((s: any) => s._id === "completed")?.count || 0,
//         cancelled: result.byStatus.find((s: any) => s._id === "cancelled")?.count || 0,
//       },
//       payment: {
//         paid: result.byPaymentStatus.find((p: any) => p._id === "paid")?.count || 0,
//         pending: result.byPaymentStatus.find((p: any) => p._id === "pending")?.count || 0,
//         failed: result.byPaymentStatus.find((p: any) => p._id === "failed")?.count || 0,
//       },
//       paymentMethods: {
//         alipay: result.byPaymentMethod.find((m: any) => m._id === "alipay")?.count || 0,
//         wechat: result.byPaymentMethod.find((m: any) => m._id === "wechat")?.count || 0,
//       },
//       thisMonth: result.thisMonth[0]?.count || 0,
//       completionRate: result.completionRate[0]?.rate?.toFixed(2) || 0,
//     };
//   }

//   // 💰 Revenue Stats
//   async getRevenueStats() {
//     const stats = await Enrollment.aggregate([
//       { $match: { paymentStatus: "paid" } },
//       { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
//       { $unwind: "$courseDetails" },
//       { $group: { 
//           _id: null,
           
//           totalRevenue: { $sum: { $cond: ["$courseDetails.isDiscounted", "$courseDetails.discountPrice", "$courseDetails.price"] } },
//           totalTransactions: { $sum: 1 },
//           averageOrderValue: { $avg: { $cond: ["$courseDetails.isDiscounted", "$courseDetails.discountPrice", "$courseDetails.price"] } },
//       } },
//     ]);

//     const monthlyRevenue = await Enrollment.aggregate([
//       { $match: { paymentStatus: "paid", enrolledAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
//       { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
//       { $unwind: "$courseDetails" },
//       { $group: { _id: null, monthlyRevenue: { $sum: { $cond: ["$courseDetails.isDiscounted", "$courseDetails.discountPrice", "$courseDetails.price"] } } } },
//     ]);

//     return {
//       totalRevenue: stats[0]?.totalRevenue?.toFixed(2) || 0,
//       totalTransactions: stats[0]?.totalTransactions || 0,
//       averageOrderValue: stats[0]?.averageOrderValue?.toFixed(2) || 0,
//       monthlyRevenue: monthlyRevenue[0]?.monthlyRevenue?.toFixed(2) || 0,
//       currency: "USD",
//     };
//   }

//   // 🔥 Popular Courses
//   async getPopularCourses(limit: number = 10) {
//     return await Course.find({ status: "published" })
//       .select("title slug totalEnrolled averageRating price thumbnail")
//       .sort({ totalEnrolled: -1, averageRating: -1 })
//       .limit(limit)
//       .lean();
//   }



//   // 🕐 Recent Enrollments
//   async getRecentEnrollments(limit: number = 10) {
//     return await Enrollment.find()
//       .populate("user", "name email profile")
//       .populate("course", "title slug thumbnail price")
//       .sort({ enrolledAt: -1 })
//       .limit(limit)
//       .lean();
//   }

//   // 📈 Content Stats
//   async getContentStats() {
//     const [milestoneCount, lessonCount, lessonsByType] = await Promise.all([
//       Milestone.countDocuments(),
//       Lesson.countDocuments(),
//       Lesson.aggregate([{ $group: { _id: "$contentType", count: { $sum: 1 } } }]),
//     ]);

//     return {
//       totalMilestones: milestoneCount,
//       totalLessons: lessonCount,
//       lessonTypes: {
//         video: lessonsByType.find((l: any) => l._id === "video")?.count || 0,
//         doc: lessonsByType.find((l: any) => l._id === "doc")?.count || 0,
//         quiz: lessonsByType.find((l: any) => l._id === "quiz")?.count || 0,
//         assignment: lessonsByType.find((l: any) => l._id === "assignment")?.count || 0,
//       },
//     };
//   }

//   // 📊 Growth Analytics
//   async getGrowthAnalytics() {
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
//     const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

//     const [userGrowth, enrollmentGrowth] = await Promise.all([
//       User.aggregate([
//         { $match: { createdAt: { $gte: sixMonthsAgo } } },
//         { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
//         { $sort: { "_id.month": 1 } },
//       ]),
//       Enrollment.aggregate([
//         { $match: { enrolledAt: { $gte: sixMonthsAgo } } },
//         { $group: { _id: { month: { $month: "$enrolledAt" } }, count: { $sum: 1 } } },
//         { $sort: { "_id.month": 1 } },
//       ]),
//     ]);

//     const userGrowthByMonth: GrowthData[] = userGrowth.map(i => ({ month: monthNames[i._id.month-1], count: i.count }));
//     const enrollmentGrowthByMonth: GrowthData[] = enrollmentGrowth.map(i => ({ month: monthNames[i._id.month-1], count: i.count }));

//     return { userGrowth: userGrowthByMonth, enrollmentGrowth: enrollmentGrowthByMonth };
//   }

//   // 📋 Comprehensive Dashboard Data - Last 10 Enrollments, Popular Courses, User Stats, Earnings with Monthly Chart
//   async getComprehensiveDashboard() {
//     const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

//     const [
//       recentEnrollments,
//       popularCourses,
//       userStats,
//       totalEarnings,
//       monthlyEarningsData,
//     ] = await Promise.all([
//       // Last 10 Enrollments
//       Enrollment.find()
//         .populate("user", "name email profile")
//         .populate("course", "title slug thumbnail price")
//         .sort({ enrolledAt: -1 })
//         .limit(10)
//         .lean(),

//       // Popular Courses
//       Course.find({ status: "published" })
//         .select("title slug totalEnrolled averageRating price thumbnail")
//         .sort({ totalEnrolled: -1, averageRating: -1 })
//         .limit(10)
//         .lean(),

//       // All User Stats
//       User.aggregate([
//         {
//           $facet: {
//             total: [{ $count: "count" }],
//             byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
//             byStatus: [
//               {
//                 $group: {
//                   _id: null,
//                   active: { $sum: { $cond: ["$isActive", 1, 0] } },
//                   inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
//                   verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
//                   unverified: { $sum: { $cond: ["$isVerified", 0, 1] } },
//                 },
//               },
//             ],
//           },
//         },
//       ]),

//       // Total Earnings from Enrollments
//       Enrollment.aggregate([
//         { $match: { paymentStatus: "paid" } },
//         { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
//         { $unwind: "$courseDetails" },
//         { $group: {
//             _id: null,
//             totalEarnings: { $sum: { $cond: ["$courseDetails.isDiscounted", "$courseDetails.discountPrice", "$courseDetails.price"] } },
//             totalTransactions: { $sum: 1 },
//           }
//         },
//       ]),

//       // Monthly Earnings Chart Data (Last 12 months)
//       Enrollment.aggregate([
//         { $match: { paymentStatus: "paid", enrolledAt: { $gte: oneYearAgo } } },
//         { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
//         { $unwind: "$courseDetails" },
//         { $group: {
//             _id: { month: { $month: "$enrolledAt" }, year: { $year: "$enrolledAt" } },
//             monthlyEarnings: { $sum: { $cond: ["$courseDetails.isDiscounted", "$courseDetails.discountPrice", "$courseDetails.price"] } },
//             transactionCount: { $sum: 1 },
//           }
//         },
//         { $sort: { "_id.year": 1, "_id.month": 1 } },
//       ]),
//     ]);

//     const userStatsResult = userStats[0];

//     const monthlyEarningsChart: any[] = monthlyEarningsData.map(item => ({
//       month: monthNames[item._id.month - 1],
//       earnings: item.monthlyEarnings?.toFixed(2) || 0,
//       transactions: item.transactionCount,
//     }));

//     return {
//       success: true,
//       data: {
//         recentEnrollments: recentEnrollments,
//         popularCourses: popularCourses,
//         userStats: {
//           total: userStatsResult.total[0]?.count || 0,
//           roles: {
//             students: userStatsResult.byRole.find((r: any) => r._id === "student")?.count || 0,
//             instructors: userStatsResult.byRole.find((r: any) => r._id === "instructor")?.count || 0,
//             admins: userStatsResult.byRole.find((r: any) => r._id === "admin")?.count || 0,
//             superAdmins: userStatsResult.byRole.find((r: any) => r._id === "super_admin")?.count || 0,
//           },
//           status: {
//             active: userStatsResult.byStatus[0]?.active || 0,
//             inactive: userStatsResult.byStatus[0]?.inactive || 0,
//             verified: userStatsResult.byStatus[0]?.verified || 0,
//             unverified: userStatsResult.byStatus[0]?.unverified || 0,
//           },
//         },
//         earnings: {
//           totalEarnings: totalEarnings[0]?.totalEarnings?.toFixed(2) || 0,
//           totalTransactions: totalEarnings[0]?.totalTransactions || 0,
//           currency: "USD",
//         },
//         monthlyEarningsChart: monthlyEarningsChart,
//         timestamp: new Date(),
//       },
//     };
//   }
// }

// export default new OverviewService();


import User from "../auth/User.model";
import Course from "../course/Course.model";
import Enrollment from "../enrollment/Enrollment.model";

interface MonthlyChartData {
  month: string;
  enrollments: number;
  earnings: number;
}

class OverviewService {
  /**
   * 📊 Get Dashboard Overview
   * Returns: userStats, last 5 enrollments, top 3 courses, monthly chart, summary stats
   */
  async getDashboardOverview() {
    const [
      userStats,
      recentEnrollments,
      popularCourses,
      summaryStats,
      monthlyChartData,
    ] = await Promise.all([
      this.getUserStats(),
      this.getRecentEnrollments(),
      this.getPopularCourses(),
      this.getSummaryStats(),
      this.getMonthlyChartData(),
    ]);

    return {
      success: true,
      data: {
        userStats,
        recentEnrollments,
        popularCourses,
        summary: summaryStats,
        monthlyChart: monthlyChartData,
        timestamp: new Date(),
      },
    };
  }

  /**
   * 👥 User Statistics
   */
  private async getUserStats() {
    const stats = await User.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
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
        },
      },
    ]);

    const result = stats[0];

    return {
      total: result.total[0]?.count || 0,
      roles: {
        students: result.byRole.find((r: any) => r._id === "student")?.count || 0,
        instructors: result.byRole.find((r: any) => r._id === "instructor")?.count || 0,
        admins: result.byRole.find((r: any) => r._id === "admin")?.count || 0,
        superAdmins: result.byRole.find((r: any) => r._id === "super_admin")?.count || 0,
      },
      status: {
        active: result.byStatus[0]?.active || 0,
        inactive: result.byStatus[0]?.inactive || 0,
        verified: result.byStatus[0]?.verified || 0,
        unverified: result.byStatus[0]?.unverified || 0,
      },
    };
  }

  /**
   * 🕐 Last 5 Enrollments
   */
  private async getRecentEnrollments() {
    return await Enrollment.find()
      .populate("user", "name email profile")
      .populate("course", "title slug thumbnail")
      .select("user course status enrolledAt finalAmount paymentStatus")
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean();
  }

  /**
   * 🔥 Top 3 Popular Courses (by totalEnrolled)
   */
  private async getPopularCourses() {
    return await Course.find({ status: "published" })
      .select("title slug thumbnail totalEnrolled averageRating price isDiscounted discountPrice")
      .sort({ totalEnrolled: -1 })
      .limit(3)
      .lean();
  }

  /**
   * 📈 Summary Statistics
   */
  private async getSummaryStats() {
    const [totalEarnings, totalStudents, totalCourses] = await Promise.all([
      // Total Earnings from completed payments
      Enrollment.aggregate([
        { $match: { paymentStatus: "completed" } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$finalAmount" },
            totalTransactions: { $sum: 1 },
          },
        },
      ]),

      // Total Students (users with student role)
      User.countDocuments({ role: "student" }),

      // Total Published Courses
      Course.countDocuments({ status: "published" }),
    ]);

    return {
      totalEarnings: totalEarnings[0]?.totalEarnings?.toFixed(2) || "0.00",
      totalTransactions: totalEarnings[0]?.totalTransactions || 0,
      totalStudents,
      totalCourses,
      currency: "USD",
    };
  }

  /**
   * 📊 Monthly Chart Data (Last 12 Months)
   * Returns enrollments count and earnings per month
   */
  private async getMonthlyChartData(): Promise<MonthlyChartData[]> {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Get monthly enrollments and earnings
    const monthlyData = await Enrollment.aggregate([
      { $match: { enrolledAt: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$enrolledAt" },
            year: { $year: "$enrolledAt" },
          },
          enrollments: { $sum: 1 },
          earnings: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "completed"] },
                "$finalAmount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format the data
    const chartData: MonthlyChartData[] = monthlyData.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      enrollments: item.enrollments,
      earnings: parseFloat(item.earnings.toFixed(2)),
    }));

    return chartData;
  }
}













export default new OverviewService();


