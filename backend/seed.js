import mongoose from "mongoose";
import "dotenv/config";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";
import orderModel from "./models/orderModel.js";
import { productData, userData, orderData } from "./seedData.js";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await productModel.deleteMany({});
    await userModel.deleteMany({});
    await orderModel.deleteMany({});
    console.log("Cleared existing data");

    // Insert products
    const products = await productModel.insertMany(productData);
    console.log(`✓ ${products.length} products inserted`);

    // Insert users
    const users = await userModel.insertMany(userData);
    console.log(`✓ ${users.length} users inserted`);

    // Skip orders for now (comment out to enable)
    // const orders = await orderModel.insertMany(orderData);
    // console.log(`✓ ${orders.length} orders inserted`);

    console.log("\n✓ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
