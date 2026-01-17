import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);
  return (
    <div className="my-10 bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-slate-800 py-10 rounded-2xl">
      <div className="text-center text-3xl py-8">
        <Title text1={"TOP"} text2={"PICKS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-300 mt-4">
          Customer favorites across grocery, electronics, and fashion. Trusted
          deals that sell out fast.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 px-4">
        {bestSeller.map((item, index) => (
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

export default BestSeller;
