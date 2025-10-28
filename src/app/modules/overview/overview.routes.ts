import { Router } from "express";
import AdminDashboardController from "./overview.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";


const router = Router();

// All routes protected by adminAuth middleware
// router.use(checkAuth([UserRoles.SUPER_ADMIN]));

router.get("/dashboard", AdminDashboardController.getDashboard);
router.get("/users", AdminDashboardController.getUsers);
router.get("/courses", AdminDashboardController.getCourses);
router.get("/enrollments", AdminDashboardController.getEnrollments);
router.get("/revenue", AdminDashboardController.getRevenue);
router.get("/popular-courses", AdminDashboardController.getPopularCourses);
router.get("/top-instructors", AdminDashboardController.getTopInstructors);
router.get("/recent-enrollments", AdminDashboardController.getRecentEnrollments);
router.get("/content-stats", AdminDashboardController.getContentStats);
router.get("/growth-analytics", AdminDashboardController.getGrowthAnalytics);

export default router;
