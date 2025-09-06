"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
