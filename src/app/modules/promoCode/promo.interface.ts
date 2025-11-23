import { Types } from "mongoose";

export interface IPromoUsage {
  user: Types.ObjectId;
  usedAt: Date;
}

export interface IPromoCode {
  code: string;
  description?: string;

  discountValue: number;
  discountType: "percentage" | "fixed_amount";

  createdBy: Types.ObjectId;

  isActive: boolean;

  validFrom: Date;
  expirationDate: Date;

  maxUsageCount: number | null;
  currentUsageCount: number;

  maxUsagePerUser: number;

  usedBy: IPromoUsage[];

  minOrderAmount: number;

  createdAt?: Date;
  updatedAt?: Date;
}
