// Quick test to verify products can be created without images
const axios = require("axios");

const testCreateProductWithoutImages = async () => {
  try {
    console.log("📝 Testing product creation WITHOUT images...\n");

    // Get admin token (you may need to update this with a valid token)
    // For now, we'll just test the API structure

    const productData = {
      name: "Test Product Without Images",
      description: "This is a test product created without any images",
      price: "99.99",
      category: "Fresh Vegetables",
      subCategory: "Organic",
      sizes: JSON.stringify(["S", "M", "L"]),
      bestseller: "false",
    };

    const response = await axios.post(
      "http://localhost:4000/api/product/add",
      productData,
      {
        headers: {
          "Content-Type": "application/json",
          // Add your token here if needed
          // Authorization: `Bearer ${token}`
        },
      }
    );

    console.log("✅ SUCCESS! Product created without images");
    console.log("Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.log("❌ Error Response:", error.response.data);
    } else {
      console.log("❌ Error:", error.message);
    }
  }
};

testCreateProductWithoutImages();
