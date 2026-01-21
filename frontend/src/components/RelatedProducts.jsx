import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return related.length > 0 ? (
    <div className="my-20 bg-gradient-to-b from-white to-green-50 py-16 px-4 rounded-2xl">
      <div className="text-center text-3xl mb-10">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
        <p className="text-sm text-gray-600 mt-3">
          You might also like these fresh items
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.images}
            discount={item.discount}
            sizePricing={item.sizePricing}
            sizes={item.sizes}
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default RelatedProducts;
