import mongoose from "mongoose";
import PricingModel from "./models/pricingModel.js";
import dotenv from "dotenv";

dotenv.config();

const clearPricing = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected\n");

    const result = await PricingModel.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} pricing records\n`);

    await mongoose.disconnect();
  } catch (e) {
    console.error("✗", e.message);
  }
};

clearPricing();
