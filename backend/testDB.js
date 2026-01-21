import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/forever"
    );
    console.log("✓ Connected");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    const productCount = await db.collection("products").countDocuments();
    console.log("Product count:", productCount);

    const pricingCount = await db.collection("pricings").countDocuments();
    console.log("Pricing count:", pricingCount);

    if (productCount > 0) {
      const firstProduct = await db.collection("products").findOne({});
      console.log("First product:", firstProduct.name);
    }

    mongoose.connection.close();
  } catch (e) {
    console.error("✗ Error:", e.message);
  }
};

checkDB();
