import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

// tiny helper for stars
const Stars = ({ value = 4.8 }) => {
  const full = Math.round(Math.max(0, Math.min(5, value)));
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < full ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
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

  // optional (won’t break existing calls)
  rating = 4.8,
  reviewCount = 0,
}) => {
  const { currency, addToCart, navigate, formatCurrency } =
    useContext(ShopContext);

  // premium fallback image (no extra file needed)
  const fallbackImg = useMemo(() => {
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#0b1220" offset="0"/>
            <stop stop-color="#111827" offset="1"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <circle cx="470" cy="120" r="120" fill="rgba(245,158,11,0.16)"/>
        <circle cx="120" cy="340" r="140" fill="rgba(16,185,129,0.14)"/>
        <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
          fill="rgba(255,255,255,0.55)" font-size="26" font-family="Inter, Arial, sans-serif">
          No image
        </text>
      </svg>
    `);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }, []);

  const productImage =
    Array.isArray(image) && image.length > 0 ? image[0] : fallbackImg;

  const hasDiscount = Number(discount) > 0;

  const hasSizePricing = sizePricing && Object.keys(sizePricing).length > 0;
  const showFromPrice = hasSizePricing && sizes && sizes.length > 1;

  const sizeSoldOut = (sizes || []).every(
    (s) => sizeStock && sizeStock[s] !== undefined && Number(sizeStock[s]) <= 0,
  );

  const canQuickAdd = !sizes || sizes.length === 0 || sizes.length === 1;
  const quickAddSize = sizes && sizes.length === 1 ? sizes[0] : undefined;

  const finalPrice = hasDiscount
    ? (Number(price) * (1 - Number(discount) / 100)).toFixed(2)
    : Number(price).toFixed(2);

  return (
    <motion.div variants={cardVariant} initial="hidden" animate="show">
      <Link className="group block" to={id ? `/product/${id}` : "#"}>
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="
            relative overflow-hidden rounded-2xl
            border border-slate-200/70 dark:border-white/10
            bg-white dark:bg-slate-950
            shadow-sm hover:shadow-2xl
            transition-all
          "
        >
          {/* Premium glow ring (subtle) */}
          <div
            className="
              pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              [background:radial-gradient(800px_circle_at_20%_-20%,rgba(245,158,11,0.20),transparent_40%),radial-gradient(700px_circle_at_110%_10%,rgba(16,185,129,0.18),transparent_40%)]
            "
          />

          {/* Out of stock overlay */}
          {(!inStock || sizeSoldOut) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 dark:bg-slate-950/75 backdrop-blur-sm">
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-rose-700 dark:text-rose-200 font-bold">
                Out of Stock
              </div>
            </div>
          )}

          {/* Image */}
          <div className="relative">
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-56 object-cover"
              src={productImage}
              alt={name || "Product"}
              loading="lazy"
            />

            {/* Top gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/10 opacity-70" />

            {/* Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              {hasDiscount ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-amber-400 text-slate-900 shadow">
                  -{discount}%
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-slate-900/70 text-white border border-white/15">
                  NEW
                </span>
              )}

              {!inStock || sizeSoldOut ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-200 border border-rose-400/20">
                  SOLD OUT
                </span>
              ) : null}
            </div>

            {/* Quick Add (only for single-size/no-size items) */}
            {canQuickAdd && inStock && !sizeSoldOut && (
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="
                  absolute bottom-3 left-3 right-3 z-10
                  rounded-xl px-4 py-2.5
                  bg-amber-400 hover:bg-amber-500
                  text-slate-900 font-extrabold text-sm
                  shadow-lg
                  opacity-0 group-hover:opacity-100
                  transition-all
                "
                onClick={(e) => {
                  e.preventDefault();
                  if (quickAddSize) addToCart(id, quickAddSize);
                  else navigate(`/product/${id}`);
                }}
              >
                {quickAddSize ? "Quick Add" : "View & Add"}
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category (optional, subtle) */}
            {category ? (
              <div className="text-[11px] font-semibold text-slate-500 dark:text-white/55 uppercase tracking-wider">
                {category}
              </div>
            ) : null}

            {/* Name */}
            <div className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white line-clamp-2 min-h-[42px]">
              {name || "No Name"}
            </div>

            {/* Price + rating */}
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-300">
                  {showFromPrice && (
                    <span className="mr-1 text-xs font-semibold text-slate-500 dark:text-white/55">
                      From
                    </span>
                  )}
                  {formatCurrency(finalPrice)}
                </div>

                {hasDiscount && (
                  <div className="text-xs text-slate-400 dark:text-white/45 line-through">
                    {formatCurrency(Number(price).toFixed(2))}
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-xs">
                  <Stars value={rating} />
                  <span className="font-semibold text-slate-600 dark:text-white/70">
                    {Number(rating).toFixed(1)}
                  </span>
                </div>
                {reviewCount > 0 ? (
                  <div className="text-[11px] text-slate-500 dark:text-white/50">
                    ({reviewCount})
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 dark:text-white/50">
                    Trusted
                  </div>
                )}
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-white/70">
                Fast Delivery
              </span>

              <span
                className={
                  inStock && !sizeSoldOut
                    ? "px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-400/15"
                    : "px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-200 border border-rose-400/15"
                }
              >
                {inStock && !sizeSoldOut ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
