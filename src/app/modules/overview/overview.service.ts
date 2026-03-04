

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
   * 📊 Get Dashboard Overview (MVP)
   * Returns minimal payload: total users, recent enrollments, popular courses,
   * monthly chart and earnings grouped by currency.
   */
  async getDashboardOverview() {
    const [
      totalUsers,
      totalCourses,
      recentEnrollments,
      popularCourses,
      monthlyChartData,
      earningsByCurrency,
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getTotalCourses(),
      this.getRecentEnrollments(),
      this.getPopularCourses(),
      this.getMonthlyChartData(),
      this.getTotalEarningsByCurrency(),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalCourses,
        recentEnrollments,
        popularCourses,
        monthlyChart: monthlyChartData,
        totalEarningsByCurrency: earningsByCurrency,
        timestamp: new Date(),
      },
    };
  }

  // removed: detailed user stats in MVP

  /**
   * 📚 total number of published courses
   */
  private async getTotalCourses() {
    return await Course.countDocuments({ status: "published" });
  }

  /**
   * 🧑‍🤝‍🧑 Total users count
   */
  private async getTotalUsers() {
    return await User.countDocuments();
  }

  /**
   * 🕐 Last 5 Enrollments
   */
  private async getRecentEnrollments() {
    return await Enrollment.find()
      .populate("user", "name email profile")
      .populate("course", "title slug thumbnail")
      .select("user course status enrolledAt currency amount paymentStatus transactionId")
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean();
  }

  /**
   * 🔥 Top 3 Popular Courses (by totalEnrolled)
   */
  private async getPopularCourses() {
    return await Course.find({ status: "published" })
      .select("title slug thumbnail totalEnrolled averageRating price isDiscounted discountPrice currency")
      .sort({ totalEnrolled: -1 })
      .limit(3)
      .lean();
  }

  /**
   * 💰 Sum of completed enrollments grouped by currency
   */
  private async getTotalEarningsByCurrency() {
    const results = await Enrollment.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: "$currency", total: { $sum: "$amount" } } },
    ]);

    return results.map((r: any) => ({
      currency: r._id,
      total: parseFloat(r.total.toFixed(2)),
    }));
  }

  // summary stats removed for MVP

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
                "$amount",
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


