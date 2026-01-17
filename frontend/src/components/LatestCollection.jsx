import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext); // Only accessing the necessary value
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]); // Ensure that you re-fetch products if they change

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"NEW"} text2={"ARRIVALS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-300 mt-4">
          Fresh grocery picks, brand-new electronics, and the latest fashion
          drops. One cart, fast delivery.
        </p>
        <div className="flex justify-center gap-4 mt-6 text-sm flex-wrap">
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
            <span className="font-medium text-green-700 dark:text-green-400">
              Fast delivery
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
            <span className="font-medium text-blue-700 dark:text-blue-400">
              Secure checkout
            </span>
          </div>
          <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/30 px-4 py-2 rounded-full">
            <span className="font-medium text-pink-700 dark:text-pink-400">
              Free fashion returns
            </span>
          </div>
        </div>
      </div>
      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
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

export default LatestCollection;
