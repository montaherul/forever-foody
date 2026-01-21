/**
 * Size Options Configuration
 * Maps categories, subcategories, and size options for the product system
 */

// General category-level size options
export const SIZE_OPTIONS_BY_CATEGORY = {
  "Fresh Vegetables": ["250g", "500g", "1kg", "2kg"],
  "Fresh Fruits": ["250g", "500g", "1kg", "2kg"],
  "Dairy Products": ["250g", "500g", "1L"],
  "Bakery Items": ["250g", "500g", "1kg"],
  Snacks: ["250g", "500g", "1kg"],
  Breakfast: ["250g", "500g", "1kg"],
  Drinks: ["500ml", "1L", "2L"],
  "Grains & Cereals": ["500g", "1kg", "2kg"],
  "Meat & Seafood": ["250g", "500g", "1kg"],
  Electronics: [
    "6GB+128GB",
    "8GB+128GB",
    "8GB+256GB",
    "12GB+256GB",
    "12GB+512GB",
    "16GB+256GB",
    "16GB+512GB",
    "i5/8GB/512GB",
    "i5/16GB/512GB",
    "i7/16GB/512GB",
    "i7/16GB/1TB",
    "i9/32GB/1TB",
    "256GB",
    "512GB",
    "1TB",
    "55-inch",
  ],
  Fashion: ["One Size", "S", "M", "L", "XL", "40mm", "44mm"],
};

// Subcategory-specific size options (overrides category defaults)
export const SIZE_OPTIONS_BY_SUBCATEGORY = {
  // Grocery subcategories
  Organic: ["250g", "500g", "1kg", "2kg"],
  Regular: ["250g", "500g", "1kg", "2kg"],
  Premium: ["250g", "500g", "1kg", "2kg"],
  "Local Farm": ["250g", "500g", "1kg", "2kg"],

  // Electronics subcategories
  Laptops: [
    "i5/8GB/512GB",
    "i5/16GB/512GB",
    "i7/16GB/512GB",
    "i7/16GB/1TB",
    "i9/32GB/1TB",
  ],
  Smartphones: [
    "6GB+128GB",
    "8GB+128GB",
    "8GB+256GB",
    "12GB+256GB",
    "12GB+512GB",
    "16GB+256GB",
    "16GB+512GB",
  ],
  Headphones: ["One Size"],
  "Smart Home": ["One Size"],
  Wearables: ["40mm", "44mm"],
  Televisions: ["55-inch", "65-inch", "75-inch"],

  // Fashion subcategories
  Men: ["S", "M", "L", "XL"],
  Women: ["XS", "S", "M", "L", "XL"],
  Shoes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
  Accessories: ["One Size"],
  Activewear: ["XS", "S", "M", "L", "XL"],
};

/**
 * Get available sizes for a category
 * @param {string} category - Product category
 * @returns {Array} Array of available size options
 */
export const getSizesByCategory = (category) => {
  return SIZE_OPTIONS_BY_CATEGORY[category] || [];
};

/**
 * Get available sizes for a subcategory
 * Prefers subcategory-specific sizes, falls back to category sizes
 * @param {string} subcategory - Product subcategory
 * @param {string} category - Product category (fallback)
 * @returns {Array} Array of available size options
 */
export const getSizesBySubcategory = (subcategory, category = "") => {
  if (SIZE_OPTIONS_BY_SUBCATEGORY[subcategory]) {
    return SIZE_OPTIONS_BY_SUBCATEGORY[subcategory];
  }
  return category ? getSizesByCategory(category) : [];
};

/**
 * Get all unique size options (for validation, etc.)
 * @returns {Array} Array of all possible size options
 */
export const getAllSizeOptions = () => {
  const allSizes = new Set();

  Object.values(SIZE_OPTIONS_BY_CATEGORY).forEach((sizes) => {
    sizes.forEach((size) => allSizes.add(size));
  });

  Object.values(SIZE_OPTIONS_BY_SUBCATEGORY).forEach((sizes) => {
    sizes.forEach((size) => allSizes.add(size));
  });

  return Array.from(allSizes).sort();
};
