import productModel from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsJsonPath = path.join(__dirname, "../data/products.json");

// ✅ Helper function to sync products to JSON file
const syncProductsToJSON = async () => {
  try {
    const products = await productModel.find({});
    fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error syncing to JSON:", error);
  }
};

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // ✅ Ensure req.files exists
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    // ✅ Extract images safely
    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // ✅ Convert images to base64 and store in MongoDB
    let imagesUrl = images.map((item) => {
      const imageBuffer = fs.readFileSync(item.path);
      const base64Image = `data:${item.mimetype};base64,${imageBuffer.toString(
        "base64"
      )}`;
      // Delete the temporary file
      fs.unlinkSync(item.path);
      return base64Image;
    });

    // ✅ Create product data object
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      images: imagesUrl,
      date: Date.now(),
    };

    // ✅ Save product in DB
    const product = new productModel(productData);
    await product.save();

    // ✅ Sync to JSON file
    await syncProductsToJSON();

    res.json({
      success: true,
      message: "Product Added",
      productId: product._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);

    // ✅ Sync to JSON file
    await syncProductsToJSON();

    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ NEW: function for update product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Find product and update
    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" || bestseller === true,
      date: Date.now(),
    };

    // Handle new images if uploaded
    if (req.files && Object.keys(req.files).length > 0) {
      const image1 = req.files.image1?.[0];
      const image2 = req.files.image2?.[0];
      const image3 = req.files.image3?.[0];
      const image4 = req.files.image4?.[0];

      const images = [image1, image2, image3, image4].filter(
        (item) => item !== undefined
      );

      let imagesUrl = images.map((item) => {
        const imageBuffer = fs.readFileSync(item.path);
        const base64Image = `data:${
          item.mimetype
        };base64,${imageBuffer.toString("base64")}`;
        fs.unlinkSync(item.path);
        return base64Image;
      });

      updateData.images = imagesUrl;
    }

    const product = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // ✅ Sync to JSON file
    await syncProductsToJSON();

    res.json({ success: true, message: "Product Updated", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
};
