"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    // Enrollment status
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    // Pricing
    originalPrice: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    // Promo code
    promoCode: { type: mongoose_1.Schema.Types.ObjectId, ref: "PromoCode", default: null },
    promoCodeUsed: { type: String, default: null },
    // Payment
    paymentMethod: {
        type: String,
        enum: ["alipay", "wechat", "stripe", "paypal"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
        index: true,
    },
    transactionId: { type: String, default: null },
    paymentDate: { type: Date, default: null },
    // Refund
    refundDate: { type: Date, default: null },
    refundReason: { type: String, default: null },
}, { timestamps: true });
// Indexes
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ paymentStatus: 1, paymentDate: 1 });
enrollmentSchema.index({ createdAt: 1 });
const Enrollment = (0, mongoose_1.model)("Enrollment", enrollmentSchema);
exports.default = Enrollment;
