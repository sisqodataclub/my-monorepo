import React, { useEffect, useState } from 'react';
import KPICard, { KPI } from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import BookingFunnelChart from '../components/BookingFunnelChart';
import ServicePopularityChart from '../components/ServicePopularityChart';
import CustomerRetentionChart from '../components/CustomerRetentionChart';

// Adjust this import path to point to your actual axios/api instance
import api from '../../../forms/frontend/src/api'; 

export default function OverviewPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live data directly from Django when the page loads
    api.get('/api/kpis/')
      .then((res) => setKpis(res.data))
      .catch((err) => {
        console.error('Failed to fetch KPIs:', err);
        setError('Failed to load metrics');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Business Overview</h1>
      
      {/* Live KPI Cards Grid with Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl shadow-md"></div>
          ))}
        </div>
      ) : error ? (
        <div className="mb-8 p-4 bg-red-50 text-red-500 rounded-lg border border-red-100">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id || kpi.title} kpi={kpi} />
          ))}
        </div>
      )}
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <RevenueChart />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Booking Funnel</h2>
          <BookingFunnelChart data={[]} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Service Popularity</h2>
          <ServicePopularityChart />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Customer Retention</h2>
          <CustomerRetentionChart />
        </div>
      </div>
    </div>
  );
}
