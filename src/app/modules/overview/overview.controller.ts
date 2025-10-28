import { Request, Response } from "express";
import OverviewService from "./overview.service";

class AdminDashboardController {
  // GET /api/admin/dashboard
  async getDashboard(req: Request, res: Response) {
    try {
      const stats = await OverviewService.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      console.error("Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard stats",
        error: error.message,
      });
    }
  }

  // GET /api/admin/users
  async getUsers(req: Request, res: Response) {
    try {
      const users = await OverviewService.getUserStats();
      return res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/courses
  async getCourses(req: Request, res: Response) {
    try {
      const courses = await OverviewService.getCourseStats();
      return res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/enrollments
  async getEnrollments(req: Request, res: Response) {
    try {
      const enrollments = await OverviewService.getEnrollmentStats();
      return res.status(200).json({ success: true, data: enrollments });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/revenue
  async getRevenue(req: Request, res: Response) {
    try {
      const revenue = await OverviewService.getRevenueStats();
      return res.status(200).json({ success: true, data: revenue });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/popular-courses
  async getPopularCourses(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const courses = await OverviewService.getPopularCourses(limit);
      return res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/top-instructors
  async getTopInstructors(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 5;
      const instructors = await OverviewService.getTopInstructors(limit);
      return res.status(200).json({ success: true, data: instructors });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/recent-enrollments
  async getRecentEnrollments(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const enrollments = await OverviewService.getRecentEnrollments(limit);
      return res.status(200).json({ success: true, data: enrollments });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/content-stats
  async getContentStats(req: Request, res: Response) {
    try {
      const stats = await OverviewService.getContentStats();
      return res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/growth-analytics
  async getGrowthAnalytics(req: Request, res: Response) {
    try {
      const analytics = await OverviewService.getGrowthAnalytics();
      return res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AdminDashboardController();
