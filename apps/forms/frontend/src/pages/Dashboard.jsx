// PerfumeAnalyticsDashboard.jsx — Dark Theme Version



// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------
// PerfumeAnalyticsDashboard.jsx — Dark Theme Version
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Trophy, Users, Box, DollarSign } from "lucide-react";

const COLORS = ["#6366F1", "#0EA5E9", "#F59E0B", "#EF4444", "#10B981"];

// -------------------------------------------------------------
// Fake Data
// -------------------------------------------------------------
const products = [
  { id: 1, name: "Noir Velvet 50ml", category: "Women", stock: 12, price: 45 },
  { id: 2, name: "Cedar Musk 100ml", category: "Men", stock: 3, price: 68 },
  { id: 3, name: "Ocean Breeze 30ml", category: "Unisex", stock: 20, price: 30 },
  { id: 4, name: "Amber Night 50ml", category: "Women", stock: 0, price: 55 },
  { id: 5, name: "Spice Route 100ml", category: "Men", stock: 7, price: 72 },
];

const associates = [
  { id: 1, name: "Leah", region: "London" },
  { id: 2, name: "Marcus", region: "Manchester" },
  { id: 3, name: "Aisha", region: "Bristol" },
  { id: 4, name: "Oliver", region: "Leeds" },
];

const sales = [
    // ----------- November 2025 -----------
    { id: 101, date: "2025-11-07T10:12:00", productId: 3, quantity: 2, price: 30, associateId: 1, channel: "in-store", customerType: "new", profitMargin: 0.42 },
    { id: 102, date: "2025-11-07T11:05:00", productId: 1, quantity: 1, price: 45, associateId: 2, channel: "in-store", customerType: "returning", profitMargin: 0.55 },
    { id: 103, date: "2025-11-06T15:30:00", productId: 2, quantity: 1, price: 68, associateId: 2, channel: "online", customerType: "new", profitMargin: 0.61 },
    { id: 104, date: "2025-11-05T13:00:00", productId: 5, quantity: 1, price: 72, associateId: 3, channel: "in-store", customerType: "new", profitMargin: 0.48 },
    { id: 105, date: "2025-11-04T16:45:00", productId: 4, quantity: 1, price: 55, associateId: 1, channel: "in-store", customerType: "returning", profitMargin: 0.52 },
    { id: 106, date: "2025-11-03T09:20:00", productId: 3, quantity: 3, price: 30, associateId: 4, channel: "in-store", customerType: "new", profitMargin: 0.44 },
    { id: 107, date: "2025-11-03T10:10:00", productId: 4, quantity: 2, price: 110, associateId: 4, channel: "online", customerType: "returning", profitMargin: 0.69 },
    { id: 108, date: "2025-11-02T17:25:00", productId: 3, quantity: 1, price: 89, associateId: 1, channel: "in-store", customerType: "new", profitMargin: 0.50 },
    { id: 109, date: "2025-11-02T14:55:00", productId: 1, quantity: 2, price: 45, associateId: 3, channel: "online", customerType: "returning", profitMargin: 0.55 },
    { id: 110, date: "2025-11-01T12:40:00", productId: 2, quantity: 1, price: 160, associateId: 2, channel: "in-store", customerType: "new", profitMargin: 0.72 },
  
    // ----------- October 2025 -----------
    { id: 111, date: "2025-10-30T09:30:00", productId: 3, quantity: 1, price: 30, associateId: 1, channel: "in-store", customerType: "new", profitMargin: 0.42 },
    { id: 112, date: "2025-10-29T18:10:00", productId: 1, quantity: 1, price: 95, associateId: 4, channel: "online", customerType: "new", profitMargin: 0.65 },
    { id: 113, date: "2025-10-28T16:45:00", productId: 5, quantity: 2, price: 72, associateId: 3, channel: "in-store", customerType: "returning", profitMargin: 0.48 },
    { id: 114, date: "2025-10-28T13:25:00", productId: 1, quantity: 1, price: 45, associateId: 2, channel: "in-store", customerType: "new", profitMargin: 0.55 },
    { id: 115, date: "2025-10-27T11:10:00", productId: 4, quantity: 3, price: 55, associateId: 1, channel: "in-store", customerType: "returning", profitMargin: 0.52 },
  
    // ----------- Refunds -----------
    { id: 116, date: "2025-11-03T13:40:00", productId: 3, quantity: -1, price: 30, associateId: 4, channel: "in-store", customerType: "refund", profitMargin: -0.42 },
    { id: 117, date: "2025-10-28T17:00:00", productId: 1, quantity: -1, price: 45, associateId: 2, channel: "in-store", customerType: "refund", profitMargin: -0.55 },
  ];

// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(value);

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------
export default function PerfumeAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  // ----------------------------
  // Stats
  // ----------------------------
  const totalRevenue = useMemo(() => sales.reduce((s, r) => s + r.price * r.quantity, 0), []);
  const totalUnits = useMemo(() => sales.reduce((s, r) => s + r.quantity, 0), []);
  const avgOrderValue = totalRevenue / sales.length || 0;

  // ----------------------------
  // Product Summary
  // ----------------------------
  const productSummary = useMemo(() => {
    const map = {};
    products.forEach((p) => (map[p.id] = { ...p, units: 0, revenue: 0 }));
    sales.forEach((s) => {
      const p = map[s.productId];
      if (!p) return;
      p.units += s.quantity;
      p.revenue += s.quantity * s.price;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, []);

  // ----------------------------
  // Associate Summary
  // ----------------------------
  const associateSummary = useMemo(() => {
    const map = {};
    associates.forEach((a) => (map[a.id] = { ...a, units: 0, revenue: 0 }));
    sales.forEach((s) => {
      const a = map[s.associateId];
      if (!a) return;
      a.units += s.quantity;
      a.revenue += s.quantity * s.price;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, []);

  // ----------------------------
  // Daily Sales by Associate
  // ----------------------------
  const dailySalesByAssociate = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      const date = new Date(s.date).toISOString().split("T")[0];
      if (!map[date]) map[date] = {};
      if (!map[date][s.associateId]) map[date][s.associateId] = 0;
      map[date][s.associateId] += s.price * s.quantity;
    });

    return Object.keys(map)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => ({
        date,
        ...associates.reduce(
          (acc, a) => ({ ...acc, [a.name]: map[date][a.id] || 0 }),
          {}
        ),
      }));
  }, []);

  // ----------------------------
  // Category Summary
  // ----------------------------
  const categorySummary = useMemo(() => {
    const map = {};
    products.forEach((p) => (map[p.category] = 0));
    sales.forEach((s) => {
      const prod = products.find((p) => p.id === s.productId);
      if (!prod) return;
      map[prod.category] += s.quantity * s.price;
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, []);

  const lowStock = products.filter((p) => p.stock <= 5);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="min-h-screen bg-[#0f0f10] text-gray-200 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Perfume Analytics Dashboard</h1>
            <p className="text-sm text-gray-400">Dashboard demo</p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign />} />
          <Card title="Units Sold" value={totalUnits} icon={<Box />} />
          <Card title="Top Associate" value={associateSummary[0]?.name} icon={<Users />} />
          <Card title="Avg Order Value" value={formatCurrency(avgOrderValue)} icon={<Trophy />} />
        </div>

        {/* Daily Sales Chart */}
        <section className="bg-gray-900 rounded-xl p-4 shadow-xl mb-6">
          <h2 className="font-semibold mb-3 text-white">Daily Sales by Associate</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesByAssociate}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                {associates.map((a, idx) => (
                  <Bar
                    key={a.id}
                    dataKey={a.name}
                    stackId="a"
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Product + Category Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <section className="lg:col-span-2 bg-gray-900 rounded-xl p-4 shadow-xl">
            <h3 className="font-medium mb-2 text-white">Top Products</h3>
            <div className="space-y-3">
              {productSummary.slice(0, 5).map((p) => (
                <div key={p.id} className="flex justify-between">
                  <div>
                    <div className="font-medium text-gray-100">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p.units} units • {formatCurrency(p.revenue)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{p.stock} left</div>
                </div>
              ))}
            </div>
          </section>

          <aside className="bg-gray-900 rounded-xl p-4 shadow-xl">
            <h3 className="font-medium mb-2 text-white">Sales by Category</h3>
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySummary} dataKey="value" nameKey="name" outerRadius={60} label>
                    {categorySummary.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="font-medium mb-2 text-white">Low Stock</h3>
                <ul className="space-y-2">
                  {lowStock.map((p) => (
                    <li key={p.id} className="flex justify-between text-sm">
                      <span>{p.name}</span>
                      <span className="text-red-500">{p.stock}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            </aside>
        </div>

        {/* Associate Leaderboard */}
        <section className="bg-gray-900 rounded-xl p-4 shadow-xl mb-6">
          <h2 className="font-semibold mb-3 text-white">Sales Associates</h2>
          <AssociateLeaderboard list={associateSummary} />
        </section>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// Cards
// -------------------------------------------------------------
function Card({ title, value, icon }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex gap-3 shadow-md">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-gray-300">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400">{title}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Leaderboard
// -------------------------------------------------------------
function AssociateLeaderboard({ list }) {
  const sortedList = [...list].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = Math.max(...sortedList.map((a) => a.revenue));

  return (
    <div className="space-y-2">
      {sortedList.map((a, idx) => (
        <div
          key={a.id}
          className="flex justify-between items-center p-2 rounded hover:bg-gray-800 transition-colors"
        >
          <div className="flex gap-3 items-center">
            <div className="text-gray-400 font-semibold w-5">{idx + 1}</div>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
              {a.name[0]}
            </div>
            <div>
              <div className="font-medium text-gray-100">{a.name}</div>
              <div className="text-xs text-gray-500">{a.region}</div>
            </div>
          </div>
          <div className="text-right w-32">
            <div className="text-sm font-semibold text-white">{formatCurrency(a.revenue)}</div>
            <div className="text-xs text-gray-500">{a.units} units</div>
            <div className="h-1 bg-gray-700 rounded mt-1">
              <div
                className="h-1 bg-indigo-500 rounded"
                style={{ width: `${(a.revenue / maxRevenue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
