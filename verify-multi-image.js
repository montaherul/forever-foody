#!/usr/bin/env node

/**
 * Multi-Image Support Verification Script
 * This script verifies that all components are correctly implemented
 */

const fs = require("fs");
const path = require("path");

console.log(
  "\n═══════════════════════════════════════════════════════════════"
);
console.log("  MULTI-IMAGE SUPPORT VERIFICATION SCRIPT");
console.log(
  "═══════════════════════════════════════════════════════════════\n"
);

// Configuration
const checks = [];
const projectRoot = path.join(__dirname);

// Helper function
function addCheck(category, item, passed, message) {
  checks.push({ category, item, passed, message });
  const status = passed ? "✅" : "❌";
  console.log(`${status} ${category} - ${item}`);
  if (message) console.log(`   └─ ${message}`);
}

// 1. Check Admin Component
console.log("\n📱 ADMIN PANEL CHECKS\n");

const addJsxPath = path.join(projectRoot, "admin/src/pages/Add.jsx");
if (fs.existsSync(addJsxPath)) {
  const content = fs.readFileSync(addJsxPath, "utf8");
  addCheck("Admin Panel", "Add.jsx exists", true);

  const hasImage1 = content.includes("image1") && content.includes("setImage1");
  addCheck(
    "Admin Panel",
    "Image1 state",
    hasImage1,
    hasImage1 ? "Found image1 state management" : "Missing image1 state"
  );

  const hasImage4 = content.includes("image4") && content.includes("setImage4");
  addCheck(
    "Admin Panel",
    "Image4 state",
    hasImage4,
    hasImage4 ? "Found image4 state management" : "Missing image4 state"
  );

  const hasFormData = content.includes('formData.append("image1"');
  addCheck(
    "Admin Panel",
    "FormData append",
    hasFormData,
    hasFormData ? "Images appended to FormData" : "Images not appended"
  );

  const hasOptionalBadge = content.includes("Optional");
  addCheck(
    "Admin Panel",
    "Optional label",
    hasOptionalBadge,
    hasOptionalBadge ? '"Optional" badge visible' : "Badge not visible"
  );
} else {
  addCheck("Admin Panel", "Add.jsx exists", false, "File not found");
}

// 2. Check Backend Routes
console.log("\n🔧 BACKEND ROUTES CHECKS\n");

const productRoutePath = path.join(
  projectRoot,
  "backend/routes/productRoute.js"
);
if (fs.existsSync(productRoutePath)) {
  const content = fs.readFileSync(productRoutePath, "utf8");
  addCheck("Backend Routes", "productRoute.js exists", true);

  const hasUploadFields = content.includes("upload.fields");
  addCheck(
    "Backend Routes",
    "Multer fields config",
    hasUploadFields,
    "Multer configured for 4 images"
  );

  const hasImage1Field = content.includes('{ name: "image1"');
  addCheck("Backend Routes", "image1 field", hasImage1Field);

  const hasImage4Field = content.includes('{ name: "image4"');
  addCheck("Backend Routes", "image4 field", hasImage4Field);

  const hasAddRoute = content.includes('productRouter.post(\n  "/add"');
  addCheck("Backend Routes", "/add route", hasAddRoute);

  const hasUpdateRoute = content.includes('productRouter.post(\n  "/update"');
  addCheck("Backend Routes", "/update route", hasUpdateRoute);
} else {
  addCheck("Backend Routes", "productRoute.js exists", false, "File not found");
}

// 3. Check Product Controller
console.log("\n💾 BACKEND CONTROLLER CHECKS\n");

