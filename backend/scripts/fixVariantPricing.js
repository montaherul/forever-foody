import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import pricingModel from "../models/pricingModel.js";
import dotenv from "dotenv";

dotenv.config();

const fixVariantPricing = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all products with multiple sizes but no pricing
    const productsNeedingPricing = await productModel.find({
      sizes: { $exists: true, $ne: [] },
      $expr: { $gt: [{ $size: "$sizes" }, 1] },
      pricingId: null,
    });

    console.log(
      `Found ${productsNeedingPricing.length} products needing pricing records...`
    );

    let createdCount = 0;
    for (const product of productsNeedingPricing) {
      try {
        // Create pricing record for this product
        const sizesArray = product.sizes.map((size) => ({
          size,
          price: product.price,
        }));

        const pricingData = {
          productId: product._id,
          basePrice: product.price,
          sizes: sizesArray,
          updatedBy: "migration",
        };

        const pricingRecord = new pricingModel(pricingData);
        const savedPricing = await pricingRecord.save();

        // Update product with pricingId
        await productModel.findByIdAndUpdate(product._id, {
          pricingId: savedPricing._id,
        });

        createdCount++;
        console.log(`✅ Created pricing for: ${product.name} (${product._id})`);
      } catch (error) {
        console.error(
          `❌ Error creating pricing for ${product.name}:`,
          error.message
        );
      }
    }

    console.log(
      `\n✅ Migration complete! Created ${createdCount} pricing records`
    );
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

// Run the migration
fixVariantPricing();
