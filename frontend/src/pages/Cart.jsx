import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    applyCoupon,
    clearCoupon,
    appliedCoupon,
    couponMessage,
    normalizePricing,
    removeFromCart,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t dark:border-slate-800 pt-14 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-slate-900/30 dark:to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-3xl mb-8">
          <Title text1={"YOUR"} text2={"CART"} />
          {cartData.length > 0 && (
            <div className="flex items-center gap-3 mt-3">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {cartData.length}
                </span>{" "}
                item{cartData.length > 1 ? "s" : ""} in your cart
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
            </div>
          )}
        </div>

        {cartData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl border-2 border-dashed border-gray-300 dark:border-slate-700"
          >
            <div className="mb-4 text-6xl">🛒</div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-3">
              Your cart is empty
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-8 text-lg">
              Time to fill it up with fresh, delicious groceries!
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right"></i>
              Start Shopping Now
            </button>
          </motion.div>
        ) : (
          <motion.div layout id="cart"  className="space-y-3">
            <AnimatePresence>
              {cartData.map((item) => {
                let productData = products.find(
                  (product) => product._id === item._id,
                );
                // Normalize pricing from new pricingId structure
                productData = normalizePricing(productData);
                return (
                  <motion.div
                    key={`${item._id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl p-6 border-2 border-gray-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      {/* Product Image */}
                      <div className="relative group/image">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                        <img
                          src={productData.images[0]}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl border-3 border-gray-200 dark:border-slate-600 group-hover/image:border-emerald-400 dark:group-hover/image:border-emerald-500 transition-all duration-300 shadow-lg"
                          alt={productData.name}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-3">
                        <h3
                          className="text-lg font-bold text-gray-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2"
                          onClick={() =>
                            navigate(`/product/${productData._id}`)
                          }
                        >
                          {productData.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              Price:
                            </span>
                            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                              {currency}
                              {(
                                productData.sizePricing?.[item.size] ||
                                productData.price
                              ).toFixed(2)}
                            </p>
                          </div>
                          <span className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300 dark:border-emerald-600">
                            {item.size}
                          </span>
                          {productData.isOrganic && (
                            <span className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold border border-orange-300 dark:border-orange-600 flex items-center gap-1">
                              <i className="fa-solid fa-leaf text-xs"></i>{" "}
                              Organic
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700/50 rounded-xl px-3 py-2 border-2 border-gray-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                          <button
                            onClick={() => {
                              const newQty = item.quantity - 1;
                              if (newQty > 0)
                                updateQuantity(item._id, item.size, newQty);
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-bold hover:bg-emerald-50 dark:hover:bg-slate-600 px-2 py-1 rounded transition-colors"
                          >
                            −
                          </button>
                          <input
                            value={item.quantity}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= 1) {
                                updateQuantity(item._id, item.size, val);
                              }
                            }}
                            className="w-12 px-1 py-1 text-center font-bold bg-white dark:bg-slate-600 dark:text-slate-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            type="number"
                            min="1"
                          />

                          <button
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="text-emerald-600 hover:text-emerald-700 font-bold hover:bg-emerald-50 dark:hover:bg-slate-600 px-2 py-1 rounded transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => removeFromCart(item._id, item.size)}
                          className="ml-2 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                          title="Remove item"
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {cartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col lg:flex-row justify-between items-start gap-8 my-20"
          >
            {/* Coupon Section */}
            <motion.div
              whileHover={{ y: -4 }}
              className="flex-1 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-slate-800 dark:to-slate-800 p-8 rounded-3xl border-2 border-emerald-200 dark:border-emerald-700/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full">
                  <i className="fa-solid fa-ticket text-white text-lg"></i>
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                  Have a Promo Code?
                </h3>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter promo code (e.g., FRESH20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={appliedCoupon}
                  className="w-full px-5 py-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-600 dark:bg-slate-700 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                />
                {appliedCoupon ? (
                  <>
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-600"
                    >
                      <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">
                        Applied coupon:
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                          {appliedCoupon.code}
                        </span>
                        <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-bold">
                          {appliedCoupon.discountPercent}% OFF
                        </span>
                      </div>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearCoupon}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <i className="fa-solid fa-times mr-2"></i> Remove Coupon
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyCoupon(couponCode)}
                    className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-check-circle"></i> Apply Coupon
                  </motion.button>
                )}
                {couponMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-semibold rounded-lg px-4 py-3 ${
                      appliedCoupon
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600"
                    }`}
                  >
                    <i
                      className={`fa-solid ${appliedCoupon ? "fa-circle-check" : "fa-circle-exclamation"} mr-2`}
                    ></i>
                    {appliedCoupon
                      ? `Great! Coupon ${appliedCoupon.code} applied`
                      : couponMessage}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Summary Card */}
            <motion.div whileHover={{ y: -4 }} className="w-full lg:w-[480px]">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl p-8 border-2 border-gray-100 dark:border-slate-700 transition-all">
                <CartTotal />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/place-order")}
                  className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-bold text-lg py-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform mt-8 flex items-center justify-center gap-2 group"
                >
                  <i className="fa-solid fa-bag-shopping group-hover:scale-110 transition-transform"></i>
                  PROCEED TO CHECKOUT
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-slate-700 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Why shop with us
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-3 rounded-xl border-l-4 border-emerald-500 dark:border-emerald-400"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Free shipping on orders over $100
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-xl border-l-4 border-blue-500 dark:border-blue-400"
                  >
                    <span className="text-blue-600 dark:text-blue-400 text-lg flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Secure & encrypted checkout
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-xl border-l-4 border-purple-500 dark:border-purple-400"
                  >
                    <span className="text-purple-600 dark:text-purple-400 text-lg flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Same-day delivery available
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-3 rounded-xl border-l-4 border-orange-500 dark:border-orange-400"
                  >
                    <span className="text-orange-600 dark:text-orange-400 text-lg flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Easy returns within 30 days
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-3 rounded-xl border-l-4 border-rose-500 dark:border-rose-400"
                  >
                    <span className="text-rose-600 dark:text-rose-400 text-lg flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      100% freshness guarantee
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
