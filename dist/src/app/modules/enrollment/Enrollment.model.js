"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    currency: { type: String, default: "USD" },
    amount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "cancelled", "refunded"],
        default: "pending",
        index: true,
    },
    promoCode: { type: String, default: null },
    transactionId: { type: String, required: true },
    refundDate: { type: Date, default: null },
}, { timestamps: true });
// Indexes
enrollmentSchema.index({ createdAt: 1 });
const Enrollment = (0, mongoose_1.model)("Enrollment", enrollmentSchema);
exports.default = Enrollment;
