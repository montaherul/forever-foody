import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    token,
    backendUrl,
    user,
    wishlist,
    compareList,
    toggleWishlist,
    toggleCompare,
    normalizePricing,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0); // NEW: Track current price based on size
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const hasSpecs = Object.keys(productData?.specs || {}).length > 0;
  const hasNutrition =
    productData?.nutritionInfo &&
    Object.values(productData.nutritionInfo).some(
      (val) => val !== undefined && val !== null && val !== ""
    );

  useEffect(() => {
    if (!productData) return;
    const availableTabs = ["description"];
    if (hasSpecs) availableTabs.push("specs");
    if (hasNutrition) availableTabs.push("nutrition");
    availableTabs.push("reviews");
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [productData, hasSpecs, hasNutrition, activeTab]);

  const fetchProductData = () => {
    let product = products.find((item) => item._id === productId);
    if (product) {
      // Normalize product pricing from new pricingId structure
      product = normalizePricing(product);
      setProductData(product);
      // ✅ Safely get the first image or use placeholder
      const firstImage =
        product.images && product.images.length > 0
          ? product.images[0]
          : "https://via.placeholder.com/500x500?text=No+Image";
      setImage(firstImage);
      if (product.sizes && product.sizes.length > 0) {
        const firstSize = product.sizes[0];
        setSize(firstSize);
        // Set initial price based on first size
        const price = product.sizePricing?.[firstSize] || product.price;
        setCurrentPrice(price);
      } else {
        setCurrentPrice(product.price);
      }
    }
  };

  // NEW: Update price when size changes
  useEffect(() => {
    if (productData && size) {
      const price = productData.sizePricing?.[size] || productData.price;
      setCurrentPrice(price);
    }
  }, [size, productData]);

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) {
        console.log("No productId, skipping review fetch");
        return;
      }
      try {
        console.log("Fetching reviews for product:", productId);
        const res = await axios.post(`${backendUrl}/api/review/product`, {
          productId,
        });
        console.log("Reviews API response:", res.data);
        if (res.data.success) {
          setReviews(res.data.reviews || []);
          console.log("Reviews set:", res.data.reviews?.length || 0, "reviews");
        } else {
          console.log("Failed to fetch reviews:", res.data.message);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };
    fetchReviews();
  }, [productId, backendUrl]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId,
          rating,
          comment,
          userName: user?.name,
        },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Review submitted");
        setComment("");
        setRating(5);
        // refresh reviews
        const listRes = await axios.post(`${backendUrl}/api/review/product`, {
          productId,
        });
        if (listRes.data.success) setReviews(listRes.data.reviews || []);
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const hasDiscount = productData && Number(productData.discount) > 0;
  const finalPrice = currentPrice
    ? (
        Number(currentPrice) *
        (1 - Number(productData?.discount || 0) / 100)
      ).toFixed(2)
    : 0;
  const isElectronics = productData?.category === "Electronics";
  const specsEntries = Object.entries(productData?.specs || {});
  const isInStock =
    productData?.inStock !== false &&
    Number(productData?.stockQuantity ?? 0) > 0;

  return productData ? (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t-2 pt-10"
    >
      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl shadow-lg p-8">
        {/* Left Section: Images */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[20%] w-full gap-3">
            {productData.images && productData.images.length > 0 ? (
              productData.images.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className={`w-24 h-24 object-cover cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    image === item
                      ? "border-green-600 shadow-lg"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  alt={`Thumbnail ${index + 1}`}
                />
              ))
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border-2 border-gray-300">
                <span className="text-xs text-center px-2">No images</span>
              </div>
            )}
          </div>
          {/* Main Image */}
          <div className="w-full sm:w-[80%] relative group">
            <motion.img
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              src={image || "https://via.placeholder.com/500x500?text=No+Image"}
              className="w-full h-auto rounded-xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              alt="Main Product"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=Image+Failed";
              }}
            />
            {/* Image Zoom Hint */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Click to zoom
            </div>
            <div className="absolute top-4 right-4 bg-green-700 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              {productData.category || "Product"}
            </div>
            {productData.images && productData.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {productData.images.length} images
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="font-bold text-3xl text-gray-800 leading-tight">
              {productData.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <img src={assets.star_icon} className="w-4" alt="Star" />
                  <img src={assets.star_icon} className="w-4" alt="Star" />
                  <img src={assets.star_icon} className="w-4" alt="Star" />
                  <img src={assets.star_icon} className="w-4" alt="Star" />
                  <img
                    src={assets.star_dull_icon}
                    className="w-4"
                    alt="Dull Star"
                  />
                </div>
                <span className="text-lg font-bold text-yellow-500">4.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium border-l pl-4">
                  122 Reviews
                </span>
                <span
                  className="text-green-600 font-semibold"
                  title="Verified customer reviews"
                >
                  ✓ 118 Verified Purchases
                </span>
              </div>
            </div>
            {(productData.brand ||
              productData.model ||
              productData.warranty ||
              productData.sku ||
              (productData.tags && productData.tags.length > 0)) && (
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-700">
                {productData.brand && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-semibold">
                    Brand: {productData.brand}
                  </span>
                )}
                {productData.model && (
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-semibold">
                    Model: {productData.model}
                  </span>
                )}
                {productData.warranty && (
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                    Warranty: {productData.warranty}
                  </span>
                )}
                {productData.sku && (
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200 font-semibold">
                    SKU: {productData.sku}
                  </span>
                )}
                {productData.tags && productData.tags.length > 0 && (
                  <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full border border-slate-200 font-semibold">
                    Tags: {productData.tags.join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-green-700">
                {currency}
                {hasDiscount ? finalPrice : Number(currentPrice).toFixed(2)}
              </p>
              {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
                  {currency}
                  {Number(currentPrice).toFixed(2)}
                </span>
              )}
              <span
                className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full border ${
                  isInStock
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-rose-300 bg-rose-50 text-rose-700"
                }`}
              >
                {isInStock
                  ? `In Stock${
                      productData.stockQuantity
                        ? ` (${productData.stockQuantity})`
                        : ""
                    }`
                  : "Out of Stock"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {hasDiscount
                ? `You save ${productData.discount}%`
                : "Inclusive of all taxes"}
            </p>
            {size && productData.sizePricing?.[size] && (
              <p className="text-xs text-blue-600 font-semibold mt-2">
                Price for selected size: {size}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              {productData.description}
            </p>
          </div>

          {productData.sizes && productData.sizes.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800 mb-3">
                {isElectronics
                  ? "Select Variant (RAM/Storage/Config)"
                  : "Select Size/Quantity"}
              </p>
              <div className="flex gap-3 flex-wrap">
                {productData.sizes.map((item, index) => {
                  const sizePrice = productData.sizePricing?.[item];
                  const sizeQty = productData.sizeStock?.[item];
                  const sizeSoldOut =
                    sizeQty !== undefined && Number(sizeQty) <= 0;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSize(item)}
                      key={index}
                      disabled={sizeSoldOut}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 relative ${
                        sizeSoldOut
                          ? "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                          : item === size
                          ? "bg-green-600 text-white shadow-lg scale-105"
                          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{item}</span>
                        {sizePrice && (
                          <span
                            className={`text-xs mt-1 ${
                              item === size
                                ? "text-green-100"
                                : "text-green-600"
                            }`}
                          >
                            {currency}
                            {sizePrice.toFixed(2)}
                          </span>
                        )}
                        {sizeQty !== undefined && (
                          <span className="text-[11px] mt-1 text-gray-500">
                            {sizeSoldOut
                              ? "Out of stock"
                              : `${sizeQty} available`}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => addToCart(productData._id, size)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
              disabled={
                !isInStock ||
                !size ||
                (productData.sizeStock &&
                  Number(productData.sizeStock?.[size] || 0) <= 0)
              }
            >
              {!isInStock
                ? "Out of Stock"
                : productData.sizeStock &&
                  Number(productData.sizeStock?.[size] || 0) <= 0
                ? "Size Out of Stock"
                : "ADD TO CART"}
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => toggleWishlist(productData._id)}
                className={`border px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  wishlist?.includes(productData._id)
                    ? "border-rose-500 text-rose-600 bg-rose-50"
                    : "border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white"
                }`}
              >
                {wishlist?.includes(productData._id)
                  ? "Added to Wishlist"
                  : "Add to Wishlist"}
              </button>
              <button
                onClick={() => toggleCompare(productData._id)}
                className={`border px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  compareList?.includes(productData._id)
                    ? "border-amber-500 text-amber-600 bg-amber-50"
                    : "border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white"
                }`}
              >
                {compareList?.includes(productData._id)
                  ? "Added to Compare"
                  : "Compare"}
              </button>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl space-y-3 border-2 border-green-200">
            {isElectronics ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl font-bold">•</span>
                  <p className="text-gray-700">
                    100% authentic product with official warranty
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl font-bold">•</span>
                  <p className="text-gray-700">
                    Sealed box delivery and brand-new condition
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl font-bold">•</span>
                  <p className="text-gray-700">
                    Fast shipping and easy support for claims
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl font-bold">•</span>
                  <p className="text-gray-700">100% Farm-fresh guarantee</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl font-bold">•</span>
                  <p className="text-gray-700">Same-day delivery available</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl font-bold">•</span>
                  <p className="text-gray-700">
                    Easy return within 24 hours if not fresh
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Delivery & Services Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-2 border-gray-200 p-6 rounded-xl">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">FREE Delivery</p>
                <p className="text-xs text-gray-600">
                  For orders above $50 | Today
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-600">
                  7-day hassle-free returns | Free pickup
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Secure Transaction</p>
                <p className="text-xs text-gray-600">
                  Encrypted & protected checkout
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Top-rated Seller</p>
                <p className="text-xs text-gray-600">
                  99% positive feedback | 10K+ sales
                </p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {token && (
            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow-sm space-y-3">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Write a Review
              </h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 block">
                    Rating: {rating}/5
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                        title={`Rate ${r} stars`}
                      >
                        <span
                          className={`text-4xl cursor-pointer transition-colors ${
                            r <= rating
                              ? "text-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                  placeholder="Share your experience..."
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Description, Specs, Nutrition, Reviews */}
      <div className="mt-16">
        {(() => {
          const tabItems = [
            { id: "description", label: "Description" },
            ...(hasSpecs ? [{ id: "specs", label: "Specs" }] : []),
            ...(hasNutrition
              ? [{ id: "nutrition", label: "Nutrition Info" }]
              : []),
            {
              id: "reviews",
              label: `Reviews (${reviews.length || 0})`,
            },
          ];

          return (
            <>
              <div className="flex gap-2 border-b-2 flex-wrap">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-4 font-semibold transition-all ${
                      activeTab === tab.id
                        ? "border-b-4 border-green-600 text-green-600"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <motion.div className="bg-white p-8 rounded-b-xl shadow-lg">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      ...existing description content...
                    </motion.div>
                  )}

                  {activeTab === "specs" && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ...existing specs content...
                    </motion.div>
                  )}

                  {activeTab === "nutrition" && (
                    <motion.div
                      key="nutrition"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ...existing nutrition content...
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ...existing reviews content...
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          );
        })()}
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>

      {/* Sticky Add-To-Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg px-4 py-3 flex items-center gap-4 z-30">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{productData.name}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-700">
              {currency}
              {hasDiscount ? finalPrice : Number(currentPrice).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {currency}
                {Number(currentPrice).toFixed(2)}
              </span>
            )}
            <span
              className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full border ${
                isInStock
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {productData.sizes && productData.sizes.length > 0 && (
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {productData.sizes.map((s) => (
                <option
                  key={s}
                  value={s}
                  disabled={
                    productData.sizeStock &&
                    Number(productData.sizeStock?.[s] || 0) <= 0
                  }
                >
                  {s}
                  {productData.sizeStock &&
                    ` (${productData.sizeStock?.[s] ?? 0} left)`}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={
              !isInStock ||
              !size ||
              (productData.sizeStock &&
                Number(productData.sizeStock?.[size] || 0) <= 0)
            }
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-lg shadow"
          >
            {!isInStock ||
            (productData.sizeStock &&
              Number(productData.sizeStock?.[size] || 0) <= 0)
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  ) : (
    <p className="text-gray-600 dark:text-slate-400 mt-4">Loading product...</p>
  );
};

export default Product;

