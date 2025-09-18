import bcrypt from "bcryptjs";
import { IUser } from "./auth.interface";
import User from "./User.model";
import { ApiError } from "../../errors/ApiError";
import config from "../../config/config";
import { generateToken, verifyToken } from "./../../utils/jwt";
import { generateOTP } from "../../utils/otpGenerator";
import { sendLinkEmail, sendOtpEmail } from "../../utils/email";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

export const userService = {
  async register(data: Partial<IUser>) {
    const existing = await User.findOne({ email: data.email });
    if (existing && existing.isVerified) {
      throw new ApiError(400, "Email already exists");
    }
    if (existing && !existing.isVerified) {
      throw new ApiError(400, "Account is not verified");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = new User({
      ...data,
      otp,
      otpExpiry,
    });

    await user.save();
    return user;
  },

  async sendOtp(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    if (user.isVerified) {
      throw new ApiError(400, "Account already verified");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    console.log(user);
    await user.save();

    await sendOtpEmail(user.email, otp);

    return { message: "OTP sent successfully", email: user.email };
  },

  async verifyOtp(email: string, otp: string) {
    const user = await User.findOne({ email }).select({ otp: 1, otpExpiry: 1 });

    if (!user) throw new ApiError(404, "User not found");

    if (user.isVerified) {
      throw new ApiError(400, "Account already verified");
    }

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new ApiError(400, "OTP expired or not generated");
    }

    if (user.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: "Account verified successfully", email: user.email };
  },

  async login(email: string, password: string, remember: boolean) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid credentials");
    if (user && !user.isVerified)
      throw new ApiError(401, "Account is not verified");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const refreshToken = generateToken(
      { id: user._id, ...user },
      config.jwt.refresh_expires_in
    );

    const accessToken = generateToken(
      { id: user._id, ...user },
      config.jwt.access_expires_in
    );

    await user.save();

    return { user, accessToken, refreshToken };
  },

  async logout(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      { currentToken: null, refreshToken: null },
      { new: true }
    );
  },

  async refreshToken(token: string) {
    const payload = verifyToken(token) as JwtPayload;
    const user = await User.findById(payload?._doc?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateToken(
      { id: user._id, ...user },
      config.jwt.access_expires_in
    );


    return { accessToken };
  },

  /** 🔹 Update user password */
  async updatePassword(userId: string, updates: Partial<IUser>) {
    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    return User.findByIdAndUpdate(userId, updates, { new: true });
  },

async updateProfile(userId: string, updates: Partial<IUser>) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const oldProfile = user.profile;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

  if (updates.profile && oldProfile) {
    try {
      await deleteImageFromCLoudinary(oldProfile);
    } catch (err) {
      console.error("Failed to delete old image:", err);
    }
  }

  return updatedUser;
},


  async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User does not exist");
    if (!user.isVerified) throw new ApiError(400, "User is not verified");
    if (!user.isActive) {
      throw new ApiError(400, `User is ${user.isActive}`);
    }
    const resetToken = generateToken({ id: user._id, ...user }, "10m");
    const resetLink = `${config.frontend_url}/reset-password?id=${user._id}&token=${resetToken}`;
    await sendLinkEmail(email, resetLink);

    return { message: "Password reset link sent to email" };
  },

  async resetPassword(id: string, token: string, newPassword: string) {
    try {
      // Verify token
      const decoded = verifyToken(token) as JwtPayload;
      if (!decoded) {
        throw new ApiError(400, "Invalid reset token");
      }

      if (decoded.id !== id) {
        throw new ApiError(400, "Invalid reset token");
      }

      const user = await User.findById(id).select("+password");
      if (!user) throw new ApiError(404, "User not found");

      user.password = newPassword;
      await user.save();

      return { message: "Password reset successfully", email: user.email };
    } catch (err) {
      throw new ApiError(400, "Invalid or expired reset token");
    }
  },

  /** 🔹 Find user by ID */
  async getUserById(userId: string) {
    return User.findById(userId);
  },

  /** 🔹 Delete user */
  async deleteUser(userId: string) {
    return User.findByIdAndDelete(userId);
  },
};
