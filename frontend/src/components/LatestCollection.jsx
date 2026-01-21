import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useNavigate } from "react-router-dom";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products && products.length) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  if (!latestProducts.length) return null;

  return (
    <div className="my-10 px-3 sm:px-6">
      {/* Header */}
      <div className="text-center py-8 text-3xl">
        <Title text1={"NEW"} text2={"ARRIVALS"} />

        <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-300 mt-4">
          Fresh grocery picks, brand-new electronics, and the latest fashion
          drops. One cart, fast delivery.
        </p>

        <div className="flex justify-center gap-3 sm:gap-4 mt-6 text-xs sm:text-sm flex-wrap">
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <span className="font-medium text-green-700 dark:text-green-400">
              Fast delivery
            </span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <span className="font-medium text-blue-700 dark:text-blue-400">
              Secure checkout
            </span>
          </div>

          <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <span className="font-medium text-pink-700 dark:text-pink-400">
              Free fashion returns
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {/* Responsive product grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6 place-items-stretch">
            {latestProducts.map((item) => (
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

export default LatestCollection;
