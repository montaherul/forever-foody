import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    minPurchase: { type: Number, default: 0 },
    expiresAt: { type: Date },
    active: { type: Boolean, default: true },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    createdBy: { type: String },
  },
  { timestamps: true }
);

const couponModel =
  mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;
