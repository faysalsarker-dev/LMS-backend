import { Schema, model } from "mongoose";
import { IPromoCode } from "./promo.interface";

const PromoUsageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    },

    description: {
      type: String,
      trim: true,
      default: "",
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Promo Status ---
    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
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

    // Order limit
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
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


const PromoCode = model<IPromoCode>("PromoCode", PromoCodeSchema);
export default PromoCode