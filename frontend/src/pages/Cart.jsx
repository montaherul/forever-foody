import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
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
      className="border-t dark:border-slate-800 pt-14"
    >
      <div className="text-3xl mb-8">
        <Title text1={"YOUR"} text2={"CART"} />
        {cartData.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
            {cartData.length} item{cartData.length > 1 ? "s" : ""} in your cart
          </p>
        )}
      </div>

      {cartData.length === 0 ? (
        <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
  className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl"
>

          <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            Add some fresh groceries to get started!
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Shopping
          </button>
        </motion.div>
       
      ) : (
       <motion.div layout className="space-y-4">
  <AnimatePresence>
    {cartData.map((item, index) => {

            let productData = products.find(
              (product) => product._id === item._id
            );
            // Normalize pricing from new pricingId structure
            productData = normalizePricing(productData);
            return (
              <motion.div
  key={index}
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: 50 }}
  transition={{ duration: 0.3 }}
  className="bg-white dark:bg-slate-800 rounded-xl ..."
>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative group">
                    <img
                      src={productData.images[0]}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border-2 border-gray-200 dark:border-slate-600 group-hover:border-green-400 transition-all"
                      alt={productData.name}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all"></div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3
                      className="text-lg font-bold text-gray-800 dark:text-slate-100 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${productData._id}`)}
                    >
                      {productData.name}
                    </h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <p className="text-xl font-bold text-green-700 dark:text-green-400">
                        {currency}
                        {/* NEW: Use size-specific price if available */}
                        {(
                          productData.sizePricing?.[item.size] ||
                          productData.price
                        ).toFixed(2)}
                      </p>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.size}
                      </span>
                      {productData.isOrganic && (
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">
                          Organic
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-lg px-3 py-2 border-2 border-gray-200 dark:border-slate-600">
                      <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
                        Qty:
                      </label>
                      <input
                        onChange={(e) =>
                          e.target.value === "" || e.target.value === "0"
                            ? null
                            : updateQuantity(
                                item._id,
                                item.size,
                                Number(e.target.value)
                              )
                        }
                        className="w-16 px-2 py-1 text-center font-semibold bg-white dark:bg-slate-600 dark:text-slate-100 border-2 border-gray-300 dark:border-slate-500 rounded focus:border-green-500 focus:outline-none"
                        type="number"
                        min="1"
                        defaultValue={item.quantity}
                      />
                    </div>

                    <button
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors border-2 border-red-200 hover:border-red-400 group"
                      title="Remove item"
                    >
                      <img
                        src={assets.bin_icon}
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        alt="Remove"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
  </AnimatePresence>
</motion.div>
      )}

      {cartData.length > 0 && (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 my-20">
          <div className="flex-1">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-green-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-4">
                Have a promo code?
              </h3>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:border-green-500 focus:outline-none"
                />
                {appliedCoupon ? (
                  <button
                    onClick={clearCoupon}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => applyCoupon(couponCode)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponMessage && (
                <p
                  className={`mt-3 text-sm font-semibold ${
                    appliedCoupon
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {appliedCoupon
                    ? `Applied ${appliedCoupon.code}`
                    : couponMessage}
                </p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[450px]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-2 border-gray-200 dark:border-slate-700">
              <CartTotal />
              <button
                onClick={() => navigate("/place-order")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-6"
              >
                PROCEED TO CHECKOUT →
              </button>
              <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-slate-700 space-y-3">
                <motion.div
             whileHover={{ scale: 1.05 }}
           className="flex items-center gap-2 bg-gray-50 ..."
      >
                  <span className="text-green-600">✔</span>
                  <span>Free shipping on orders over $100</span>
                </motion.div>
                <motion.div
                 whileHover={{ scale: 1.05 }}
               className="flex items-center gap-2 bg-gray-50 ..."
                ></motion.div>
                  <span className="text-green-600">✔</span>
                  <span>Secure checkout</span>
                </div>
               <motion.div
  whileHover={{ scale: 1.05 }}
  className="flex items-center gap-2 bg-gray-50 ..."
>

                  <span className="text-green-600">✔</span>
                  <span>Same-day delivery available</span>
                </motion.div>
                <motion.div
  whileHover={{ scale: 1.05 }}
  className="flex items-center gap-2 bg-gray-50 ..."
>
                  <span className="text-green-600">✔</span>
                  <span>Easy returns within 30 days</span>
                </motion.div>
               <motion.div
  whileHover={{ scale: 1.05 }}
  className="flex items-center gap-2 bg-gray-50 ..."
>

                  <span className="text-green-600">✔</span>
                  <span>100% freshness guarantee</span>
                </motion.div>
              </div>
            </div>
          </div>
       
      )}
    </motion.div>
  );
};

export default Cart;
