<<<<<<< HEAD
import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';


const UserSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to not be unique
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  countryCode: {
    type: String,
    trim: true,
    default: '+86', // Default to China's country code
  },
  realName: {
    type: String,
    trim: true,
  },
  idCardNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // This field is optional and sensitive, so it should be unique only if present
  },
  wechatOpenId: {
    type: String,
    unique: true,
    sparse: true,
  },
  alipayUserId: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayName: {
    type: String,
    trim: true,
  },
  photoURL: {
    type: String,
  },
  roles: {
    type: [String],
    required: true,
    enum: ['super_admin', 'admin', 'instructor', 'user'],
    default: ['user'],
  },
  enrollments: {
    type: [String], // Array of course IDs. This is a simple reference.
    default: [],
  },
});

// 3. Export the Mongoose model, which allows you to interact with the "users" collection.
export const UserModel = model<IUser>('User', UserSchema);
=======
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./auth.interface";


const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9._-]+$/,
    },
    phone: {
      type: String,
      match: /^[0-9]{6,15}$/, // simple validation for China/Intl phones
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, 
    },

    role: {
      type: String,
      enum: ["user", "instructor", "admin", "super_admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },

    currentToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    lastLogin: { type: Date },
    loginDevice: {
      ip: { type: String },
      userAgent: { type: String },
    },

    image: { type: String },

    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);



UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12); 
  this.password = await bcrypt.hash(this.password, salt);

  next();
});



UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


UserSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
>>>>>>> fedc3050a18211aa344df31033e10b69784ae83a
