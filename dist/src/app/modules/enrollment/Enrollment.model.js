"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    method: {
        type: String,
        enum: ["alipay", "wechat"],
        required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });
const Enrollment = (0, mongoose_1.model)("Enrollment", enrollmentSchema);
exports.default = Enrollment;
