import { Schema } from "mongoose";

export interface IEnrollment {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  
  // Enrollment status
  status: "active" | "completed" | "cancelled";
  enrolledAt: Date;
  completedAt?: Date;
  
  // Payment info
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  
  // Promo code
  promoCode?: Schema.Types.ObjectId;
  promoCodeUsed?: string;
  
  // Payment details
  paymentMethod: "alipay" | "wechat" | "stripe" | "paypal";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentDate?: Date;
  
  // Refund (if needed)
  refundDate?: Date;
  refundReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
