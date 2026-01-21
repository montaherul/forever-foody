import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch, setSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [localSearch, setLocalSearch] = useState(search || "");
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [featuredType, setFeaturedType] = useState(null);

  // Check if we navigated from featured selection
  useEffect(() => {
    if (
      location.state?.selectedSort &&
      ["Top ranking", "New arrivals", "Top deals"].includes(
        location.state.selectedSort,
      )
    ) {
      setSortType(location.state.selectedSort);
    }
  }, [location]);

  const toggleValue = (value, list, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
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
          item.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }
    if (subcategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subcategory.includes(item.subCategory),
      );
    }
    // Price range filter (uses base price)
    productsCopy = productsCopy.filter((item) => {
      const price = Number(item.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });
    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subcategory, search, showSearch, products, sortType]);

  // Apply sorting after filtering
  useEffect(() => {
    if (filterProducts.length > 0) {
      let sorted = [...filterProducts];
      switch (sortType) {
        case "low-high":
          sorted = sorted.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "high-low":
          sorted = sorted.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "Top ranking":
          sorted = sorted.sort(
            (a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0),
          );
          break;
        case "New arrivals":
          sorted = sorted.reverse();
          break;
        case "Top deals":
          sorted = sorted.sort(
            (a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0),
          );
          break;
        default:
          break;
      }
      setFilterProducts(sorted);
    }
  }, [sortType]);

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
    setMinPrice(0);
    setMaxPrice(2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Products */}
          <main className="flex-1">
            {/* Header Section */}
            <div className="mb-8">
              <Title text1={"ALL"} text2={"PRODUCTS"} />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">
                  Showing{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {filterProducts.length}
                  </span>{" "}
                  products
                </p>
                <select
                  onChange={(e) => setSortType(e.target.value)}
                  value={sortType}
                  className="px-4 py-2.5 border-2 border-emerald-400 dark:border-emerald-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm font-semibold hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-sm"
                >
                  <option value="relevant">Sort: Relevant</option>
                  <option value="low-high">Sort: Low to High</option>
                  <option value="high-low">Sort: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filterProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
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
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="mb-4">
                  <i className="fa-solid fa-inbox text-5xl text-gray-300 dark:text-slate-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                  Try adjusting your filters, price range, or search terms to
                  find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Collection;
