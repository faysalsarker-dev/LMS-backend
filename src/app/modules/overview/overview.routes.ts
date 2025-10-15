import { Router } from "express";
import OverviewController from "./overview.controller";


const router = Router();



router.get("/dashboard", OverviewController.getDashboard);

router.get("/users", OverviewController.getUserStats);

router.get("/courses", OverviewController.getCourseStats);

router.get("/enrollments", OverviewController.getEnrollmentStats);

router.get("/revenue", OverviewController.getRevenueStats);

router.get("/popular-courses", OverviewController.getPopularCourses);

router.get("/recent-enrollments", OverviewController.getRecentEnrollments);

router.get("/content", OverviewController.getContentStats);

router.get("/growth", OverviewController.getGrowthAnalytics);

export default router;