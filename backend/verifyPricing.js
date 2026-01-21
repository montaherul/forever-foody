import mongoose from "mongoose";
import PricingModel from "./models/pricingModel.js";
import ProductModel from "./models/productModel.js";
import dotenv from "dotenv";

dotenv.config();

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected\n");

    // Count pricing records
    const pricingCount = await PricingModel.countDocuments();
    console.log(`📊 Pricing Records: ${pricingCount}\n`);

    // Get sample pricing with product name
    const pricings = await PricingModel.find({})
      .populate("productId", "name price")
      .limit(5);
    console.log("📋 Sample Pricing Data:");
    pricings.forEach((p) => {
      if (p.productId) {
        console.log(`\n✓ ${p.productId.name}`);
        console.log(`  Base Price: $${p.basePrice}`);
        console.log(
          `  Sizes: ${p.sizes.map((s) => `${s.size}($${s.price})`).join(", ")}`
        );
      }
    });

    // Count products with pricingId
    const productsWithPricing = await ProductModel.countDocuments({
      pricingId: { $exists: true, $ne: null },
    });
    console.log(
      `\n✓ Products with pricing reference: ${productsWithPricing}/16`
    );

    await mongoose.disconnect();
  } catch (e) {
    console.error("✗", e.message);
  }
};

verify();
