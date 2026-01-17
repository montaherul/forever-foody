import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  const categories = [
    // Grocery
    { name: "Fresh Vegetables" },
    { name: "Fresh Fruits" },
    { name: "Dairy Products" },
    { name: "Bakery Items" },
    { name: "Breakfast" },
    { name: "Drinks" },
    { name: "Meat & Seafood" },
    { name: "Grains & Cereals" },
    { name: "Snacks" },
    // New sectors
    { name: "Electronics" },
    { name: "Fashion" },
  ];

  const subcategories = [
    // Grocery
    "Organic",
    "Regular",
    "Premium",
    "Berries",
    "Milk",
    "Yogurt",
    "Bread",
    "Eggs",
    "Coffee",
    "Poultry",
    "Seafood",
    "Rice",
    "Nuts",
    "Cereal",
    "Avocado",
    // Electronics
    "Laptops",
    "Smartphones",
    "Headphones",
    "Smart Home",
    "Wearables",
    "Televisions",
    // Fashion
    "Men",
    "Women",
    "Shoes",
    "Accessories",
    "Activewear",
  ];

  const toggleValue = (value, list, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleCategory = (e) => {
    const value = e.target.value;
    toggleValue(value, category, setCategory);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    toggleValue(value, subcategory, setSubCategory);
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      const searchLower = search.toLowerCase();
      productsCopy = productsCopy.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.subCategory.toLowerCase().includes(searchLower) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subcategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subcategory.includes(item.subCategory)
      );
    }
    // Price range filter (uses base price)
    productsCopy = productsCopy.filter((item) => {
      const price = Number(item.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };
  useEffect(() => {
    applyFilter();
  }, [category, subcategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
    setMinPrice(0);
    setMaxPrice(2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t dark:border-slate-800">
      {/* Filter Sidebar */}
      <div className="min-w-72">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-400">
              FILTERS
            </h2>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="sm:hidden bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <img
                className={`h-4 w-4 transition-transform ${
                  showFilter ? "rotate-180" : ""
                }`}
                src={assets.dropdown_icon}
                alt="Toggle"
              />
            </button>
          </div>

          {(category.length > 0 || subcategory.length > 0) && (
            <button
              onClick={clearFilters}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg mb-4 transition-colors"
            >
              Clear All Filters
            </button>
          )}

          {/* Active Filters Pills */}
          {(category.length > 0 || subcategory.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleValue(cat, category, setCategory)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 text-xs font-semibold"
                >
                  {cat} ✕
                </button>
              ))}
              {subcategory.map((sub) => (
                <button
                  key={sub}
                  onClick={() => toggleValue(sub, subCategory, setSubCategory)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700 text-xs font-semibold"
                >
                  {sub} ✕
                </button>
              ))}
            </div>
          )}

          {/* Category Filter */}
          <div className={`${showFilter ? "" : "hidden"} sm:block space-y-4`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border dark:border-slate-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                CATEGORIES
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {categories.map((cat) => (
                  <label
                    key={cat.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                  >
                    <input
                      className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                      type="checkbox"
                      onChange={toggleCategory}
                      value={cat.name}
                      checked={category.includes(cat.name)}
                    />
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-200 group-hover:text-green-700 dark:group-hover:text-green-400">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            <div className="bg-white rounded-xl p-5 shadow-md">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                TYPE
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subcategories.map((subCat) => (
                  <label
                    key={subCat}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                  >
                    <input
                      className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                      type="checkbox"
                      onChange={toggleSubCategory}
                      value={subCat}
                      checked={subcategory.includes(subCat)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-orange-400">
                      {subCat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border dark:border-slate-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                PRICE
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-slate-400">
                      Min
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="w-24 px-2 py-1 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-slate-100"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-slate-400">
                      Max
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="w-24 px-2 py-1 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-slate-100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                  className="w-full accent-green-600"
                />
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Showing items between ${minPrice} and ${maxPrice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title text1={"ALL"} text2={"PRODUCTS"} />
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
              {filterProducts.length} items across grocery, electronics, and
              fashion
            </p>
          </div>
          {/* Sort Dropdown */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="border-2 border-green-400 dark:border-green-600 text-sm px-4 py-3 rounded-lg bg-white dark:bg-slate-800 dark:text-slate-100 font-semibold text-gray-700 dark:text-slate-200 hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer shadow-md"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Sort: Low to High</option>
            <option value="high-low">Sort: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                discount={item.discount}
                image={item.images}
                sizePricing={item.sizePricing}
                sizes={item.sizes}
                category={item.category}
                inStock={item.inStock}
                stockQuantity={item.stockQuantity}
                sizeStock={item.sizeStock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl">
            <div className="text-6xl mb-4 text-gray-300 dark:text-slate-600 font-bold">
              No Results
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
