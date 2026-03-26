import React from 'react';

export interface KPI {
  id?: string;
  title: string;
  revenue: string;
  bookings: number;
}

interface KPICardProps {
  kpi: KPI;
}

export default function KPICard({ kpi }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">
          {kpi.title}
        </h3>
        <div className="w-8 h-8 rounded-full bg-[#915EFF]/10 flex items-center justify-center">
          <span className="text-[#915EFF] text-sm">📅</span>
        </div>
      </div>

      {/* Main Metric: Revenue */}
      <div className="space-y-1">
        <p className="text-sm text-gray-400 font-medium">Revenue</p>
        <p className="text-3xl font-black text-gray-800 tracking-tight">
          {kpi.revenue}
        </p>
      </div>

      {/* Secondary Metric: Bookings */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">Total Bookings</span>
        <span className="text-sm font-bold text-[#00C6FF] bg-[#00C6FF]/10 px-3 py-1 rounded-full">
          {kpi.bookings} {kpi.bookings === 1 ? 'job' : 'jobs'}
        </span>
      </div>
    </div>
  );
}
