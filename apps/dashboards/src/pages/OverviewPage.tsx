import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// Components
import KPICard, { type KPI } from '../components/KPICard';
import TrafficLineChart from '../components/TrafficLineChart';
import DeviceChart from '../components/DeviceChart';
import RevenueChart from '../components/RevenueChart';
import BookingFunnelChart from '../components/BookingFunnelChart';
import ServicePopularityChart from '../components/ServicePopularityChart';
import CustomerRetentionChart from '../components/CustomerRetentionChart';
import RecentBookingsTable from '../components/RecentBookingsTable';
import RecentMessagesTable from '../components/RecentMessagesTable';

// Data
import { funnelData, contactMessages } from '../mockData';

const MOCK_KPIS: KPI[] = [
  { id: '1', title: 'Total Bookings', value: '...', change: 0 },
  { id: '2', title: 'Total Revenue', value: '24,500', change: 12.5, prefix: '£' },
  { id: '3', title: 'New Inquiries', value: '38', change: -2.4 },
  { id: '4', title: 'Conversion Rate', value: '64.2', change: 0, prefix: '%' },
];

export default function OverviewPage() {
  // --- Dashboard Data State ---
  const [kpis, setKpis] = useState<KPI[]>(MOCK_KPIS);
  const [trafficChartData, setTrafficChartData] = useState([]);
  const [deviceChartData, setDeviceChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Global Filter State ---
  const [timePreset, setTimePreset] = useState('7D');
  const [granularity, setGranularity] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [isComparing, setIsComparing] = useState(false);
  const [compareType, setCompareType] = useState<'prev_period' | 'prev_year'>('prev_period');

  const { getToken } = useAuth();

  // --- Main Data Fetcher ---
  // Watches all filter states. When one changes, Django is queried for new data.
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';
        
        // Construct the query string with all active filters
        const queryParams = new URLSearchParams({
          preset: timePreset,
          unit: granularity,
          compare: isComparing.toString(),
          compareType: compareType
        });

        const response = await axios.get(`${API_BASE}/api/v1/dashboard/overview/?${queryParams}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 1. Update KPIs
        if (response.data.kpis) {
          const fetchedKpis = response.data.kpis;
          setKpis([
            fetchedKpis[0], // Total Bookings (Superset)
            MOCK_KPIS[1],   // Revenue (Mock)
            fetchedKpis[1], // Page Views (Umami)
            fetchedKpis[2]  // Visitors (Umami)
          ]);
        }

        // 2. Update Charts
        if (response.data.traffic_chart) setTrafficChartData(response.data.traffic_chart);
        if (response.data.device_chart) setDeviceChartData(response.data.device_chart);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken, timePreset, granularity, isComparing, compareType]);

  // --- Framer Motion Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-sm text-gray-500">Live analytics across Superset and Umami.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl border border-gray-200" />)
        ) : (
          kpis.map((kpi, idx) => <KPICard key={kpi.id} kpi={kpi} index={idx} />)
        )}
      </motion.div>

      {/* Primary Analytics: Line Chart */}
      <motion.div variants={itemVariants}>
        <TrafficLineChart 
          data={trafficChartData}
          activePreset={timePreset}
          activeGranularity={granularity}
          isComparing={isComparing}
          compareType={compareType}
          onPresetChange={(preset) => {
            setTimePreset(preset);
            // Smart Fallbacks
            if (preset === '24h') {
              setGranularity('hour');
            } else if ((preset === '7D' || preset === '30D') && granularity === 'month') {
              setGranularity('day');
            } else if (preset === 'This Year' && (granularity === 'hour')) {
              setGranularity('month');
            }
          }}
          onGranularityChange={setGranularity}
          onCompareToggle={setIsComparing}
          onCompareTypeChange={setCompareType}
        />
      </motion.div>

      {/* Secondary Charts: Revenue & Devices */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">Revenue Trends</h2>
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <DeviceChart data={deviceChartData} />
        </div>
      </motion.div>

      {/* Tertiary Row: Funnel & Retention */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">Booking Funnel</h2>
          <BookingFunnelChart data={funnelData} />
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">Customer Retention</h2>
          <CustomerRetentionChart />
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">Service Popularity</h2>
          <ServicePopularityChart />
        </div>
      </motion.div>

      {/* Data Tables */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentBookingsTable />
        <RecentMessagesTable messages={contactMessages} />
      </motion.div>
    </motion.div>
  );
}
