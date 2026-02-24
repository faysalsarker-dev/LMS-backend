import { Document, Model, Types } from "mongoose";

export interface IPromoUsage {
  user: Types.ObjectId;
  usedAt: Date;
}

export interface IPromoCode {
  code: string;


  discountValue: number;
  discountType: "percentage" | "fixed_amount";

  owner: Types.ObjectId;
commission: number;
totalEarn: number;
  isActive: boolean;

  validFrom: Date;
  expirationDate: Date;

  maxUsageCount: number | null;
  currentUsageCount: number;

  maxUsagePerUser: number;

  usedBy: IPromoUsage[];


  createdAt?: Date;
  updatedAt?: Date;
}





export interface IPromoCodeModel extends Model<IPromoCode> {
  // Your existing method
  usePromo(params: {
    promoCode: string;
    userId: string | Types.ObjectId | any;
    courseId: string | Types.ObjectId | any;
    price: number;
  }): Promise<Document<unknown, {}, IPromoCode> & IPromoCode>;

  // ADD THIS NEW METHOD HERE
  validatePromo(params: {
    code: string;
    userId: string | Types.ObjectId;
    originalPrice: number;
  }): Promise<{
    isValid: boolean;
    discountAmount: number;
    finalAmount: number;
    promoCode: string;
  }>;
}


export interface IUsePromoParams {
  promoCode: string;
  userId: string | Types.ObjectId;
  courseId: string | Types.ObjectId;
  price: number;
}