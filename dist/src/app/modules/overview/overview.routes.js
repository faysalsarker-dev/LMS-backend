"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const overview_controller_1 = __importDefault(require("./overview.controller"));
const router = (0, express_1.Router)();
router.get("/dashboard", overview_controller_1.default.getDashboard);
router.get("/users", overview_controller_1.default.getUserStats);
router.get("/courses", overview_controller_1.default.getCourseStats);
router.get("/enrollments", overview_controller_1.default.getEnrollmentStats);
router.get("/revenue", overview_controller_1.default.getRevenueStats);
router.get("/popular-courses", overview_controller_1.default.getPopularCourses);
router.get("/recent-enrollments", overview_controller_1.default.getRecentEnrollments);
router.get("/content", overview_controller_1.default.getContentStats);
router.get("/growth", overview_controller_1.default.getGrowthAnalytics);
exports.default = router;
