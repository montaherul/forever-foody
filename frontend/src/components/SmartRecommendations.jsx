import React, { useContext, useMemo } from "react";
import ProductItem from "./ProductItem";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

// Simple heuristic "AI" recommendation: prioritize bestsellers, then discounts, in-stock
const SmartRecommendations = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const picks = useMemo(() => {
    if (!products || products.length === 0) return [];
    const byScore = products.map((p) => {
      const score =
        (p.bestseller ? 2 : 0) +
        Number(p.discount || 0) / 20 +
        (p.inStock ? 0.5 : 0);

      return { ...p, _score: score };
    });

    return byScore.sort((a, b) => b._score - a._score).slice(0, 6);
  }, [products]);

  if (!picks.length) return null;

  return (
    <div className="my-10 px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Smart Picks
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
          AI-style recommendations based on popularity & deals
        </p>
      </div>

      {/* Responsive grid */}
      {/* Responsive product grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6 place-items-stretch">
            {picks.map((item) => (
              <div key={item._id} className="w-full h-full flex">
                <ProductItem
                  id={item._id}
                  image={item.images}
                  name={item.name}
                  price={item.price}
                  discount={item.discount}
                  sizePricing={item.sizePricing}
                  sizes={item.sizes}
                  category={item.category}
                  inStock={item.inStock}
                  stockQuantity={item.stockQuantity}
                  sizeStock={item.sizeStock}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEE MORE CTA */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/collection")}
          className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-2xl transition-all"
        >
          See more products
          <span className="transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default SmartRecommendations;
