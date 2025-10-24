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
const email_1 = require("../../utils/email");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const mongoose_1 = __importDefault(require("mongoose"));
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
            otpExpiry,
        });
        await user.save();
        return user;
    },
    async sendOtp(email) {
        const user = await User_model_1.default.findOne({ email });
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        if (user.isVerified) {
            throw new ApiError_1.ApiError(400, "Account already verified");
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        console.log(user);
        await user.save();
        await (0, email_1.sendOtpEmail)(user.email, otp);
        return { message: "OTP sent successfully", email: user.email };
    },
    async verifyOtp(email, otp) {
        const user = await User_model_1.default.findOne({ email }).select({ otp: 1, otpExpiry: 1 });
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        if (user.isVerified) {
            throw new ApiError_1.ApiError(400, "Account already verified");
        }
        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            throw new ApiError_1.ApiError(400, "OTP expired or not generated");
        }
        if (user.otp !== otp) {
            throw new ApiError_1.ApiError(400, "Invalid OTP");
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return { message: "Account verified successfully", email: user.email };
    },
    async login(email, password, remember) {
        const user = await User_model_1.default.findOne({ email }).select("+password");
        if (!user)
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        if (user && !user.isVerified)
            throw new ApiError_1.ApiError(401, "Account is not verified");
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        const refreshToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, config_1.default.jwt.refresh_expires_in);
        const accessToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, config_1.default.jwt.access_expires_in);
        await user.save();
        return { user, accessToken, refreshToken };
    },
    async logout(userId) {
        return User_model_1.default.findByIdAndUpdate(userId, { currentToken: null, refreshToken: null }, { new: true });
    },
    async refreshToken(token) {
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await User_model_1.default.findById(payload?._doc?._id);
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const accessToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, config_1.default.jwt.access_expires_in);
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
        const user = await User_model_1.default.findById(userId);
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        const oldProfile = user.profile;
        const updatedUser = await User_model_1.default.findByIdAndUpdate(userId, updates, { new: true });
        if (updates.profile && oldProfile) {
            try {
                await (0, cloudinary_config_1.deleteImageFromCLoudinary)(oldProfile);
            }
            catch (err) {
                console.error("Failed to delete old image:", err);
            }
        }
        return updatedUser;
    },
    async getMe(userId, includeCourses = false, includeWishlist = false) {
        let query = User_model_1.default.findById(userId);
        if (includeCourses)
            query = query.populate("courses");
        if (includeWishlist)
            query = query.populate("wishlist");
        const user = await query.exec();
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        return user;
    },
    async getAll(req) {
        const { page = "1", limit = "10", search, role, isVerified, isActive, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNumber = Math.max(1, parseInt(page, 10));
        const limitNumber = Math.max(1, parseInt(limit, 10));
        const skip = (pageNumber - 1) * limitNumber;
        // 🔹 Build filter object
        const filter = {};
        if (role)
            filter.role = role;
        if (isVerified !== undefined)
            filter.isVerified = isVerified === "true";
        if (isActive !== undefined)
            filter.isActive = isActive === "true";
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        // 🔹 Sorting
        const sortOptions = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };
        const [users, total] = await Promise.all([
            User_model_1.default.find(filter)
                .populate({
                path: "courses",
                select: "title thumbnail",
            })
                .skip(skip)
                .limit(limitNumber)
                .sort(sortOptions),
            User_model_1.default.countDocuments(filter),
        ]);
        if (!users.length)
            throw new ApiError_1.ApiError(404, "No users found");
        return {
            meta: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
            data: users,
        };
    },
    async addToWishlist(id, courseId) {
        const user = await User_model_1.default.findById(id);
        if (!user)
            throw new Error("User not found");
        // Convert to ObjectId
        const courseObjectId = new mongoose_1.default.Types.ObjectId(courseId);
        const isAlreadyInWishlist = user.wishlist.some((item) => item.equals(courseObjectId));
        let updatedUser;
        if (isAlreadyInWishlist) {
            // 🔹 Remove if exists
            updatedUser = await User_model_1.default.findByIdAndUpdate(id, { $pull: { wishlist: courseObjectId } }, { new: true });
        }
        else {
            // 🔹 Add if not exists
            updatedUser = await User_model_1.default.findByIdAndUpdate(id, { $push: { wishlist: courseObjectId } }, { new: true });
        }
        return updatedUser;
    },
    async forgotPassword(email) {
        const user = await User_model_1.default.findOne({ email });
        if (!user)
            throw new ApiError_1.ApiError(404, "User does not exist");
        if (!user.isVerified)
            throw new ApiError_1.ApiError(400, "User is not verified");
        if (!user.isActive) {
            throw new ApiError_1.ApiError(400, `User is ${user.isActive}`);
        }
        const resetToken = (0, jwt_1.generateToken)({ id: user._id, ...user }, "10m");
        const resetLink = `${config_1.default.frontend_url}/reset-password?id=${user._id}&token=${resetToken}`;
        await (0, email_1.sendLinkEmail)(email, resetLink);
        return { message: "Password reset link sent to email" };
    },
    async resetPassword(id, token, newPassword) {
        try {
            // Verify token
            const decoded = (0, jwt_1.verifyToken)(token);
            if (!decoded) {
                throw new ApiError_1.ApiError(400, "Invalid reset token");
            }
            if (decoded.id !== id) {
                throw new ApiError_1.ApiError(400, "Invalid reset token");
            }
            const user = await User_model_1.default.findById(id).select("+password");
            if (!user)
                throw new ApiError_1.ApiError(404, "User not found");
            user.password = newPassword;
            await user.save();
            return { message: "Password reset successfully", email: user.email };
        }
        catch (err) {
            throw new ApiError_1.ApiError(400, "Invalid or expired reset token");
        }
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