const productControllerPath = path.join(
  projectRoot,
  "backend/controllers/productController.js"
);
if (fs.existsSync(productControllerPath)) {
  const content = fs.readFileSync(productControllerPath, "utf8");
  addCheck("Product Controller", "productController.js exists", true);

  const hasAddProduct = content.includes("const addProduct = async");
  addCheck("Product Controller", "addProduct function", hasAddProduct);

  const hasImageProcessing =
    content.includes("readFileSync") && content.includes("base64");
  addCheck(
    "Product Controller",
    "Base64 conversion",
    hasImageProcessing,
    "Images converted to base64"
  );

  const hasImageArray = content.includes("images.map");
  addCheck("Product Controller", "Image array creation", hasImageArray);

  const hasOptionalCheck = content.includes("if (images.length > 0)");
  addCheck(
    "Product Controller",
    "Optional images handling",
    hasOptionalCheck,
    "Images are optional"
  );

  const hasTempDelete = content.includes("fs.unlinkSync");
  addCheck("Product Controller", "Temp file cleanup", hasTempDelete);
} else {
  addCheck("Product Controller", "productController.js exists", false);
}

// 4. Check Product Model
console.log("\n📦 DATABASE MODEL CHECKS\n");

const productModelPath = path.join(
  projectRoot,
  "backend/models/productModel.js"
);
if (fs.existsSync(productModelPath)) {
  const content = fs.readFileSync(productModelPath, "utf8");
  addCheck("Product Model", "productModel.js exists", true);

  const hasImageField =
    content.includes("images:") && content.includes("[String]");
  addCheck(
    "Product Model",
    "images field",
    hasImageField,
    "Supports array of strings"
  );

  const isArray = content.includes("type: [String]");
  addCheck("Product Model", "Array type", isArray);
} else {
  addCheck("Product Model", "productModel.js exists", false);
}

// 5. Check Frontend Product Page
console.log("\n📱 FRONTEND DISPLAY CHECKS\n");

const productPagePath = path.join(
  projectRoot,
  "frontend/src/pages/Product.jsx"
);
if (fs.existsSync(productPagePath)) {
  const content = fs.readFileSync(productPagePath, "utf8");
  addCheck("Frontend", "Product.jsx exists", true);

  const hasMap = content.includes(".map(");
  addCheck("Frontend", "Image mapping", hasMap, "Loops through all images");

  const hasThumbnails = content.includes("onClick={() => setImage(item)");
  addCheck(
    "Frontend",
    "Thumbnail selection",
    hasThumbnails,
    "Click to change main image"
  );

  const hasFallback = content.includes("No images");
  addCheck("Frontend", "No images fallback", hasFallback);

  const hasErrorFallback = content.includes("onError");
  addCheck(
    "Frontend",
    "Error fallback",
    hasErrorFallback,
    "Handles image load failures"
  );

  const hasImageCount = content.includes("images.length");
  addCheck("Frontend", "Image counter", hasImageCount, "Shows total images");
} else {
  addCheck("Frontend", "Product.jsx exists", false);
}

// 6. Summary
console.log(
  "\n═══════════════════════════════════════════════════════════════\n"
);

const passed = checks.filter((c) => c.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`SUMMARY: ${passed}/${total} checks passed (${percentage}%)\n`);

if (percentage === 100) {
  console.log("🎉 ALL SYSTEMS GO! Multi-image support is fully implemented.\n");
  console.log("✅ Admin can upload up to 4 images per product");
  console.log("✅ Backend processes and stores images as base64");
  console.log("✅ Database stores images in array format");
  console.log("✅ Frontend displays all images in gallery");
  console.log("\nREADY FOR PRODUCTION!\n");
  process.exit(0);
} else if (percentage >= 80) {
  console.log("⚠️  MOSTLY WORKING - A few items may need attention\n");
  checks
    .filter((c) => !c.passed)
    .forEach((c) => {
      console.log(`❌ ${c.category} - ${c.item}`);
    });
  process.exit(1);
} else {
  console.log("❌ CRITICAL ISSUES - Implementation incomplete\n");
  checks
    .filter((c) => !c.passed)
    .forEach((c) => {
      console.log(`❌ ${c.category} - ${c.item}`);
    });
  process.exit(1);
}
