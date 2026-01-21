import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { backendUrl, AdminContext } from "../config/adminConfig";
import { toast } from "react-toastify";

const Coupons = () => {
  const { token } = useContext(AdminContext);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minPurchase, setMinPurchase] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/coupon/list`, {
        headers: { token },
      });
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      } else {
        toast.error(res.data.message || "Failed to load coupons");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load coupons");
    }
  }, [token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const onCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/create`,
        {
          code,
          discountPercent,
          minPurchase,
          expiresAt: expiresAt || undefined,
          usageLimit: usageLimit || undefined,
        },
        { headers: { token } },
      );
      if (res.data.success) {
        toast.success("Coupon created");
        setCode("");
        setDiscountPercent(10);
        setMinPurchase(0);
        setExpiresAt("");
        setUsageLimit("");
        fetchCoupons();
      } else {
        toast.error(res.data.message || "Failed to create coupon");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const onRemove = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/remove`,
        { id },
        { headers: { token } },
      );
      if (res.data.success) {
        toast.success("Coupon removed");
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(res.data.message || "Failed to remove coupon");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove coupon");
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* ================= PAGE HEADER ================= */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage discount codes for your store.
          </p>
        </div>
      </div>

      {/* ================= CREATE COUPON ================= */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Create coupon
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Generate a discount code customers can apply at checkout.
        </p>

        <form
          onSubmit={onCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="SAVE10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  Math.max(1, Math.min(100, Number(e.target.value))),
                )
              }
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum purchase ($)
            </label>
            <input
              type="number"
              min="0"
              value={minPurchase}
              onChange={(e) =>
                setMinPurchase(Math.max(0, Number(e.target.value)))
              }
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration date
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage limit
            </label>
            <input
              type="number"
              min="1"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Leave blank for unlimited"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create coupon"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= COUPONS TABLE ================= */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Active coupons
          </h2>
          <span className="text-sm text-gray-500">{coupons.length} total</span>
        </div>

        {coupons.length === 0 ? (
          <div className="text-sm text-gray-500 bg-gray-50 border rounded-lg p-6 text-center">
            No coupons created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-3 px-3 font-medium">Code</th>
                  <th className="py-3 px-3 font-medium">Discount</th>
                  <th className="py-3 px-3 font-medium">Min purchase</th>
                  <th className="py-3 px-3 font-medium">Expires</th>
                  <th className="py-3 px-3 font-medium">Usage</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-3 font-semibold">{c.code}</td>
                    <td className="py-3 px-3">{c.discountPercent}%</td>
                    <td className="py-3 px-3">${c.minPurchase || 0}</td>
                    <td className="py-3 px-3">
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-3 px-3">
                      {c.usageLimit
                        ? `${c.usageCount || 0}/${c.usageLimit}`
                        : "∞"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onRemove(c._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
