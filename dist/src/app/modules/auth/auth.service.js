"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = __importDefault(require("./User.model"));
const ApiError_1 = require("../../errors/ApiError");
const config_1 = __importDefault(require("../../config/config"));
const jwt_1 = require("./../../utils/jwt");
const otpGenerator_1 = require("../../utils/otpGenerator");
exports.userService = {
    async register(data) {
        const existing = await User_model_1.default.findOne({ email: data.email });
        if (existing && existing.isVerified) {
            throw new ApiError_1.ApiError(400, "Email already exists");
        }
        if (existing && !existing.isVerified) {
            throw new ApiError_1.ApiError(400, "Account is not verified");
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const user = new User_model_1.default({
            ...data,
            otp,
            otpExpiry
        });
        await user.save();
        return user;
    },
    async login(email, password) {
        const user = await User_model_1.default.findOne({ email }).select("+password");
        if (!user)
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        if (user && !user.isVerified)
            throw new ApiError_1.ApiError(401, "Account is not verified");
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        const accessToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, config_1.default.jwt.access_expires_in);
        const refreshToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, config_1.default.jwt.refresh_expires_in);
        await user.save();
        return { user, accessToken, refreshToken };
    },
    async logout(userId) {
        return User_model_1.default.findByIdAndUpdate(userId, { currentToken: null, refreshToken: null }, { new: true });
    },
    async refreshToken(token) {
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await User_model_1.default.findById(payload.id).select("+refreshToken");
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const accessToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, config_1.default.jwt.access_expires_in);
        await user.save();
        return { accessToken };
    },
    /** 🔹 Update user password */
    async updatePassword(userId, updates) {
        if (updates.password) {
            const salt = await bcryptjs_1.default.genSalt(12);
            updates.password = await bcryptjs_1.default.hash(updates.password, salt);
        }
        return User_model_1.default.findByIdAndUpdate(userId, updates, { new: true });
    },
    async updateProfile(userId, updates) {
        return User_model_1.default.findByIdAndUpdate(userId, updates, { new: true });
    },
    async getMe(userId) {
        const user = await User_model_1.default.findById(userId);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        return user;
    },
    /** 🔹 Find user by ID */
    async getUserById(userId) {
        return User_model_1.default.findById(userId);
    },
    /** 🔹 Delete user */
    async deleteUser(userId) {
        return User_model_1.default.findByIdAndDelete(userId);
    },
};
