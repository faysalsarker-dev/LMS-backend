import { Schema, Types, model } from "mongoose";
import { IPromoCode, IPromoCodeModel, IUsePromoParams } from "./promo.interface";
import { ApiError } from "../../errors/ApiError";

const PromoUsageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    usedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    // --- Core Info ---
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
index: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed_amount"],
      required: true,
    },

    // --- Creator Info ---
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
commission: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarn: {
  type: Number,
  default: 0, 
},
    // --- Promo Status ---
    isActive: {
      type: Boolean,
      default: true,
    },
    // --- Validity ---
    validFrom: {
      type: Date,
      default: Date.now,
    },

    expirationDate: {
      type: Date,
      required: true,
      index: true,
    },

    // --- Usage Limits ---
    maxUsageCount: {
      type: Number,
      default: null,
      min: 1,
    },

    currentUsageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxUsagePerUser: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Track which users have used the promo
    usedBy: {
      type: [PromoUsageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// --- Auto-disable expired or overused promos ---
PromoCodeSchema.pre("save", function (next) {
  const now = new Date();

  if (this.expirationDate < now) {
    this.isActive = false;
  }

  if (this.maxUsageCount && this.currentUsageCount >= this.maxUsageCount) {
    this.isActive = false;
  }

  next();
});




PromoCodeSchema.statics.usePromo = async function ({
  promoCode,
  userId,
  courseId,
  price,
}: IUsePromoParams) {
  const promo = await this.findOne({ code: promoCode, isActive: true });

  if (!promo) {
   throw new ApiError(400, "Promo code is invalid, expired, or inactive.");
  }

  const earnAmount = (price * promo.commission) / 100;

  return await this.findOneAndUpdate(
    { _id: promo._id },
    {
      $inc: {
        currentUsageCount: 1,
        totalEarn: earnAmount, 
      },
      $push: {
        usedBy: {
          user: userId,
          course: courseId,
          usedAt: new Date(),
        },
      },
    },
    { new: true, runValidators: true }
  );
};

PromoCodeSchema.statics.validatePromo = async function ({
  code,
  userId,
  originalPrice,
}) {
  const promo = await this.findOne({ code: code.trim() });
  if (!promo || !promo.isActive) {
    throw new ApiError(400, "Promo code is invalid or inactive.");
  }
  const now = new Date();
  if (now < promo.validFrom || now > promo.expirationDate) {
    throw new ApiError(400, "This promo code has expired.");
  }

  if (promo.maxUsageCount && promo.currentUsageCount >= promo.maxUsageCount) {
    throw new ApiError(400, "This promo code has reached its maximum usage limit.");
  }

  const userUsageCount = promo.usedBy.filter(
    (usage: any) => usage.user.toString() === userId.toString()
  ).length;

  if (userUsageCount >= promo.maxUsagePerUser) {
    throw new ApiError(400, "You have already used this promo code.");
  }

  let discountAmount = 0;
  if (promo.discountType === "percentage") {
    discountAmount = (originalPrice * promo.discountValue) / 100;
  } else {
  
    discountAmount = Math.min(promo.discountValue, originalPrice);
  }

  const finalAmount = originalPrice - discountAmount;

  return {
    isValid: true,
    discountAmount,
    finalAmount,
    promoCode: promo.code 
  };
};


const PromoCode = model<IPromoCode ,IPromoCodeModel>("PromoCode", PromoCodeSchema);
export default PromoCode