"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
        type: String,
        enum: ["student", "instructor", "admin", "super_admin"],
        default: "student",
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    profile: { type: String, default: null },
    courses: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Course" }],
    wishlist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Course" }],
    address: {
        country: { type: String, default: null },
        city: { type: String, default: null },
    },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    sessionToken: { type: String, default: null, select: false },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(12);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
