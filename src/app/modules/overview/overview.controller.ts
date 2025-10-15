
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import OverviewService from "./overview.service";

class OverviewController {
  // 📊 Get Complete Dashboard Overview
  getDashboard = catchAsync(async (req: Request, res: Response) => {
    const result = await OverviewService.getDashboardStats();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: result.data,
    });
  });

  // 👥 Get User Statistics
  getUserStats = catchAsync(async (req: Request, res: Response) => {
    const userStats = await OverviewService.getUserStats();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User statistics retrieved successfully",
      data: userStats,
    });
  });

  // 📚 Get Course Statistics
  getCourseStats = catchAsync(async (req: Request, res: Response) => {
    const courseStats = await OverviewService.getCourseStats();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course statistics retrieved successfully",
      data: courseStats,
    });
  });

  // 📝 Get Enrollment Statistics
  getEnrollmentStats = catchAsync(async (req: Request, res: Response) => {
    const enrollmentStats = await OverviewService.getEnrollmentStats();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Enrollment statistics retrieved successfully",
      data: enrollmentStats,
    });
  });

  // 💰 Get Revenue Statistics
  getRevenueStats = catchAsync(async (req: Request, res: Response) => {
    const revenueStats = await OverviewService.getRevenueStats();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Revenue statistics retrieved successfully",
      data: revenueStats,
    });
  });

  // 🔥 Get Popular Courses
  getPopularCourses = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const popularCourses = await OverviewService.getPopularCourses(limit);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Popular courses retrieved successfully",
      data: popularCourses,
    });
  });

  // 🕐 Get Recent Enrollments
  getRecentEnrollments = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const recentEnrollments = await OverviewService.getRecentEnrollments(limit);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Recent enrollments retrieved successfully",
      data: recentEnrollments,
    });
  });

  // 📈 Get Content Statistics
  getContentStats = catchAsync(async (req: Request, res: Response) => {
    const contentStats = await OverviewService.getContentStats();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Content statistics retrieved successfully",
      data: contentStats,
    });
  });

  // 📊 Get Growth Analytics
  getGrowthAnalytics = catchAsync(async (req: Request, res: Response) => {
    const growthData = await OverviewService.getGrowthAnalytics();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Growth analytics retrieved successfully",
      data: growthData,
    });
  });
}

export default new OverviewController();