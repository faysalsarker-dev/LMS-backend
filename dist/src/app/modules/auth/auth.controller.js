"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("./../../utils/setCookie");
exports.AuthController = {
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
        const { email, password, remember } = req.body;
        const { user, accessToken, refreshToken } = await auth_service_1.userService.login(email, password, Boolean(remember));
        (0, setCookie_1.setCookie)(res, accessToken, refreshToken);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: user,
        });
    }),
    logout: (0, catchAsync_1.catchAsync)(async (_req, res) => {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Logged out successfully",
        });
    }),
    me: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const { courses, wishlist } = req.query;
        const result = await auth_service_1.userService.getMe(userId, courses === 'true', wishlist === 'true');
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Your profile retrieved successfully",
            data: result,
        });
    }),
    sendOtp: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const email = req.body.email;
        const result = await auth_service_1.userService.sendOtp(email);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "OTP Send Successfully",
            data: result
        });
    }),
    addToWishlist: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = req.user._id;
        const result = await auth_service_1.userService.addToWishlist(id, req.body.courseId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Logged out successfully",
            data: result
        });
    }),
    verifyOtp: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { email, otp } = req.body;
        const result = await auth_service_1.userService.verifyOtp(email, otp);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Your Account Verify Successfully",
            data: result
        });
    }),
    forgetPassword: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { email } = req.body;
        const result = await auth_service_1.userService.forgotPassword(email);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Password reset link sent to email",
            data: result
        });
    }),
    resetPassword: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { id, token, newPassword } = req.body;
        const result = await auth_service_1.userService.resetPassword(id, token, newPassword);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Your profile Retrieved Successfully",
            data: result
        });
    }),
    getNewAccessToken: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        const { accessToken } = await auth_service_1.userService.refreshToken(refreshToken);
        (0, setCookie_1.setCookie)(res, accessToken);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Token refreshed successfully",
            data: { accessToken },
        });
    }),
    updatePassword: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id;
        const user = await auth_service_1.userService.updatePassword(userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Password updated successfully",
            data: user,
        });
    }),
    updateProfile: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id;
        const payload = {
            ...req.body,
            profile: req.file?.path
        };
        const user = await auth_service_1.userService.updateProfile(userId, payload);
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
    getAll: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.userService.getAll(req);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Users fetched successfully",
            data: result,
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
