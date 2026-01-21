import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { backendUrl } from "../config/adminConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  // Normalize pricingId to sizePricing for display
  const normalizePricing = (product) => {
    if (!product) return product;

    // If product already has sizePricing (old format), return as is
    if (product.sizePricing) {
      return product;
    }

    // If product has pricingId (new format), convert to sizePricing
    if (product.pricingId && product.pricingId.sizes) {
      const sizePricing = {};
      product.pricingId.sizes.forEach((sizeObj) => {
        sizePricing[sizeObj.size] = sizeObj.price;
      });
      return {
        ...product,
        sizePricing,
      };
    }

    // Fallback: no pricing data
    return product;
  };

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        // Normalize all products for consistent display
        const normalizedProducts = response.data.products.map(normalizePricing);
        setList(normalizedProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  console.log("Fetched Products:", list);

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Fetch token
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }, // ✅ Pass token properly
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all products across categories ({list.length} total)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/add")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            + Add product
          </button>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[90px_1fr_140px_200px_140px] bg-gray-50 border-b px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div>Image</div>
          <div>Product</div>
          <div>Category</div>
          <div>Pricing</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {list.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[70px_1fr_auto] md:grid-cols-[90px_1fr_140px_200px_140px] items-center gap-3 px-4 py-4 hover:bg-gray-50 transition"
              >
                {/* Image */}
                <div>
                  <img
                    className="w-14 h-14 rounded-lg object-cover border"
                    src={
                      item.images?.[0] ||
                      "https://via.placeholder.com/64?text=No+Image"
                    }
                    alt={item.name}
                  />
                </div>

                {/* Product */}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {item._id?.slice(-8)}
                  </p>
                </div>

                {/* Category */}
                <div className="hidden md:block">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {item.category}
                  </span>
                </div>

                {/* Pricing */}
                <div className="hidden md:block">
                  {item.sizes && item.sizes.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        Base:{" "}
                        <span className="font-semibold text-green-600">
                          ${item.price}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.map((size, idx) => {
                          const sizePrice = item.sizePricing?.[size];
                          return (
                            <span
                              key={idx}
                              className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded border"
                            >
                              {size}:{" "}
                              {sizePrice ? `$${sizePrice}` : `$${item.price}`}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-green-600">
                      ${item.price}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() =>
                      navigate("/add", { state: { product: item } })
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                📦
              </div>
              <p className="text-sm font-medium text-gray-700">
                No products found
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Start by creating your first product.
              </p>
              <button
                onClick={() => navigate("/add")}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg"
              >
                Add product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
