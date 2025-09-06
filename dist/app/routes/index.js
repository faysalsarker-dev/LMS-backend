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
// import UserRoute from "../modules/user/user.routes"
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    // {
    //     path: "/user",
    //     route: UserRoute
    // },
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
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
