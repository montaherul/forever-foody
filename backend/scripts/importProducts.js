import dotenv from "dotenv";
import connectDB from "../config/mongodb.js";
import productModel from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importProducts() {
  try {
    // Connect to DB
    await connectDB();
    console.log("✓ Connected to MongoDB");

    // Read products.json
    const productsPath = path.join(__dirname, "../data/products.json");
    let productsData = JSON.parse(fs.readFileSync(productsPath, "utf8"));
    console.log(`✓ Loaded ${productsData.length} products from JSON file`);

    // Remove _id and __v fields, add date field
    productsData = productsData.map((product) => {
      const { _id, __v, ...productWithoutId } = product;
      return {
        ...productWithoutId,
        date: Date.now(),
      };
    });

    // Clear existing products (optional)
    const deleteResult = await productModel.deleteMany({});
    console.log(`✓ Cleared ${deleteResult.deletedCount} existing products`);

    // Insert products
    const result = await productModel.insertMany(productsData);
    console.log(
      `✓ Successfully imported ${result.length} products into MongoDB`
    );

    // Show summary
    console.log("\n=== Import Summary ===");
    const categories = await productModel.distinct("category");
    console.log(`Total Products: ${result.length}`);
    console.log(`Categories: ${categories.join(", ")}`);

    process.exit(0);
  } catch (error) {
    console.error("Error importing products:", error.message);
    process.exit(1);
  }
}

importProducts();
