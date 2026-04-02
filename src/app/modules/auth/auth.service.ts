import bcrypt from "bcryptjs";
import { IUser, SessionExpired } from "./auth.interface";
import User from "./User.model";
import { ApiError } from "../../errors/ApiError";
import config from "../../config/config";
import { generateToken, verifyToken } from "./../../utils/jwt";
import { generateOTP } from "../../utils/otpGenerator";
import { sendLinkEmail, sendOtpEmail } from "../../utils/email";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { Request } from "express";
import mongoose, { Query } from "mongoose";
import { generateSessionToken } from "../../utils/sessionToken";
import { clearAuthCookies } from "../../utils/setCookie";
import QueryBuilder from "../../builder/QueryBuilder";

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
    const user = await User.findOne({ email }).select("+password +sessionToken");
    if (!user) throw new ApiError(401, "User Not Found");
    if (user && !user.isVerified)
      throw new ApiError(401, "Account is not verified");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

if (user?.sessionToken) {
  throw new ApiError(
    409,
    "ALREADY_LOGGED_IN.",
  );
}

 



  const sessionToken = generateSessionToken();

user.sessionToken = sessionToken;
  await user.save();

    const refreshToken = generateToken(
      { id: user._id, _id:user._id , role: user.role , profile:user.profile , name:user.name ,email:user.email ,sessionToken },
      config.jwt.refresh_expires_in
    );

    const accessToken = generateToken(
      { id: user._id, _id:user._id , role: user.role , profile:user.profile , name:user.name ,email:user.email ,sessionToken },
      config.jwt.access_expires_in
    );


    return { user, accessToken, refreshToken };
  },




async logout(userId: string) {
  return User.findByIdAndUpdate(
    userId,
    { sessionToken: null },
    { new: true }
  );
},

async logoutFromOthers(email: string) {
  return User.findOneAndUpdate(
    { email },           // filter by email
    { sessionToken: null }, // update
    { new: true }        // return the updated document
  );
}
,



  async refreshToken(token: string) {
    const payload = verifyToken(token) as JwtPayload;
    const user = await User.findById(payload?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateToken(
      { id: user._id, _id:user._id , role: user.role , profile:user.profile , name:user.name ,email:user.email ,sessionToken: user.sessionToken },
      config.jwt.access_expires_in
    );


    return { accessToken };
  },

  /** 🔹 Update user password */




async updatePassword(userId: string, payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Compare current password
  const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Hash and update the new password
  const salt = await bcrypt.genSalt(config.bcrypt_salt_rounds);
  const hashedPassword = await bcrypt.hash(payload.newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return user
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


async updateUser(userId: string, updates: Partial<IUser>) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
  return updatedUser;
},



  async getAll(req: Request) {
    const searchableFields = ["name", "email", "phone"];

    const userQuery = new QueryBuilder(
      User.find()
        .populate({
          path: "courses",
          select: "title thumbnail",
        }),
      req.query as Record<string, unknown>
    )
      .search(searchableFields)
      .filter()
      .sort()
      .paginate();

    const [users, metaInfo] = await Promise.all([
      userQuery.modelQuery,
      userQuery.countTotal(),
    ]);

    if (!users.length) throw new ApiError(404, "No users found");

    return {
      meta: metaInfo,
      data: users,
    };
  },





async getMe(
  userId: string,
  sessionToken: string,
): Promise<any> {
  const user = await User.findById(userId).select("+sessionToken");

  if (!user) throw new ApiError(404, "User not found");
  
  if (user.sessionToken !== sessionToken) {
    
    
    return {
      logout: true,
      message: "Session expired. Logged in from another device."
    };
  }


const userObj = user.toObject();
delete userObj.sessionToken;
const newInfo = userObj;
  return newInfo;
},


async addToWishlist(id: string, courseId: string) {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  // Convert to ObjectId
  const courseObjectId = new mongoose.Types.ObjectId(courseId);


  const isAlreadyInWishlist = user.wishlist.some(
    (item: mongoose.Types.ObjectId) => item.equals(courseObjectId)
  );

  let updatedUser;
  if (isAlreadyInWishlist) {
    // 🔹 Remove if exists
    updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { wishlist: courseObjectId } },
      { new: true }
    );
  } else {
    // 🔹 Add if not exists
    updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { wishlist: courseObjectId } },
      { new: true }
    );
  }

  return updatedUser;
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
