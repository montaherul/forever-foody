import mongoose from "mongoose";
import ProductModel from "./models/productModel.js";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/forever"
    );
    console.log("✓ Connected");

    // Wait a moment
    await new Promise((r) => setTimeout(r, 500));

    // Count products
    const count = await ProductModel.countDocuments();
    console.log("✓ Product count:", count);

    if (count > 0) {
      const products = await ProductModel.find({}, { name: 1 }).limit(3);
      console.log("✓ Sample products:");
      products.forEach((p) => console.log("  -", p.name));
    }

    await mongoose.disconnect();
  } catch (e) {
    console.error("✗", e.message);
  }
};

test();
