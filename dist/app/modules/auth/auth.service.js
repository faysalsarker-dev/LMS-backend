"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = __importDefault(require("./User.model"));
const ApiError_1 = require("../../errors/ApiError");
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../config/config"));
exports.userService = {
    /** 🔹 Register a new user */
    async register(data) {
        const existing = await User_model_1.default.findOne({ username: data.username });
        if (existing) {
            throw new ApiError_1.ApiError(400, "Username already exists");
        }
        const user = new User_model_1.default(data);
        await user.save();
        return user;
    },
    /** 🔹 Login user */
    async login(username, password, ip, userAgent) {
        const user = await User_model_1.default.findOne({ username }).select("+password");
        if (!user)
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        // generate tokens
        const accessToken = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
        const refreshToken = (0, jwt_1.generateToken)({ id: user._id }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
        // update login data
        user.lastLogin = new Date();
        user.loginDevice = { ip, userAgent };
        user.currentToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
        return { user, accessToken, refreshToken };
    },
    /** 🔹 Logout user */
    async logout(userId) {
        return User_model_1.default.findByIdAndUpdate(userId, { currentToken: null, refreshToken: null }, { new: true });
    },
    /** 🔹 Refresh access token */
    async refreshToken(token) {
        const payload = (0, jwt_1.verifyToken)(token, config_1.default.jwt.refresh_secret);
        const user = await User_model_1.default.findById(payload.id).select("+refreshToken");
        if (!user || user.refreshToken !== token) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const accessToken = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
        user.currentToken = accessToken;
        await user.save();
        return { accessToken };
    },
    /** 🔹 Update user profile */
    async updateProfile(userId, updates) {
        if (updates.password) {
            const salt = await bcryptjs_1.default.genSalt(12);
            updates.password = await bcryptjs_1.default.hash(updates.password, salt);
        }
        return User_model_1.default.findByIdAndUpdate(userId, updates, { new: true });
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
