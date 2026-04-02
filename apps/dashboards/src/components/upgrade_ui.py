import os

# Define the target directory
target_dir = os.path.expanduser("~/new_folder/my-monorepo/apps/dashboards/src/components")

# Ensure the directory exists
os.makedirs(target_dir, exist_ok=True)

components = {
    "KPICard.tsx": """import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KPI {
  id?: string;
  title: string;
  value: string | number;
  change: number;
  prefix?: string;
}

export default function KPICard({ kpi }: { kpi: KPI }) {
  const isPositive = kpi.change > 0;
  const isNegative = kpi.change < 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">{kpi.title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {kpi.prefix}{kpi.value}
        </p>
        <div className={`flex items-center text-sm font-medium px-2.5 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-700' : 
          isNegative ? 'bg-rose-50 text-rose-700' : 'bg-gray-50 text-gray-700'
        }`}>
          {isPositive && <ArrowUpRight className="w-4 h-4 mr-1" />}
          {isNegative && <ArrowDownRight className="w-4 h-4 mr-1" />}
          {!isPositive && !isNegative && <Minus className="w-4 h-4 mr-1" />}
          {Math.abs(kpi.change)}%
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 font-medium">vs. previous 30 days</p>
    </div>
  );
}
""",

    "RevenueChart.tsx": """import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueTrend } from '../mockData';

export default function RevenueChart() {
  return (
    <div className="w-full h-full min-h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `£${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#1f2937', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
""",

    "BookingFunnelChart.tsx": """import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FunnelStage } from '../mockData';

interface BookingFunnelChartProps {
  data: FunnelStage[];
}

export default function BookingFunnelChart({ data }: BookingFunnelChartProps) {
  // Brand colors mapping
  const colors = ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'];

  return (
    <div className="w-full h-full min-h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="stage" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
          />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[colors.length - 1 - index] || '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
""",

    "ServicePopularityChart.tsx": """import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { servicePopularity } from '../mockData';

export default function ServicePopularityChart() {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="w-full h-full min-h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={servicePopularity}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {servicePopularity.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
""",

    "CustomerRetentionChart.tsx": """import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { retentionData } from '../mockData';

export default function CustomerRetentionChart() {
  return (
    <div className="w-full h-full min-h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
          <Bar dataKey="new" stackId="a" fill="#60a5fa" name="New Customers" radius={[0, 0, 4, 4]} />
          <Bar dataKey="returning" stackId="a" fill="#3b82f6" name="Returning" />
          <Bar dataKey="churned" fill="#f43f5e" name="Churned" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
""",

    "RecentBookingsTable.tsx": """import type { Booking } from '../mockData';
import { recentBookings } from '../mockData';

export default function RecentBookingsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              {['ID', 'Customer', 'Service', 'Date', 'Amount', 'Status'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {recentBookings.map((booking: Booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">£{booking.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 
                    booking.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",

    "RecentMessagesTable.tsx": """import type { ContactMessage } from '../mockData';

interface RecentMessagesTableProps {
  messages: ContactMessage[];
}

export default function RecentMessagesTable({ messages }: RecentMessagesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              {['Contact', 'Message', 'Date', 'Status'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-500">{msg.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                  {msg.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    msg.status === 'new' ? 'bg-blue-50 text-blue-700' : 
                    msg.status === 'read' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {msg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""
}

# Write the files
for filename, content in components.items():
    filepath = os.path.join(target_dir, filename)
    with open(filepath, "w") as f:
        f.write(content.strip() + "\n")
    print(f"✅ Upgraded: {filename}")

print("\n🚀 All components have been refactored successfully!")
