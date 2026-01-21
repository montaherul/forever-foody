import React, { useContext, useEffect, useMemo, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    calculateCartSubtotal,
    appliedCoupon,
    delivery_fee,
    products,
    user,
    authChecked,
    normalizePricing,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [addressSource, setAddressSource] = useState("primary");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const applyAddressFromProfile = useMemo(
    () =>
      (source = "primary", prev = {}) => {
        const nameParts = (user?.name || "").trim().split(" ");
        const firstName = nameParts.shift() || "";
        const lastName = nameParts.join(" ");

        const pick = (primaryField, altField, fallback = "") => {
          if (source === "secondary") return user?.[altField] || fallback;
          return user?.[primaryField] || fallback;
        };

        return {
          ...prev,
          firstName: prev.firstName || firstName,
          lastName: prev.lastName || lastName,
          email: prev.email || user?.email || "",
          phone: prev.phone || user?.phone || "",
          street: pick(
            "deliveryStreet",
            "deliveryAltStreet",
            user?.address || ""
          ),
          city: pick("deliveryCity", "deliveryAltCity", user?.location || ""),
          state: pick("deliveryState", "deliveryAltState", ""),
          zipcode: pick("deliveryZipcode", "deliveryAltZipcode", ""),
          country: pick("deliveryCountry", "deliveryAltCountry", ""),
        };
      },
    [user]
  );

  // Prefill checkout form from profile while keeping it editable
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => applyAddressFromProfile(addressSource, prev));
  }, [user, addressSource, applyAddressFromProfile]);

  // Redirect to login if auth checked and not authenticated
  useEffect(() => {
    if (authChecked && !token) {
      navigate("/login");
    }
  }, [authChecked, token, navigate]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setFormSubmitting(true);
    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          if (cartItems[itemId][size] > 0) {
            let itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );
            // Normalize pricing from new pricingId structure
            itemInfo = normalizePricing(itemInfo);
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              // NEW: Add size-specific price to order item
              itemInfo.sizePrice =
                itemInfo.sizePricing?.[size] || itemInfo.price;
              orderItems.push(itemInfo);
            }
          }
        });
      });

      const subtotal = calculateCartSubtotal();
      const couponSavings = appliedCoupon
        ? subtotal >= (appliedCoupon.minPurchase || 0)
          ? Number(
              ((appliedCoupon.discountPercent / 100) * subtotal).toFixed(2)
            )
          : 0
        : 0;
      const finalAmount =
        subtotal === 0
          ? 0
          : Math.max(0, subtotal - couponSavings) + delivery_fee;

      let orderData = {
        address: formData,
        items: orderItems,
        amount: finalAmount,
        addressSource,
        coupon: appliedCoupon || null,
        couponSavings,
        paymentMethod: method,
      };

      switch (method) {
        case "cod":
        case "bkash":
        case "nagad": {
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            const msg =
              method === "cod"
                ? "Order placed successfully!"
                : "Order placed. Complete payment via " +
                  (method === "bkash" ? "bKash" : "Nagad") +
                  " to confirm.";
            toast.success(msg);
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        default:
          toast.error("Payment method not available");
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] border-t pt-10 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-3xl mb-8">
          <Title text1={"CHECKOUT"} text2={"DETAILS"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery Form */}
          <div className="lg:col-span-2">
            {/* Delivery Information Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                DELIVERY INFORMATION
              </h2>

              {/* Address Selector */}
              <div className="mb-6 flex items-center gap-4 flex-wrap">
                <label className="text-sm font-semibold text-gray-700">
                  Use saved address:
                </label>
                <select
                  value={addressSource}
                  onChange={(e) => setAddressSource(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="primary">Primary</option>
                  <option
                    value="secondary"
                    disabled={
                      !user?.deliveryAltStreet && !user?.deliveryAltCity
                    }
                  >
                    {user?.deliveryAltLabel
                      ? `Secondary - ${user.deliveryAltLabel}`
                      : "Secondary"}
                  </option>
                </select>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="firstName"
                    value={formData.firstName}
                    className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    type="text"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="lastName"
                    value={formData.lastName}
                    className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    type="text"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="email"
                  value={formData.email}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                  type="email"
                  placeholder="john@example.com"
                />
              </div>

              {/* Street */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="street"
                  value={formData.street}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                  type="text"
                  placeholder="123 Main Street"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="city"
                    value={formData.city}
                    className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    type="text"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="state"
                    value={formData.state}
                    className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    type="text"
                    placeholder="NY"
                  />
                </div>
              </div>

              {/* Zipcode & Country */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="zipcode"
                    value={formData.zipcode}
                    className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    type="text"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="country"
                    value={formData.country}
                    className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    type="text"
                    placeholder="United States"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="phone"
                  value={formData.phone}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                PAYMENT METHOD
              </h2>

              <div className="space-y-3">
                {[
                  {
                    key: "cod",
                    title: "Cash on Delivery",
                    description: "Pay when your order arrives at your doorstep",
                  },
                  {
                    key: "bkash",
                    title: "bKash",
                    description:
                      "Pay securely via bKash after placing the order",
                  },
                  {
                    key: "nagad",
                    title: "Nagad",
                    description:
                      "Pay securely via Nagad after placing the order",
                  },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setMethod(option.key)}
                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${
                      method === option.key
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white hover:border-green-400"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        method === option.key
                          ? "border-green-600 bg-green-600"
                          : "border-gray-400"
                      }`}
                    >
                      {method === option.key && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900">{option.title}</p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 sticky top-24 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                ORDER SUMMARY
              </h3>

              <div className="space-y-4 mb-6">
                <CartTotal />
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pt-6 border-t-2 border-green-300">
                <div className="flex items-center gap-3 text-sm text-green-800">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-green-800">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">Same-day Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-green-800">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">100% Fresh Guarantee</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  "✓ PLACE ORDER"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

