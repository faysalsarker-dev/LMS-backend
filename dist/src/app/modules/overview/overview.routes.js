"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const overview_controller_1 = __importDefault(require("./overview.controller"));
const CheckAuth_1 = require("../../middleware/CheckAuth");
const auth_interface_1 = require("../auth/auth.interface");
const router = (0, express_1.Router)();
router.get("/dashboard", (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.SUPER_ADMIN]), overview_controller_1.default.getDashboard);
exports.default = router;
