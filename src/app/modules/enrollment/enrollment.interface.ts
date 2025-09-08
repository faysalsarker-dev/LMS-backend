import { Types } from "mongoose";

export interface IEnrollment {
  user: Types.ObjectId; 
  course: Types.ObjectId;
  status: "active" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  method:"alipay" | "wechat" ;
  enrolledAt: Date;
  completedAt?: Date;
}
