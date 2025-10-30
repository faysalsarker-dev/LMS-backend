"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const overview_controller_1 = __importDefault(require("./overview.controller"));
const router = (0, express_1.Router)();
// All routes protected by adminAuth middleware
// router.use(checkAuth([UserRoles.SUPER_ADMIN]));
router.get("/dashboard", overview_controller_1.default.getDashboard);
router.get("/users", overview_controller_1.default.getUsers);
router.get("/courses", overview_controller_1.default.getCourses);
router.get("/enrollments", overview_controller_1.default.getEnrollments);
router.get("/revenue", overview_controller_1.default.getRevenue);
router.get("/popular-courses", overview_controller_1.default.getPopularCourses);
router.get("/top-instructors", overview_controller_1.default.getTopInstructors);
router.get("/recent-enrollments", overview_controller_1.default.getRecentEnrollments);
router.get("/content-stats", overview_controller_1.default.getContentStats);
router.get("/growth-analytics", overview_controller_1.default.getGrowthAnalytics);
exports.default = router;
