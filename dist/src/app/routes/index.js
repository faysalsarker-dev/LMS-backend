"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const course_routes_1 = __importDefault(require("../modules/course/course.routes"));
const milestone_routes_1 = __importDefault(require("../modules/milestone/milestone.routes"));
const lesson_route_1 = __importDefault(require("../modules/lesson/lesson.route"));
const progress_route_1 = __importDefault(require("../modules/progress/progress.route"));
const enrollment_route_1 = __importDefault(require("../modules/enrollment/enrollment.route"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const appConfig_routes_1 = __importDefault(require("../modules/appSetting/appConfig.routes"));
const category_routes_1 = __importDefault(require("../modules/category/category.routes"));
const overview_routes_1 = __importDefault(require("../modules/overview/overview.routes"));
const testimonial_routes_1 = __importDefault(require("../modules/testimonial/testimonial.routes"));
const agt_route_1 = __importDefault(require("../modules/agt/agt.route"));
const promo_routes_1 = __importDefault(require("../modules/promoCode/promo.routes"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: auth_route_1.default
    },
    {
        path: "/course",
        route: course_routes_1.default
    },
    {
        path: "/milestone",
        route: milestone_routes_1.default
    },
    {
        path: "/lesson",
        route: lesson_route_1.default
    },
    {
        path: "/progress",
        route: progress_route_1.default
    },
    {
        path: "/enrolment",
        route: enrollment_route_1.default
    },
    {
        path: "/category",
        route: category_routes_1.default
    },
    {
        path: "/assignment",
        route: agt_route_1.default
    },
    {
        path: "/promo",
        route: promo_routes_1.default
    },
    {
        path: "/testimonial",
        route: testimonial_routes_1.default
    },
    {
        path: "/overview",
        route: overview_routes_1.default
    },
    {
        path: "/app-config",
        route: appConfig_routes_1.default
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
