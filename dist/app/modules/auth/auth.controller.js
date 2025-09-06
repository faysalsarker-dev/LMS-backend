"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
exports.userController = {
    register: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = await auth_service_1.userService.register(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }),
    login: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { username, password } = req.body;
        const ip = req.ip;
        const userAgent = req.headers["user-agent"] || "";
        const { user, accessToken, refreshToken } = await auth_service_1.userService.login(username, password, ip, userAgent);
        (0, setCookie_1.setCookie)(res, accessToken);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: { user, accessToken, refreshToken },
        });
    }),
    logout: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user.id; // from auth middleware
        await auth_service_1.userService.logout(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Logged out successfully",
        });
    }),
    refreshToken: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { refreshToken } = req.body;
        const { accessToken } = await auth_service_1.userService.refreshToken(refreshToken);
        (0, setCookie_1.setCookie)(res, accessToken);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Token refreshed successfully",
            data: { accessToken },
        });
    }),
    updateProfile: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user.id;
        const user = await auth_service_1.userService.updateProfile(userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    }),
    getUser: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = await auth_service_1.userService.getUserById(req.params.id);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    }),
    deleteUser: (0, catchAsync_1.catchAsync)(async (req, res) => {
        await auth_service_1.userService.deleteUser(req.params.id);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "User deleted successfully",
        });
    }),
};
