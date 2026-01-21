import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

const drawerVariant = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
  exit: { x: "100%", transition: { duration: 0.3 } },
};

const backdropVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const itemVariant = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

const MiniCartDrawer = () => {
  const {
    cartDrawerOpen,
    toggleCartDrawer,
    cartItems,
    products,
    currency,
    calculateCartSubtotal,
    updateQuantity,
    removeFromCart,
    navigate,
    formatCurrency,
  } = useContext(ShopContext);

  const subtotal = calculateCartSubtotal();

  const items = Object.entries(cartItems || {}).flatMap(([productId, sizes]) =>
    Object.entries(sizes || {}).map(([size, qty]) => ({
      productId,
      size,
      qty,
    })),

  );

  const getProduct = (id) => products.find((p) => p._id === id);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") toggleCartDrawer(false);
    };
    if (cartDrawerOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [cartDrawerOpen, toggleCartDrawer]);
  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => toggleCartDrawer(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">My Cart</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {items.length} item(s)
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleCartDrawer(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl"
              >
                ✕
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto divide-y dark:divide-slate-800">
              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-gray-500"
                >
                  🛒
                  <p className="mt-2 font-medium">Your cart is empty</p>
                </motion.div>
              )}

              <AnimatePresence>
                {items.map((item) => {
                  const product = getProduct(item.productId);
                  const price =
                    product?.sizePricing?.[item.size] || product?.price || 0;
                  const line = price * item.qty;

                  return (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      variants={itemVariant}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="p-4 flex gap-3"
                    >
                      <img
                        className="w-16 h-16 rounded-xl border object-cover"
                        src={
                          product?.images?.[0] ||
                          "https://via.placeholder.com/64"
                        }
                        alt={product?.name || "Item"}
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-slate-100 line-clamp-1">
                          {product?.name || "Product"}
                        </p>
                        <p className="text-xs text-gray-500">{item.size}</p>

                        <div className="flex items-center gap-3 mt-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                Math.max(1, item.qty - 1),
                              )
                            }
                            className="w-7 h-7 rounded-full border flex items-center justify-center"
                          >
                            −
                          </motion.button>

                          <span className="min-w-[24px] text-center text-sm font-semibold">
                            {item.qty}
                          </span>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.qty + 1,
                              )
                            }
                            className="w-7 h-7 rounded-full border flex items-center justify-center"
                          >
                            +
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() =>
                              removeFromCart(item.productId, item.size)
                            }
                            className="ml-2 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                            title="Remove item"
                          >
                            🗑️
                          </motion.button>
                        </div>
                      </div>

                      <div className="text-right text-sm font-semibold text-gray-800 dark:text-white">
                        {formatCurrency(line)}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-5 border-t dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-slate-400">
                  Subtotal
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {currency}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toggleCartDrawer(false);
                    navigate("/cart");
                  }}
                  className="flex-1 bg-white dark:bg-slate-800 border-2 border-gray-900 dark:border-slate-600 text-gray-900 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  View Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toggleCartDrawer(false);
                    navigate("/place-order");
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                >
                  Checkout
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MiniCartDrawer;
