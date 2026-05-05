import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Calendar, RefreshCw, Download } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// Components
import KPICard, { type KPI } from '../components/KPICard';
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
  { id: '2', title: 'Total Revenue', value: '24,500', change: 12.5, prefix: '£' }, // We will keep this as mock for now
  { id: '3', title: 'New Inquiries', value: '38', change: -2.4 },
  { id: '4', title: 'Conversion Rate', value: '64.2', change: 0, prefix: '%' },
];

export default function OverviewPage() {
  const [kpis, setKpis] = useState<KPI[]>(MOCK_KPIS);
  const [loading, setLoading] = useState(true);

  // 🔐 Pull the getToken function from Clerk
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Ask Clerk for the secure JWT for this specific user
        const token = await getToken();

        // 2. Fetch data from your Django Proxy View
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';
        const response = await axios.get(`${API_BASE}/api/v1/dashboard/overview/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 3. Extract the live KPIs returned by Django (Superset + Umami)
        const fetchedKpis = response.data.kpis;

        // 4. Merge the live data with the Revenue mock so we have exactly 4 cards
        if (fetchedKpis && fetchedKpis.length >= 3) {
          setKpis([
            fetchedKpis[0], // Total Bookings (from Superset)
            MOCK_KPIS[1],   // Total Revenue (Mocked until you add Stripe)
            fetchedKpis[1], // Page Views (from Umami)
            fetchedKpis[2]  // Unique Visitors (from Umami)
          ]);
        } else {
          // Fallback if backend returns an unexpected array size
          setKpis(fetchedKpis); 
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to the mock data if the API fails so the UI doesn't break
        setKpis([
          { id: '1', title: 'Total Bookings', value: 'Error', change: 0 },
          MOCK_KPIS[1], 
          { id: 'umami_err1', title: 'Page Views', value: 'Error', change: 0 },
          { id: 'umami_err2', title: 'Visitors', value: 'Error', change: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  // Framer Motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Page Header & Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here is your live business data.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Last 30 Days
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2 text-gray-400" />
            Export
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* 2. KPI Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-white animate-pulse rounded-xl border border-gray-100 shadow-sm"></div>
          ))
        ) : (
          kpis.map((kpi, index) => (
            <KPICard key={kpi.id} kpi={kpi} index={index} />
          ))
        )}
      </motion.div>

      {/* 3. Top Charts Row (Revenue & Funnel) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">Revenue Analytics</h2>
          </div>
          <RevenueChart />
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">Booking Funnel</h2>
          </div>
          <BookingFunnelChart data={funnelData} />
        </div>
      </motion.div>

      {/* 4. Bottom Charts Row (Retention & Popularity) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">Customer Retention</h2>
          </div>
          <CustomerRetentionChart />
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">Service Popularity</h2>
          </div>
          <ServicePopularityChart />
        </div>
      </motion.div>

      {/* 5. Data Tables Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentBookingsTable />
        <RecentMessagesTable messages={contactMessages} />
      </motion.div>

    </motion.div>
  );
}
