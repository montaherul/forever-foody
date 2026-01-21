import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
    unique: false,
  }, // Reference to product
  basePricePercentage: { type: Number, default: 0 }, // For tracking if bulk discount applied
  sizes: [
    {
      size: { type: String, required: true }, // e.g., "250g", "500g", "1kg"
      price: { type: Number, required: true }, // e.g., 5.99
      markup: { type: Number, default: 0 }, // Percentage markup from base
      costPrice: { type: Number, default: 0 }, // Cost to business (optional)
      profitMargin: { type: Number, default: 0 }, // Calculated profit %
    },
  ],
  basePrice: { type: Number, required: true }, // Lowest price for "From $X" display
  historicalPrices: [
    {
      date: { type: Date, default: Date.now },
      sizes: [
        {
          size: String,
          price: Number,
        },
      ],
      basePrice: Number,
      reason: String, // "Price increase", "Bulk discount", etc.
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: String }, // Admin email who made the change
  createdAt: { type: Date, default: Date.now },
});

// Index for faster lookups
// Note: productId already has a unique index from the schema definition above
pricingSchema.index({ lastUpdated: -1 });

// Update lastUpdated before saving
pricingSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

const pricingModel =
  mongoose.models.pricing || mongoose.model("pricing", pricingSchema);

export default pricingModel;
