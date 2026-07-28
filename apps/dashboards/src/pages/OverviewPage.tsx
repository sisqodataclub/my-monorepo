// src/pages/OverviewPage.tsx
import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { RefreshCw, Zap, Globe } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

import KPIGrid from '../components/overview/KPIGrid';
import DateFilterBar from '../components/overview/DateFilterBar';
import { FunnelChart } from '../components/overview/FunnelChart'; // <-- new import
import TrafficLineChart from '../components/TrafficLineChart';
import DeviceChart from '../components/DeviceChart';
import { type KPI } from '../components/KPICard';

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

  const getDateRange = () => {
    let start = new Date();
    let end = new Date();
    if (timePreset === 'Custom') {
      start = new Date(customStartDate);
      end = new Date(customEndDate);
    } else {
      const now = new Date();
      if (timePreset === '24h') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      else if (timePreset === '7D') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (timePreset === '30D') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      else if (timePreset === 'This Year') start = new Date(now.getFullYear(), 0, 1);
      end = now;
    }
    return { start, end };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { start, end } = getDateRange();
        const headers = { Authorization: `Bearer ${token}`, 'X-Tenant': 'DDEEP' };

        // 1. Umami KPIs + traffic + device + top pages
        const queryParams = new URLSearchParams({
          preset: timePreset,
          unit: granularity,
          compare: isComparing.toString(),
          compareType: compareType,
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
        });
        const umamiRes = await axios.get(`${API_BASE}/api/v1/dashboard/overview/?${queryParams}`, { headers });
        const umamiKpis = umamiRes.data.kpis || [];
        if (umamiRes.data.traffic_chart) setTrafficChartData(umamiRes.data.traffic_chart);
        if (umamiRes.data.device_chart) setDeviceChartData(umamiRes.data.device_chart);
        if (umamiRes.data.top_pages) setTopPages(umamiRes.data.top_pages);

        // 2. Booking status counts from analytics endpoint
        const statusParams = new URLSearchParams({
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        });
        const statusRes = await axios.get(`${API_BASE}/api/service-bookings/analytics/?${statusParams}`, { headers });
        const bookings = statusRes.data.results || [];

        const pendingCount = bookings.filter((b: any) => b.status === 'pending').length;
        const confirmedCount = bookings.filter((b: any) => b.status === 'confirmed').length;
        const cancelledCount = bookings.filter((b: any) => b.status === 'cancelled').length;

        // Extract Umami KPIs
        const pageViews = umamiKpis.find((k: any) => k.id === 'umami_1')?.value || 0;
        const uniqueVisitors = umamiKpis.find((k: any) => k.id === 'umami_2')?.value || 0;
        const bounceRate = umamiKpis.find((k: any) => k.id === 'umami_3')?.value || '0%';
        const avgSession = umamiKpis.find((k: any) => k.id === 'umami_4')?.value || '0s';

        // Build combined KPI list – all 7 metrics
        const combinedKpis: KPI[] = [
          { id: 'page_views', title: 'Page Views', value: pageViews, change: 0 },
          { id: 'unique_visitors', title: 'Unique Visitors', value: uniqueVisitors, change: 0 },
          { id: 'bounce_rate', title: 'Bounce Rate', value: bounceRate, change: 0 },
          { id: 'avg_session', title: 'Avg. Session', value: avgSession, change: 0 },
          { id: 'pending', title: 'Pending Bookings', value: pendingCount, change: 0 },
          { id: 'confirmed', title: 'Confirmed Bookings', value: confirmedCount, change: 0 },
          { id: 'cancelled', title: 'Cancelled Bookings', value: cancelledCount, change: 0 },
        ];

        setKpis(combinedKpis);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, timePreset, granularity, isComparing, compareType, customStartDate, customEndDate]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  // --- Dummy funnel data (not connected to backend yet) ---
  const funnelStages = [
    { label: 'IMPRESSIONS', volume: 100_000 },
    { label: 'TRAFFIC / CLICKS', volume: 5_000 },
    { label: 'LEADS', volume: 400 },
    { label: 'CONVERSIONS', volume: 80 },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-50 pt-6">
      <motion.div
        className="max-w-[90rem] mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Intelligence</h1>
              <div className="hidden sm:flex items-center bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping absolute" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full relative mr-1.5" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Unified analytics across Umami and bookings</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-md shadow-slate-900/10 transition-all duration-200 active:scale-95 group"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </motion.div>

        {/* Date Filter Bar */}
        <motion.div variants={itemVariants} className="mb-6">
          <DateFilterBar
            preset={timePreset}
            onPresetChange={setTimePreset}
            granularity={granularity}
            onGranularityChange={setGranularity}
            isComparing={isComparing}
            onCompareToggle={setIsComparing}
            compareType={compareType}
            onCompareTypeChange={setCompareType}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomDateChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
              setTimePreset('Custom');
            }}
          />
        </motion.div>

        {/* KPI Grid – now shows all 7 KPIs */}
        <motion.div variants={itemVariants}>
          <KPIGrid kpis={kpis} loading={loading} />
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
            onPresetChange={setTimePreset}
            onGranularityChange={setGranularity}
            onCompareToggle={setIsComparing}
            onCompareTypeChange={setCompareType}
            onCustomDateChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
              setTimePreset('Custom');
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
              <p className="text-sm text-slate-500">No page data available for the selected period.</p>
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

        {/* --- 🆕 Conversion Funnel (full‑width) --- */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="mr-2">📊</span> Conversion Funnel
              </h2>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Placeholder data
              </span>
            </div>
            <FunnelChart stages={funnelStages} />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
