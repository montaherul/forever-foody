import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const textVariant = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  /* ---------------- FETCH PRODUCTS FROM BACKEND ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 🔥 change URL if needed
        const res = await axios.get(
          "https://forever-main-2.onrender.com/api/product/list"
        );
        setProducts(res.data.products.filter((p) => p.inStock));
        setLoading(false);
      } catch (error) {
        console.error("Hero product fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [products]);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-xl font-semibold">
        Loading hero...
      </div>
    );
  }

  const activeProduct = products[index];


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col sm:flex-row border border-green-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-gradient-to-r from-green-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 shadow-2xl my-10"
    >
      {/* ---------------- LEFT CONTENT ---------------- */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-20 sm:py-0 px-10">
        <div className="text-gray-800 dark:text-slate-100 max-w-xl">
          <motion.p
            variants={textVariant}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-semibold text-green-600 tracking-widest text-sm mb-3"
          >
            TRENDING PRODUCT
          </motion.p>

          {/* 🔥 PRODUCT NAME ANIMATION */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeProduct._id + "-title"}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-extrabold text-3xl md:text-4xl lg:text-5xl min-h-[120px] leading-tight text-green-900 dark:text-green-400"
            >
              {activeProduct.name}
            </motion.h1>
          </AnimatePresence>

          {/* 🔥 PRODUCT DESCRIPTION ANIMATION */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeProduct._id + "-desc"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-gray-600 dark:text-slate-300 mt-4 text-base md:text-lg min-h-[96px] line-clamp-4"
            >
              {activeProduct.description}
            </motion.p>
          </AnimatePresence>

          <motion.div
            variants={textVariant}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex items-center gap-5 mt-8"
          >
            {/* 🔥 PRICE ANIMATION */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeProduct._id + "-price"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-2xl md:text-3xl font-bold text-orange-600"
              >
                ₹{activeProduct.price}
                {activeProduct.discount > 0 && (
                  <span className="ml-2 text-sm md:text-base text-green-600 font-semibold">
                    -{activeProduct.discount}%
                  </span>
                )}
              </motion.p>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/product/${activeProduct._id}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            >
              SHOP NOW
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ---------------- RIGHT IMAGE ---------------- */}
      <div className="w-full sm:w-1/2 relative overflow-hidden min-h-[380px] bg-white">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeProduct._id}
            src={activeProduct.images?.[0]}
            alt={activeProduct.name}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-contain absolute inset-0 p-8"
          />
        </AnimatePresence>

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-200/20 via-transparent to-orange-200/20" />
      </div>
    </motion.div>
  );
};

export default Hero;
