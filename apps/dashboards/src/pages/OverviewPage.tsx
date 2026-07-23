import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { RefreshCw, Zap, Globe } from 'lucide-react';   // ✅ removed unused imports
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// Components
import KPICard, { type KPI } from '../components/KPICard';
import TrafficLineChart from '../components/TrafficLineChart';
import DeviceChart from '../components/DeviceChart';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

export default function OverviewPage() {
  const { getToken } = useAuth();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [trafficChartData, setTrafficChartData] = useState([]);
  const [deviceChartData, setDeviceChartData] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time controls
  const [timePreset, setTimePreset] = useState('7D');
  const [granularity, setGranularity] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [isComparing, setIsComparing] = useState(false);
  const [compareType, setCompareType] = useState<'prev_period' | 'prev_year'>('prev_period');

  const defaultStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = new Date().toISOString().split('T')[0];
  const [customStartDate, setCustomStartDate] = useState(defaultStart);
  const [customEndDate, setCustomEndDate] = useState(defaultEnd);

  useEffect(() => {
    const fetchUmamiData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const queryParams = new URLSearchParams({
          preset: timePreset,
          unit: granularity,
          compare: isComparing.toString(),
          compareType: compareType,
          startDate: customStartDate,
          endDate: customEndDate,
        });

        const response = await axios.get(`${API_BASE}/api/v1/dashboard/overview/?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Umami KPIs
        const umamiKpis = response.data.kpis || [];
        setKpis(umamiKpis);

        if (response.data.traffic_chart) setTrafficChartData(response.data.traffic_chart);
        if (response.data.device_chart) setDeviceChartData(response.data.device_chart);
        if (response.data.top_pages) setTopPages(response.data.top_pages);

      } catch (error) {
        console.error('Failed to fetch Umami data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUmamiData();
  }, [getToken, timePreset, granularity, isComparing, compareType, customStartDate, customEndDate]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-50 pt-6">
      <motion.div
        className="max-w-[90rem] mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Website Analytics</h1>
              <div className="hidden sm:flex items-center bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping absolute" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full relative mr-1.5" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Live (Umami)</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Real‑time visitor behaviour and engagement metrics</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-md shadow-slate-900/10 transition-all duration-200 active:scale-95 group"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => <div key={i} className="h-36 bg-white/60 animate-pulse rounded-2xl border border-slate-200/60" />)
          ) : kpis.length === 0 ? (
            <div className="col-span-4 text-center text-slate-500 py-8">No Umami data available.</div>
          ) : (
            kpis.map((kpi, idx) => <KPICard key={kpi.id} kpi={kpi} index={idx} />)
          )}
        </motion.div>

        {/* Traffic Line Chart */}
        <motion.div variants={itemVariants} className="mb-8">
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
              else if (preset === 'Custom') {
                newDays = (new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 3600 * 24);
              }
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

        {/* Device Breakdown + Top Pages */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" /> Device Breakdown
            </h2>
            <DeviceChart data={deviceChartData} />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" /> Top Pages
            </h2>
            {topPages.length === 0 ? (
              <p className="text-sm text-slate-500">No page data available.</p>
            ) : (
              <div className="space-y-2">
                {topPages.slice(0, 5).map((page: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-700 truncate max-w-[70%]">{page.url}</span>
                    <span className="text-sm font-semibold text-slate-900">{page.visits}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
