
import bcrypt from "bcryptjs";
import { IUser } from "./auth.interface";
import User from "./User.model";
import { ApiError } from "../../errors/ApiError";
import config from "../../config/config";
import { generateToken, verifyToken } from './../../utils/jwt';


export const userService = {

  async register(data: Partial<IUser>) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new ApiError(400, "Email already exists");
    }

    const user = new User(data);
    await user.save();
    return user;
  },


  async login(username: string, password: string, ip?: string, userAgent?: string) {
    const user = await User.findOne({ username }).select("+password");
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    // generate tokens
    const accessToken = generateToken({ id: user._id, ...user }, config.jwt.access_expires_in);
    const refreshToken = generateToken({ id: user._id, ...user }, config.jwt.refresh_expires_in);

    // update login data
    // user.lastLogin = new Date();
    // user.loginDevice = { ip, userAgent };
    // user.currentToken = accessToken;
    // user.refreshToken = refreshToken;
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

  /** 🔹 Refresh access token */
  // async refreshToken(token: string) {
  //   const payload: any = verifyToken(token);
  //   const user = await User.findById(payload.id).select("+refreshToken");

  //   // if (!user || user.refreshToken !== token) {
  //   //   throw new ApiError(401, "Invalid refresh token");
  //   // }

  //   const accessToken = generateToken({ id: user._id, role: user.role });
  //   user.currentToken = accessToken;
  //   await user.save();

  //   return { accessToken };
  // },

  /** 🔹 Update user profile */
  async updateProfile(userId: string, updates: Partial<IUser>) {
    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    return User.findByIdAndUpdate(userId, updates, { new: true });
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
