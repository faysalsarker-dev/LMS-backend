import { Schema, model } from "mongoose";
import { IEnrollment } from "./enrollment.interface";




const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    currency: { type: String, default: "USD" },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    promoCode: { type: String, default: null },
    transactionId: { type: String, required: true },
    refundDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Indexes
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ createdAt: 1 }); 

const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;
