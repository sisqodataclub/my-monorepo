import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Truck, Users, PoundSterling, Trophy } from "lucide-react";

const COLORS = ["#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];

// -------------------------------------------------------------
// Fake Data
// -------------------------------------------------------------
const drivers = [
  { id: 1, name: "James", area: "London" },
  { id: 2, name: "Daniel", area: "Manchester" },
  { id: 3, name: "Kwame", area: "Birmingham" },
  { id: 4, name: "Oliver", area: "Leeds" },
];

const jobs = [
  { id: 1, service: "House Move", price: 180 },
  { id: 2, service: "Office Move", price: 320 },
  { id: 3, service: "Single Item", price: 75 },
  { id: 4, service: "Student Move", price: 120 },
];

const bookings = [
  { id: 101, date: "2025-11-03T09:30:00", jobId: 1, driverId: 1, hours: 3 },
  { id: 102, date: "2025-11-03T14:15:00", jobId: 3, driverId: 2, hours: 1 },
  { id: 103, date: "2025-11-04T11:00:00", jobId: 2, driverId: 3, hours: 4 },
  { id: 104, date: "2025-11-05T10:45:00", jobId: 4, driverId: 1, hours: 2 },
  { id: 105, date: "2025-11-06T13:30:00", jobId: 1, driverId: 4, hours: 3 },
  { id: 106, date: "2025-11-07T15:10:00", jobId: 3, driverId: 2, hours: 1 },
  { id: 107, date: "2025-11-08T09:00:00", jobId: 2, driverId: 3, hours: 5 },
];

// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------
export default function ManVanAnalyticsDashboard() {
  const [range, setRange] = useState("7d");

  // ----------------------------
  // Revenue Stats
  // ----------------------------
  const totalRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => {
      const job = jobs.find((j) => j.id === b.jobId);
      return sum + (job?.price || 0);
    }, 0);
  }, []);

  const totalJobs = bookings.length;
  const avgJobValue = totalRevenue / totalJobs || 0;

  // ----------------------------
  // Driver Summary
  // ----------------------------
  const driverSummary = useMemo(() => {
    const map = {};
    drivers.forEach((d) => (map[d.id] = { ...d, revenue: 0, jobs: 0 }));

    bookings.forEach((b) => {
      const job = jobs.find((j) => j.id === b.jobId);
      const driver = map[b.driverId];
      if (!job || !driver) return;
      driver.revenue += job.price;
      driver.jobs += 1;
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, []);

  // ----------------------------
  // Revenue by Day of Week
  // ----------------------------
  const dailyRevenue = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = {};

    days.forEach((d) => (map[d] = 0));

    bookings.forEach((b) => {
      const job = jobs.find((j) => j.id === b.jobId);
      const day = days[new Date(b.date).getDay()];
      map[day] += job?.price || 0;
    });

    return days.map((d) => ({ day: d, revenue: map[d] }));
  }, []);

  // ----------------------------
  // Service Breakdown
  // ----------------------------
  const serviceSummary = useMemo(() => {
    const map = {};
    jobs.forEach((j) => (map[j.service] = 0));

    bookings.forEach((b) => {
      const job = jobs.find((j) => j.id === b.jobId);
      if (!job) return;
      map[job.service] += job.price;
    });

    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, []);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="min-h-screen bg-[#0f0f10] text-gray-200 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Man & Van Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-400">Client demo overview</p>
          </div>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<PoundSterling />} />
          <StatCard title="Jobs Completed" value={totalJobs} icon={<Truck />} />
          <StatCard title="Top Driver" value={driverSummary[0]?.name} icon={<Users />} />
          <StatCard title="Avg Job Value" value={formatCurrency(avgJobValue)} icon={<Trophy />} />
        </div>

        {/* Daily Revenue */}
        <section className="bg-gray-900 rounded-xl p-4 shadow-xl mb-6">
          <h2 className="font-semibold mb-3 text-white">Revenue by Day</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Services + Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-gray-900 rounded-xl p-4 shadow-xl">
            <h3 className="font-medium mb-3 text-white">Driver Leaderboard</h3>
            <DriverLeaderboard list={driverSummary} />
          </section>

          <aside className="bg-gray-900 rounded-xl p-4 shadow-xl">
            <h3 className="font-medium mb-3 text-white">Revenue by Service</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceSummary} dataKey="value" nameKey="name" outerRadius={70} label>
                    {serviceSummary.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </aside>
        </div>

      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// Components
// -------------------------------------------------------------
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex gap-3 shadow-md">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400">{title}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

function DriverLeaderboard({ list }) {
  const max = Math.max(...list.map((d) => d.revenue));

  return (
    <div className="space-y-2">
      {list.map((d, i) => (
        <div key={d.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-800">
          <div className="flex gap-3 items-center">
            <span className="text-gray-400 w-5">{i + 1}</span>
            <div>
              <div className="font-medium text-white">{d.name}</div>
              <div className="text-xs text-gray-500">{d.area}</div>
            </div>
          </div>
          <div className="w-32">
            <div className="text-sm text-white">{formatCurrency(d.revenue)}</div>
            <div className="h-1 bg-gray-700 rounded mt-1">
              <div
                className="h-1 bg-indigo-500 rounded"
                style={{ width: `${(d.revenue / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
