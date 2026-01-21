import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Base price (for backward compatibility)
  description: { type: String, required: true },
  images: { type: [String], required: true, default: [] },
  sku: { type: String, unique: true, sparse: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  unit: { type: String, default: "kg" },
  sizes: { type: Array, required: true },
  sizeStock: { type: Map, of: Number },
  brand: { type: String },
  model: { type: String },
  warranty: { type: String },
  specs: { type: Map, of: String },
  tags: { type: [String], default: [] },
  weight: { type: String },
  dimensions: {
    width: { type: String },
    height: { type: String },
    depth: { type: String },
  },
  // NEW: Reference to pricing table instead of inline sizePricing
  pricingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pricing",
    default: null,
  },
  nutritionInfo: {
    calories: { type: Number },
    protein: { type: String },
    carbs: { type: String },
    fat: { type: String },
  },
  origin: { type: String },
  shelfLife: { type: String },
  isOrganic: { type: Boolean, default: false },
  bestseller: { type: Boolean },
  discount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
