import KPICard from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import BookingFunnelChart from '../components/BookingFunnelChart';
import ServicePopularityChart from '../components/ServicePopularityChart';
import CustomerRetentionChart from '../components/CustomerRetentionChart';
import { kpiData } from '../mockData';

export default function OverviewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Business Overview</h1>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>
      
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
