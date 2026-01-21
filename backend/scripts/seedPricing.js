import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load env variables
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import PricingModel from "../models/pricingModel.js";
import ProductModel from "../models/productModel.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable not set");
    }
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Create pricing data from products
const seedPricing = async () => {
  try {
    await connectDB();

    // Get all products from MongoDB (not JSON file)
    const dbProducts = await ProductModel.find({});

    console.log(`\n📦 Found ${dbProducts.length} products in database\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const product of dbProducts) {
      try {
        // Check if pricing already exists for this product
        const existingPricing = await PricingModel.findOne({
          productId: product._id,
        });

        if (existingPricing) {
          console.log(`✓ Pricing already exists for: ${product.name}`);
          continue;
        }

        // Create pricing data with base price as lowest price
        const basePriceValue = product.price || 100;

        // Create sizes array with prices
        // Generate reasonable prices based on size (larger = cheaper per unit)
        const sizePrices = (product.sizes || []).map((size, index) => {
          // Vary prices based on size - smaller sizes are more expensive per unit
          let multiplier = 1 + (0.5 - index * 0.05); // Decreasing multiplier for larger sizes
          multiplier = Math.max(0.8, multiplier); // Minimum 80% of base price

          let price = basePriceValue * multiplier;

          // Handle specific size patterns - scale price based on size
          if (size && typeof size === "string") {
            // Extract number from size string
            const numMatch = size.match(/[\d.]+/);
            const num = numMatch ? parseFloat(numMatch[0]) : null;

            if (size.includes("ml")) {
              // Milliliter sizes - base on 1000ml
              price = basePriceValue * (num / 1000);
            } else if (size.includes("L")) {
              // Liter sizes - 1L is base, scale up
              if (num === 0.5) price = basePriceValue * 0.7;
              else if (num === 1) price = basePriceValue;
              else if (num === 2) price = basePriceValue * 1.8;
            } else if (size.includes("kg")) {
              // Kilogram sizes - 1kg is base
              if (num === 0.5) price = basePriceValue * 0.7;
              else if (num === 1) price = basePriceValue;
              else if (num === 2) price = basePriceValue * 1.8;
              else price = basePriceValue * num;
            } else if (size.includes("g")) {
              // Gram sizes - scale to 500g as standard
              price = basePriceValue * (num / 500);
            } else {
              // No unit match, use multiplier
              price = basePriceValue * multiplier;
            }
          }

          // Round to 2 decimal places and ensure it's a valid number
          price = Math.max(0.01, Math.round(price * 100) / 100);
          if (isNaN(price)) price = basePriceValue;

          return {
            size: String(size),
            price: price,
          };
        });

        // Create pricing document
        const pricingDoc = new PricingModel({
          productId: product._id,
          basePrice: basePriceValue,
          sizes: sizePrices,
          historicalPrices: [
            {
              date: new Date(),
              price: basePriceValue,
              note: "Initial seed price",
            },
          ],
          updatedBy: "system-seed",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await pricingDoc.save();

        // Update product with pricingId reference
        product.pricingId = pricingDoc._id;
        await product.save();

        console.log(`✓ Created pricing for: ${product.name}`);
        console.log(`  Base Price: $${basePriceValue}`);
        console.log(
          `  Sizes: ${sizePrices
            .map((s) => `${s.size}($${s.price})`)
            .join(", ")}`
        );
        successCount++;
      } catch (error) {
        console.error(`✗ Error processing ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✓ Seed completed!`);
    console.log(`  Success: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);

    // Verify pricing collection
    const pricingCount = await PricingModel.countDocuments();
    console.log(`\n📊 Total pricing records in DB: ${pricingCount}\n`);

    mongoose.connection.close();
  } catch (error) {
    console.error("✗ Seeding error:", error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedPricing();
