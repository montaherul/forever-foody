import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useNavigate } from "react-router-dom";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products && products.length) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  if (!bestSeller.length) return null;

  return (
    <div className="my-10 bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-slate-800 py-10 rounded-2xl px-3 sm:px-6">
      {/* Header */}
      <div className="text-center text-3xl py-6">
        <Title text1={"TOP"} text2={"PICKS"} />
        <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-300 mt-4">
          Customer favorites across grocery, electronics, and fashion. Trusted
          deals that sell out fast.
        </p>
      </div>

    
      {/* Responsive product grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6 place-items-stretch">
            {bestSeller.map((item) => (
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

export default BestSeller;
