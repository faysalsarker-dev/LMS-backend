"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const course_routes_1 = __importDefault(require("../modules/course/course.routes"));
const milestone_routes_1 = __importDefault(require("../modules/milestone/milestone.routes"));
const module_routes_1 = __importDefault(require("../modules/module/module.routes"));
const quiz_routes_1 = __importDefault(require("../modules/quiz/quiz.routes"));
// import UserProgressRoutes from "../modules/progress/userProgress.routes"
const enrollment_route_1 = __importDefault(require("../modules/enrollment/enrollment.route"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
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
        path: "/module",
        route: module_routes_1.default
    },
    {
        path: "/quiz",
        route: quiz_routes_1.default
    },
    //    {
    //        path: "/progress",
    //        route: UserProgressRoutes
    //    },
    {
        path: "/enrollment",
        route: enrollment_route_1.default
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
