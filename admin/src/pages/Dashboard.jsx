import React from "react";

const stats = [
  { title: "Total Revenue", value: "$24,560", change: "+12.4%" },
  { title: "Total Orders", value: "1,284", change: "+5.2%" },
  { title: "Customers", value: "842", change: "+3.1%" },
  { title: "Products", value: "312", change: "+1.8%" },
];

const recentOrders = [
  { id: "#ORD-9281", name: "John Doe", total: "$124.00", status: "Paid" },
  { id: "#ORD-9280", name: "Sarah Smith", total: "$78.50", status: "Pending" },
  { id: "#ORD-9279", name: "Michael Lee", total: "$256.90", status: "Paid" },
];

const lowStock = [
  { name: "Organic Apples", qty: 5 },
  { name: "Bluetooth Headphones", qty: 3 },
  { name: "Men's Running Shoes", qty: 2 },
];

const Dashboard = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of store performance and operations
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">{s.title}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">
              {s.value}
            </p>
            <p className="text-xs mt-2 text-green-600 font-medium">
              {s.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* -------- SALES OVERVIEW (chart placeholder) -------- */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-900">Sales overview</p>
            <select className="border rounded-lg px-2 py-1 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
          </div>

          <div className="h-64 rounded-xl bg-gray-50 border flex items-center justify-center text-gray-400 text-sm">
            📊 Sales chart goes here (Recharts / Chart.js)
          </div>
        </div>

        {/* -------- LOW STOCK -------- */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="font-semibold text-gray-900 mb-4">Low stock alerts</p>

          {lowStock.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600">
                {item.qty} left
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <p className="font-semibold text-gray-900">Recent orders</p>
          <button className="text-sm text-green-600 font-medium hover:underline">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Order</th>
                <th className="py-3 px-4 text-left font-medium">Customer</th>
                <th className="py-3 px-4 text-left font-medium">Total</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((o, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{o.id}</td>
                  <td className="py-3 px-4">{o.name}</td>
                  <td className="py-3 px-4">{o.total}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        o.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
