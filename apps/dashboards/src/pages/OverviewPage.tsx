import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { RefreshCw, Download, Zap } from 'lucide-react';
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
  { id: '2', title: 'Totals Confirmed', value: '...', change: 0 },
  { id: '3', title: 'Page Views', value: '...', change: 0 },
  { id: '4', title: 'Unique Visitors', value: '...', change: 0 },
];

export default function OverviewPage() {
  const [kpis, setKpis] = useState<KPI[]>(MOCK_KPIS);
  const [trafficChartData, setTrafficChartData] = useState([]);
  const [deviceChartData, setDeviceChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [timePreset, setTimePreset] = useState('7D');
  const [granularity, setGranularity] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [isComparing, setIsComparing] = useState(false);
  const [compareType, setCompareType] = useState<'prev_period' | 'prev_year'>('prev_period');

  const defaultStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = new Date().toISOString().split('T')[0];
  const [customStartDate, setCustomStartDate] = useState(defaultStart);
  const [customEndDate, setCustomEndDate] = useState(defaultEnd);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

        const queryParams = new URLSearchParams({
          chart_ids: '1,2', // <-- Tell Django to fetch both Chart 1 and Chart 2
          preset: timePreset,
          unit: granularity,
          compare: isComparing.toString(),
          compareType: compareType,
          startDate: customStartDate,
          endDate: customEndDate
        });

        const response = await axios.get(`${API_BASE}/api/v1/dashboard/overview/?${queryParams}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 1. Extract the new backend dictionaries
        const supersetCharts = response.data.superset_charts || {};
        const umamiKpis = response.data.kpis || []; // Contains the 2 Umami KPIs

        // 2. Safely extract Chart 1 (Total Bookings)
        const chart1Data = supersetCharts['1'];
        const totalBookings = chart1Data && chart1Data.length > 0 ? chart1Data[0].count : 'N/A';

        // 3. Safely extract Chart 2 (Totals Confirmed)
        const chart2Data = supersetCharts['2'];
        const totalsConfirmed = chart2Data && chart2Data.length > 0 ? chart2Data[0].count : 'N/A';

        // 4. Build the final KPI array
        setKpis([
          { id: '1', title: 'Total Bookings', value: totalBookings, change: 0, prefix: '' },
          { id: '2', title: 'Totals Confirmed', value: totalsConfirmed, change: 0, prefix: '' },
          umamiKpis[0] || MOCK_KPIS[2], // Fallback to mock if Umami fails
          umamiKpis[1] || MOCK_KPIS[3]
        ]);

        if (response.data.traffic_chart) setTrafficChartData(response.data.traffic_chart);
        if (response.data.device_chart) setDeviceChartData(response.data.device_chart);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken, timePreset, granularity, isComparing, compareType, customStartDate, customEndDate]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-50 pt-6">
      <motion.div
        className="max-w-[90rem] mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Intelligence</h1>
              <div className="hidden sm:flex items-center bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full relative mr-1.5"></div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Unified analytics across Superset and Umami</p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all duration-200 group">
              <Download className="w-4 h-4 mr-2 text-slate-400 group-hover:text-slate-600 transition-colors" />
              Export Report
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-md shadow-slate-900/10 transition-all duration-200 active:scale-95 group"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Sync
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => <div key={i} className="h-36 bg-white/60 animate-pulse rounded-2xl border border-slate-200/60" />)
          ) : (
            kpis.map((kpi, idx) => <KPICard key={kpi.id} kpi={kpi} index={idx} />)
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <TrafficLineChart
            data={trafficChartData}
            activePreset={timePreset}
            activeGranularity={granularity}
            isComparing={isComparing}
            compareType={compareType}
            customStartDate={customStartDate}
            customEndDate={customEndDate}

            onPresetChange={(preset) => {
              setTimePreset(preset);

              let newDays = 7;
              if (preset === '24h') newDays = 1;
              else if (preset === '30D') newDays = 30;
              else if (preset === 'This Year') newDays = 365;
              else if (preset === 'Custom') newDays = (new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 3600 * 24);

              if (preset === '24h') {
                setGranularity('hour');
              } else if (preset === 'This Year' && granularity === 'hour') {
                setGranularity('month');
              } else if (granularity === 'hour' && newDays > 2) {
                setGranularity('day');
              } else if (granularity === 'week' && newDays <= 14) {
                setGranularity('day');
              } else if (granularity === 'month' && newDays < 30) {
                setGranularity('day');
              }
            }}

            onGranularityChange={setGranularity}
            onCompareToggle={setIsComparing}
            onCompareTypeChange={setCompareType}

            onCustomDateChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);

              const newDays = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24);
              if (granularity === 'hour' && newDays > 2) setGranularity('day');
              if (granularity === 'week' && newDays <= 14) setGranularity('day');
              if (granularity === 'month' && newDays < 30) setGranularity('day');
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" /> Revenue Trends
            </h2>
            <RevenueChart />
          </div>
          <div className="lg:col-span-1">
            <DeviceChart data={deviceChartData} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Booking Funnel</h2>
            <BookingFunnelChart data={funnelData} />
          </div>
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Customer Retention</h2>
            <CustomerRetentionChart />
          </div>
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Service Popularity</h2>
            <ServicePopularityChart />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentBookingsTable />
          <RecentMessagesTable messages={contactMessages} />
        </motion.div>
      </motion.div>
    </div>
  );
}
