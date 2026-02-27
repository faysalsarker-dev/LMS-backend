import { Schema } from "mongoose";

export interface IEnrollment {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
amount: number;
  currency: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  transactionId: string;
  promoCode?: string;
  refundDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}


