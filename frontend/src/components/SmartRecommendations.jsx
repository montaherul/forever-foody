import React, { useContext, useMemo } from "react";
import ProductItem from "./ProductItem";
import { ShopContext } from "../context/ShopContext";

// Simple heuristic "AI" recommendation: prioritize bestsellers, then discounts, same category as first product.
const SmartRecommendations = () => {
  const { products } = useContext(ShopContext);

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
    <div className="my-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Smart Picks
        </h3>
        <p className="text-sm text-gray-600">
          AI-style recommendations based on popularity & deals
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {picks.map((item) => (
          <ProductItem
            key={item._id}
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
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;
