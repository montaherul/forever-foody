import { useEffect, useMemo, useState, useContext, useCallback } from "react";
import axios from "axios";
import { backendUrl, currency, AdminContext } from "../config/adminConfig";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const STATUS_OPTIONS = [
  { code: "placed", label: "Order Placed" },
  { code: "confirmed", label: "Order Confirmed" },
  { code: "packed", label: "Packed" },
  { code: "shipped", label: "Shipped" },
  { code: "out_for_delivery", label: "Out for Delivery" },
  { code: "delivered", label: "Delivered" },
  { code: "completed", label: "Completed" },
  { code: "cancelled", label: "Cancelled" },
  { code: "returned", label: "Returned" },
  { code: "refunded", label: "Refunded" },
];

const statusToLabel = (status, statusCode) => {
  if (!status && !statusCode) return "";
  const match = STATUS_OPTIONS.find(
    (s) => s.code === statusCode || s.label === status,
  );
  return match?.label || status || "";
};

const Orders = () => {
  const { token } = useContext(AdminContext);

  const badgeTone = (statusCode) => {
    const tones = {
      placed: "bg-slate-100 text-slate-800 border-slate-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      packed: "bg-amber-100 text-amber-800 border-amber-200",
      shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
      out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancelled: "bg-rose-100 text-rose-800 border-rose-200",
      returned: "bg-amber-50 text-amber-800 border-amber-200",
      refunded: "bg-cyan-50 text-cyan-800 border-cyan-200",
    };
    return tones[statusCode] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    payment: "all",
    search: "",
  });
  const [expanded, setExpanded] = useState({});
  const [drafts, setDrafts] = useState({});

  const fetchAllOrders = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const statusOk =
        filters.status === "all" ||
        order.statusCode === filters.status ||
        order.status === filters.status;
      const paymentOk =
        filters.payment === "all" ||
        (filters.payment === "paid" && order.payment) ||
        (filters.payment === "unpaid" && !order.payment);
      const term = filters.search.trim().toLowerCase();
      const searchOk =
        !term ||
        order._id?.toLowerCase().includes(term) ||
        order.orderCode?.toLowerCase().includes(term) ||
        order.address?.firstName?.toLowerCase().includes(term) ||
        order.address?.lastName?.toLowerCase().includes(term) ||
        order.address?.email?.toLowerCase().includes(term);
      return statusOk && paymentOk && searchOk;
    });
  }, [orders, filters]);

  const updateDraft = (orderId, patch) => {
    setDrafts((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), ...patch },
    }));
  };

  const statusHandler = async (orderId) => {
    const payload = drafts[orderId] || {};
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, ...payload },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Order updated");
        await fetchAllOrders();
        updateDraft(orderId, {});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const renderTimeline = (history = []) => {
    const sorted = [...history].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    );

    return (
      <ol className="space-y-4">
        {sorted.map((event, idx) => (
          <li
            key={idx}
            className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {/* Status dot */}
            <div className="mt-2 flex flex-col items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  badgeTone(event.statusCode).split(" ")[0]
                }`}
              ></span>
              {idx !== sorted.length - 1 && (
                <span className="w-px flex-1 bg-slate-200 mt-2"></span>
              )}
            </div>

            {/* Timeline content */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900 text-sm">
                  {statusToLabel(event.status, event.statusCode)}
                </p>

                {event.actorName && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {event.actorType || "system"} · {event.actorName}
                  </span>
                )}

                <span className="text-xs text-slate-500">
                  {event.createdAt
                    ? new Date(event.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>

              {/* Internal note */}
              {event.note && (
                <p className="text-sm text-slate-700 leading-relaxed">
                  {event.note}
                </p>
              )}

              {/* Logistics info */}
              {(event.meta?.courier ||
                event.meta?.trackingNumber ||
                event.meta?.expectedDelivery) && (
                <div className="text-xs text-slate-600 space-y-0.5">
                  {event.meta?.courier && (
                    <p>
                      🚚 Courier:{" "}
                      <span className="font-semibold">
                        {event.meta.courier}
                      </span>
                    </p>
                  )}
                  {event.meta?.trackingNumber && (
                    <p>
                      🔎 Tracking:{" "}
                      <span className="font-semibold">
                        {event.meta.trackingNumber}
                      </span>
                    </p>
                  )}
                  {event.meta?.expectedDelivery && (
                    <p>
                      📦 ETA:{" "}
                      <span className="font-semibold">
                        {new Date(event.meta.expectedDelivery).toDateString()}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Warehouse / supplier */}
              {(event.meta?.warehouse || event.meta?.supplier) && (
                <p className="text-xs text-slate-600">
                  🏭 Source:{" "}
                  <span className="font-semibold">
                    {event.meta?.warehouse || event.meta?.supplier}
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}

        {/* Empty timeline */}
        {sorted.length === 0 && (
          <li className="text-center py-6 text-sm text-slate-500">
            No timeline events recorded for this order.
          </li>
        )}
      </ol>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 rounded-3xl border border-slate-200 shadow-xl p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-sm font-semibold tracking-wide text-emerald-600 uppercase">
            Control Center
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Order Management & Traceability
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor, update, and audit every order event ({orders.length} total)
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by code, name, email"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:border-emerald-400 focus:ring focus:ring-emerald-100"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:border-emerald-400 focus:ring focus:ring-emerald-100"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:border-emerald-400 focus:ring focus:ring-emerald-100"
            value={filters.payment}
            onChange={(e) =>
              setFilters((f) => ({ ...f, payment: e.target.value }))
            }
          >
            <option value="all">Payment: All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((order) => {
            const draft = drafts[order._id] || {};
            const statusLabel = statusToLabel(order.status, order.statusCode);
            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 shadow-inner">
                      <img
                        className="w-10 h-10 object-contain"
                        src={assets.parcel_icon}
                        alt="Order"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        {order.orderCode || order._id}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.date).toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        {order.paymentMethod && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                            {order.paymentMethod}
                          </span>
                        )}
                        <span
                          className={`rounded-full border px-2.5 py-1 font-semibold ${
                            order.payment
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                        >
                          {order.payment ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 text-right">
                    <div className="flex items-center gap-2 text-3xl font-bold text-emerald-700">
                      <span>{currency}</span>
                      <span>{order.amount}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${badgeTone(
                        order.statusCode,
                      )}`}
                    >
                      {statusLabel}
                    </span>
                    <button
                      className="text-emerald-700 text-sm font-semibold hover:underline"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [order._id]: !prev[order._id],
                        }))
                      }
                    >
                      {expanded[order._id] ? "Hide details" : "Open order"}
                    </button>
                  </div>
                </div>

                {expanded[order._id] && (
                  <div className="space-y-6 px-6 py-6 bg-slate-50/70">
                    {/* ================= ORDER ITEMS + DELIVERY ================= */}
                    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                      {/* -------- ORDER ITEMS -------- */}
                      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-900">
                            Order items ({order.items?.length || 0})
                          </p>
                          <p className="text-xs text-slate-500">
                            Warehouse:{" "}
                            {order.logistics?.warehouse || "Not assigned"}
                          </p>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-3"
                            >
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {item.name}
                                </p>
                                <p className="text-xs text-slate-600">
                                  Size: {item.size} • Qty: {item.quantity}
                                </p>
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

                      {/* -------- DELIVERY INFO -------- */}
                      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 mb-2">
                            Delivery information
                          </p>
                          <p className="text-sm text-slate-700 leading-5">
                            {order.address?.street}
                            <br />
                            {order.address?.city}, {order.address?.state}{" "}
                            {order.address?.zipcode}
                            <br />
                            {order.address?.country}
                            <br />
                            <span className="font-medium">
                              {order.address?.phone}
                            </span>
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3 border text-xs space-y-1">
                          <p className="font-semibold text-slate-900">
                            Tracking
                          </p>
                          <p>
                            Courier:{" "}
                            {order.logistics?.courier || "Not assigned"}
                          </p>
                          <p>
                            Tracking:{" "}
                            {order.logistics?.trackingNumber || "Not set"}
                          </p>
                          {order.logistics?.expectedDelivery && (
                            <p>
                              ETA:{" "}
                              {new Date(
                                order.logistics.expectedDelivery,
                              ).toDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ================= TIMELINE + UPDATE ================= */}
                    <div className="grid gap-4 lg:grid-cols-[2fr_1.3fr]">
                      {/* -------- TIMELINE -------- */}
                      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-900">
                            Order timeline
                          </p>
                          <span className="text-xs text-slate-500">
                            Immutable audit log
                          </span>
                        </div>

                        {renderTimeline(order.statusHistory)}
                      </div>

                      {/* -------- UPDATE PANEL -------- */}
                      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                        <p className="text-sm font-semibold text-slate-900">
                          Update status & logistics
                        </p>

                        <select
                          className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                          value={draft.status || order.statusCode || "placed"}
                          onChange={(e) =>
                            updateDraft(order._id, { status: e.target.value })
                          }
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.code} value={opt.code}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            className="rounded-lg border px-3 py-2 text-sm"
                            placeholder="Courier"
                            defaultValue={order.logistics?.courier}
                            onChange={(e) =>
                              updateDraft(order._id, {
                                courier: e.target.value,
                              })
                            }
                          />

                          <input
                            className="rounded-lg border px-3 py-2 text-sm"
                            placeholder="Tracking number"
                            defaultValue={order.logistics?.trackingNumber}
                            onChange={(e) =>
                              updateDraft(order._id, {
                                trackingNumber: e.target.value,
                              })
                            }
                          />

                          <input
                            type="date"
                            className="rounded-lg border px-3 py-2 text-sm"
                            defaultValue={
                              order.logistics?.expectedDelivery
                                ? new Date(order.logistics.expectedDelivery)
                                    .toISOString()
                                    .slice(0, 10)
                                : ""
                            }
                            onChange={(e) =>
                              updateDraft(order._id, {
                                expectedDelivery: e.target.value,
                              })
                            }
                          />

                          <input
                            className="rounded-lg border px-3 py-2 text-sm"
                            placeholder="Warehouse / Supplier"
                            defaultValue={
                              order.logistics?.warehouse ||
                              order.logistics?.supplier
                            }
                            onChange={(e) =>
                              updateDraft(order._id, {
                                warehouse: e.target.value,
                                supplier: e.target.value,
                              })
                            }
                          />
                        </div>

                        <textarea
                          rows={3}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          placeholder="Internal note (audit log)"
                          onChange={(e) =>
                            updateDraft(order._id, { note: e.target.value })
                          }
                        />

                        <div className="flex gap-3 pt-2">
                          <button
                            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow"
                            onClick={() => statusHandler(order._id)}
                          >
                            Save update
                          </button>

                          <button
                            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                            onClick={() => updateDraft(order._id, {})}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-slate-700 font-semibold text-lg">
            No orders found
          </p>
          <p className="text-slate-500">
            Orders will appear here once customers place them
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
