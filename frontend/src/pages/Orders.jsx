import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const STATUS_MAP = {
  placed: "Order Placed",
  confirmed: "Order Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
  "Order Placed": "Order Placed",
  Packing: "Packed",
  Shipped: "Shipped",
  "Out for delivery": "Out for Delivery",
  Delivered: "Delivered",
};

const STEP_MAP = [
  { code: "placed", label: "Placed" },
  { code: "confirmed", label: "Confirmed" },
  { code: "packed", label: "Packed" },
  { code: "shipped", label: "Shipped" },
  { code: "out_for_delivery", label: "Delivering" },
  { code: "delivered", label: "Delivered" },
];

const deriveStatusLabel = (status, statusCode) => {
  return STATUS_MAP[statusCode] || STATUS_MAP[status] || status || "Pending";
};

const stepIndex = (code) =>
  STEP_MAP.findIndex((s) => s.code === code) >= 0
    ? STEP_MAP.findIndex((s) => s.code === code)
    : 0;

const badgeTone = (statusCode) => {
  const tones = {
    placed: "bg-slate-100 text-slate-800 border-slate-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    packed: "bg-amber-100 text-amber-800 border-amber-300",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    out_for_delivery: "bg-orange-100 text-orange-800 border-orange-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
    cancelled: "bg-rose-100 text-rose-800 border-rose-300",
    returned: "bg-amber-50 text-amber-800 border-amber-300",
    refunded: "bg-cyan-50 text-cyan-800 border-cyan-300",
  };
  return tones[statusCode] || "bg-gray-100 text-gray-800 border-gray-300";
};

const Orders = () => {
  const { backendUrl, token, currency, user, navigate, authChecked } =
    useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrderData(
          (response.data.orders || []).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        );
      } else {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  useEffect(() => {
    if (authChecked && !token) {
      navigate("/login");
    }
  }, [authChecked, token, navigate]);

  const renderSteps = (order) => {
    const currentCode = order.statusCode || "placed";
    const current = stepIndex(currentCode);
    return (
      <ol className="flex items-center space-x-2 overflow-x-auto">
        {STEP_MAP.map((step, idx) => {
          const active = idx <= current;
          return (
            <li key={idx} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm ${
                    active
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {idx + 1}
                </div>
                <p
                  className={`text-xs mt-1 whitespace-nowrap ${
                    active ? "text-emerald-700 font-semibold" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {idx < STEP_MAP.length - 1 && (
                <div
                  className={`h-0.5 w-6 ${
                    idx < current ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                ></div>
              )}
            </li>
          );
        })}
      </ol>
    );
  };

  const renderTimeline = (history = []) => {
    const sorted = [...history].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
    if (sorted.length === 0) {
      return (
        <p className="text-sm text-slate-500">
          No status history available yet.
        </p>
      );
    }
    return (
      <ol className="space-y-3">
        {sorted.map((event, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <span
              className={`mt-1 h-2 w-2 rounded-full ${
                badgeTone(event.statusCode).split(" ")[0]
              }`}
            ></span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">
                  {deriveStatusLabel(event.status, event.statusCode)}
                </p>
                <span className="text-xs text-slate-500">
                  {event.createdAt
                    ? new Date(event.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>
              {event.note && (
                <p className="text-sm text-slate-700 mt-1">{event.note}</p>
              )}
              {(event.meta?.trackingNumber || event.meta?.courier) && (
                <p className="text-xs text-slate-600 mt-1">
                  {event.meta?.courier && `Courier: ${event.meta.courier}`}
                  {event.meta?.trackingNumber &&
                    ` · Tracking: ${event.meta.trackingNumber}`}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className="border-t pt-16 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>

        {user && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-l-emerald-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">
                  {user.name}
                </h3>
                <p className="text-slate-600 mb-1">{user.email}</p>
                {user.phone && (
                  <p className="text-slate-600 mb-1">{user.phone}</p>
                )}
                {user.address && (
                  <p className="text-slate-600">{user.address}</p>
                )}
              </div>
              <button
                onClick={() => (window.location.href = "/profile")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors shadow-md"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-lg">Loading your orders...</p>
            </div>
          ) : orderData.length > 0 ? (
            orderData.map((order, index) => {
              const statusLabel = deriveStatusLabel(
                order.status,
                order.statusCode
              );
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-slate-200"
                >
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-br from-white to-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            {order.orderCode || order._id}
                          </p>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(
                              order.statusCode
                            )}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {currency}
                          {order.amount}
                        </p>
                        <p className="text-sm text-slate-600">
                          Placed: {new Date(order.date).toLocaleDateString()} ·{" "}
                          {order.items?.length || 0} items
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder === index ? null : index
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm rounded-xl font-semibold transition-colors shadow-md"
                      >
                        {selectedOrder === index
                          ? "Hide Details"
                          : "Track Order"}
                      </button>
                    </div>
                  </div>

                  {selectedOrder === index && (
                    <div className="bg-slate-50/60 px-6 py-5 space-y-5">
                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900 mb-4">
                          Order Progress
                        </p>
                        {renderSteps(order)}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                          <p className="text-sm font-semibold text-slate-900 mb-3">
                            Order Items
                          </p>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between border-b border-slate-100 pb-2"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                                    src={item.images?.[0]}
                                    alt={item.name}
                                  />
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                      Size: {item.size} · Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {currency}
                                  {(item.sizePrice || item.price || 0) *
                                    (item.quantity || 1)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 mb-2">
                              Delivery Address
                            </p>
                            <p className="text-sm text-slate-700 leading-5">
                              {order.address?.firstName}{" "}
                              {order.address?.lastName}
                              <br />
                              {order.address?.street}
                              <br />
                              {order.address?.city}, {order.address?.state}{" "}
                              {order.address?.zipcode}
                              <br />
                              {order.address?.country}
                              <br />
                              {order.address?.phone}
                            </p>
                          </div>

                          {(order.logistics?.courier ||
                            order.logistics?.trackingNumber) && (
                            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
                              <p className="font-semibold text-slate-900">
                                Tracking
                              </p>
                              {order.logistics?.courier && (
                                <p>Courier: {order.logistics.courier}</p>
                              )}
                              {order.logistics?.trackingNumber && (
                                <p>
                                  Tracking: {order.logistics.trackingNumber}
                                </p>
                              )}
                              {order.logistics?.expectedDelivery && (
                                <p>
                                  Expected:{" "}
                                  {new Date(
                                    order.logistics.expectedDelivery
                                  ).toDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-900">
                            Status Timeline
                          </p>
                          <span className="text-xs text-slate-500">
                            Full order history
                          </span>
                        </div>
                        {renderTimeline(order.statusHistory)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-slate-500 text-lg mb-4">No orders yet</p>
              <button
                onClick={() => (window.location.href = "/collection")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors shadow-md"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
