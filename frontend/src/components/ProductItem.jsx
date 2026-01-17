import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ProductItem = ({
  id,
  image,
  name,
  price,
  discount = 0,
  sizePricing,
  sizes,
  category,
  inStock = true,
  stockQuantity,
  sizeStock,
}) => {
  const { currency, addToCart, navigate } = useContext(ShopContext);

  const productImage =
    Array.isArray(image) && image.length > 0 ? image[0] : "placeholder.jpg";

  const hasDiscount = Number(discount) > 0;

  const hasSizePricing = sizePricing && Object.keys(sizePricing).length > 0;
  const showFromPrice = hasSizePricing && sizes && sizes.length > 1;
  const sizeSoldOut = (sizes || []).every(
    (s) => sizeStock && sizeStock[s] !== undefined && Number(sizeStock[s]) <= 0
  );

  const canQuickAdd = !sizes || sizes.length === 0 || sizes.length === 1;
  const quickAddSize = sizes && sizes.length === 1 ? sizes[0] : undefined;

  const finalPrice = hasDiscount
    ? (Number(price) * (1 - Number(discount) / 100)).toFixed(2)
    : Number(price).toFixed(2);

  return (
    <motion.div variants={cardVariant} initial="hidden" animate="show">
      <Link
        className="text-gray-700 dark:text-slate-200 cursor-pointer group block"
        to={id ? `/product/${id}` : "#"}
      >
        <motion.div
          whileHover={{ y: -10, scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all"
        >
          {/* Out of stock overlay */}
          {(!inStock || sizeSoldOut) && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center text-rose-600 font-bold text-lg">
              Out of Stock
            </div>
          )}

          {/* Image */}
          <div className="relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-56 object-cover"
              src={productImage}
              alt={name || "Product"}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Quick add */}
            {canQuickAdd && inStock && !sizeSoldOut && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  if (quickAddSize) {
                    addToCart(id, quickAddSize);
                  } else {
                    navigate(`/product/${id}`);
                  }
                }}
              >
                {quickAddSize ? "Quick Add" : "View & Add"}
              </motion.button>
            )}
          </div>

          {/* Badge */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
          >
            {hasDiscount ? `-${discount}%` : "New"}
          </motion.div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 line-clamp-2 min-h-[40px]">
              {name || "No Name"}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {showFromPrice && (
                    <span className="text-xs font-normal text-gray-500">
                      From{" "}
                    </span>
                  )}
                  {currency}
                  {finalPrice}
                </p>

                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    {currency}
                    {Number(price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-medium">(4.8)</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
              <span className="text-green-600 dark:text-green-400">
                Fast Delivery
              </span>

              <span
                className={`px-2 py-1 rounded-lg ${
                  inStock
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                }`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
