import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CalendarDays, AlertCircle, FileText, Search, Star, Flag, CreditCard, X,
  Plus, Edit, ChevronUp, ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';
const TENANT = 'DDEEP'; // fixed tenant for this dashboard

// --- Type definitions ---
interface AnalyticsBooking {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  service_name: string;
  provider_name: string | null;
  start_time: string;
  end_time: string;
  payment_status: 'unpaid' | 'paid_cash' | 'paid_card' | 'paid_bank';
  payment_date: string | null;
  payment_reference: string;
  status: string;
  completed_at: string | null;
  has_complaint: boolean;
  complaint_notes: string;
  complaint_resolved: boolean;
  complaint_resolved_at: string | null;
  rating: number | null;
  feedback_text: string;
  review_request_sent: boolean;
  review_requested_at: string | null;
  reschedule_history: any[];
  rescheduled_count: number;
  discount_applied: string;
  tax_applied: string;
  total_price: string;
  cancellation_reason: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  actual_duration_minutes: number | null;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

interface CleaningBooking {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  total: string;
  status: string;
  created_at: string;
  property_details: any;
  selected_datetime: any;
}

interface Service {
  id: number;
  name: string;
  price: string;
}

interface ServiceProvider {
  id: number;
  user_email: string;
  service_name: string;
}

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------
export default function BookingsPage() {
  const { getToken } = useAuth();

  // --- State for Analytics (ServiceBookings) ---
  const [analyticsData, setAnalyticsData] = useState<AnalyticsBooking[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analyticsSearch, setAnalyticsSearch] = useState('');
  const [analyticsFilters, setAnalyticsFilters] = useState({
    payment_status: '',
    job_status: '',
    has_complaint: '',
    rating: '',
  });

  // --- State for CleaningBookings (Pending Promotions) ---
  const [cleaningBookings, setCleaningBookings] = useState<CleaningBooking[]>([]);
  const [cleaningLoading, setCleaningLoading] = useState(true);
  const [cleaningError, setCleaningError] = useState<string | null>(null);
  const [showPendingPromotions, setShowPendingPromotions] = useState(true);

  // --- Promotion modal state ---
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedCleaningId, setSelectedCleaningId] = useState<number | null>(null);
  const [promoteServiceId, setPromoteServiceId] = useState('');
  const [promoteProviderId, setPromoteProviderId] = useState('');
  const [promoting, setPromoting] = useState(false);

  // --- Edit modal state ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<AnalyticsBooking | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    payment_status: '',
    rating: '',
    complaint_notes: '',
    internal_notes: '',
    completed_at: '',
  });
  const [updating, setUpdating] = useState(false);

  // --- Services and Providers for dropdowns ---
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // --- Superset data (existing) ---
  const [supersetData, setSupersetData] = useState<any[]>([]);
  const [supersetLoading, setSupersetLoading] = useState(true);
  const [supersetError, setSupersetError] = useState<string | null>(null);
  const [supersetSearch, setSupersetSearch] = useState('');

  // ---- Helper to build headers with tenant ----
  const getHeaders = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      'X-Tenant': TENANT,
    };
  };

  // ---- Fetch all data ----
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      fetchAnalytics(),
      fetchCleaningBookings(),
      fetchSuperset(),
      fetchServicesAndProviders(),
    ]);
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const headers = await getHeaders();
      const params = new URLSearchParams();
      if (analyticsSearch) params.append('search', analyticsSearch);
      if (analyticsFilters.payment_status) params.append('payment_status', analyticsFilters.payment_status);
      if (analyticsFilters.job_status) params.append('status', analyticsFilters.job_status);
      if (analyticsFilters.has_complaint) params.append('has_complaint', analyticsFilters.has_complaint === 'true' ? 'true' : 'false');
      if (analyticsFilters.rating) params.append('rating', analyticsFilters.rating);

      const response = await axios.get(
        `${API_BASE}/api/service-bookings/analytics/?${params.toString()}`,
        { headers }
      );
      setAnalyticsData(response.data.results || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setAnalyticsError('Failed to load booking analytics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchCleaningBookings = async () => {
    setCleaningLoading(true);
    try {
      const headers = await getHeaders();
      const response = await axios.get(
        `${API_BASE}/api/cleaning-bookings/unpromoted/`,
        { headers }
      );
      setCleaningBookings(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching cleaning bookings:', err);
      setCleaningError('Failed to load pending bookings.');
    } finally {
      setCleaningLoading(false);
    }
  };

  const fetchSuperset = async () => {
    setSupersetLoading(true);
    try {
      const headers = await getHeaders();
      const queryParams = new URLSearchParams({ chart_ids: '3' });
      const response = await axios.get(
        `${API_BASE}/api/v1/dashboard/overview/?${queryParams}`,
        { headers }
      );
      const chartData = response.data.superset_charts?.['3'];
      setSupersetData(Array.isArray(chartData) ? chartData : []);
    } catch (err) {
      console.error('Error fetching Superset data:', err);
      setSupersetError('Failed to load Superset records.');
    } finally {
      setSupersetLoading(false);
    }
  };

  // ---- Fetch services (required) and providers (optional) ----
  const fetchServicesAndProviders = async () => {
    setServicesError(null);
    try {
      const headers = await getHeaders();

      // 1. Fetch services – required
      let servicesData: Service[] = [];
      try {
        const servicesRes = await axios.get(`${API_BASE}/api/payments/services/`, { headers });
        servicesData = Array.isArray(servicesRes.data) ? servicesRes.data : [];
      } catch (err: any) {
        console.error('Failed to fetch services:', err);
        setServicesError(err.message || 'Could not load services');
      }

      // 2. Fetch providers – optional, ignore failures
      let providersData: ServiceProvider[] = [];
      try {
        const providersRes = await axios.get(`${API_BASE}/api/service-providers/`, { headers });
        providersData = providersRes.data.results || providersRes.data || [];
      } catch (err) {
        console.warn('Could not fetch providers (optional):', err);
        // Providers are optional, so we just log and continue
      }

      setServices(servicesData);
      setProviders(providersData);
    } catch (err: any) {
      console.error('Unexpected error in fetchServicesAndProviders:', err);
      setServicesError('Unexpected error loading services');
    }
  };

  // --- Promotion handler ---
  const handlePromote = async () => {
    if (!selectedCleaningId || !promoteServiceId) return;
    setPromoting(true);
    try {
      const headers = await getHeaders();
      const payload: any = { service_id: parseInt(promoteServiceId) };
      if (promoteProviderId) payload.provider_id = parseInt(promoteProviderId);

      await axios.post(
        `${API_BASE}/api/cleaning-bookings/${selectedCleaningId}/promote/`,
        payload,
        { headers }
      );
      setShowPromoteModal(false);
      setSelectedCleaningId(null);
      setPromoteServiceId('');
      setPromoteProviderId('');
      await loadAllData();
      alert('✅ Promoted successfully!');
    } catch (err: any) {
      console.error('Promotion failed:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to promote. Please try again.';
      alert(`❌ ${errorMsg}`);
    } finally {
      setPromoting(false);
    }
  };

  // --- Edit handler ---
  const openEditModal = (booking: AnalyticsBooking) => {
    setEditingBooking(booking);
    setEditForm({
      status: booking.status || '',
      payment_status: booking.payment_status || '',
      rating: booking.rating ? String(booking.rating) : '',
      complaint_notes: booking.complaint_notes || '',
      internal_notes: booking.internal_notes || '',
      completed_at: booking.completed_at || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;
    setUpdating(true);
    try {
      const headers = await getHeaders();
      const payload: any = {};
      if (editForm.status) payload.status = editForm.status;
      if (editForm.payment_status) payload.payment_status = editForm.payment_status;
      if (editForm.rating) payload.rating = parseInt(editForm.rating);
      if (editForm.complaint_notes !== undefined) payload.complaint_notes = editForm.complaint_notes;
      if (editForm.internal_notes !== undefined) payload.internal_notes = editForm.internal_notes;
      if (editForm.completed_at) payload.completed_at = editForm.completed_at;

      await axios.patch(
        `${API_BASE}/api/service-bookings/${editingBooking.id}/`,
        payload,
        { headers }
      );
      setShowEditModal(false);
      await fetchAnalytics();
      alert('Booking updated!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update booking.');
    } finally {
      setUpdating(false);
    }
  };

  // --- Render helpers (unchanged) ---
  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-slate-400">-</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
        ))}
      </div>
    );
  };

  const renderStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      unpaid: { color: 'bg-amber-50 text-amber-700 border-amber-200/50', label: 'Unpaid' },
      paid_cash: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50', label: 'Cash' },
      paid_card: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50', label: 'Card' },
      paid_bank: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50', label: 'Bank' },
      quote: { color: 'bg-blue-50 text-blue-700 border-blue-200/50', label: 'Quote' },
      booked: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50', label: 'Booked' },
      in_progress: { color: 'bg-purple-50 text-purple-700 border-purple-200/50', label: 'In Progress' },
      completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50', label: 'Completed' },
      cancelled: { color: 'bg-rose-50 text-rose-700 border-rose-200/50', label: 'Cancelled' },
    };
    const info = map[status] || { color: 'bg-slate-100 text-slate-700', label: status };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${info.color}`}>
        {info.label}
      </span>
    );
  };

  const renderSupersetCell = (key: string, value: any) => {
    if (value === null || value === undefined) return <span className="text-slate-400">-</span>;
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('status') || lowerKey.includes('state')) {
      const s = String(value).toLowerCase();
      let color = 'bg-slate-100 text-slate-700';
      if (['paid', 'confirmed', 'completed', 'active', 'success'].some(w => s.includes(w))) color = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      else if (['pending', 'requested', 'processing'].some(w => s.includes(w))) color = 'bg-amber-50 text-amber-700 border-amber-200/50';
      else if (['failed', 'cancelled', 'refunded'].some(w => s.includes(w))) color = 'bg-rose-50 text-rose-700 border-rose-200/50';
      return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${color}`}>{value}</span>;
    }
    if (lowerKey.includes('date') || lowerKey.includes('time') || lowerKey.includes('created') || lowerKey.includes('updated')) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return (
          <div className="flex items-center text-slate-600">
            <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" />
            {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        );
      }
    }
    if (lowerKey.includes('price') || lowerKey.includes('total') || lowerKey.includes('amount')) {
      const num = Number(value);
      if (!isNaN(num)) return <span className="font-semibold text-slate-900">${num.toFixed(2)}</span>;
    }
    return <span className="text-slate-600 font-medium">{String(value)}</span>;
  };

  const clearAnalyticsFilters = () => {
    setAnalyticsFilters({ payment_status: '', job_status: '', has_complaint: '', rating: '' });
    setAnalyticsSearch('');
  };

  // --- Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  const supersetHeaders = supersetData.length > 0 ? Object.keys(supersetData[0]) : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-50 pt-6">
      <motion.div
        className="max-w-[90rem] mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ============================================================ */}
        {/* SECTION 0: PENDING PROMOTIONS (CleaningBookings) */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants} className="mb-12">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer select-none"
            onClick={() => setShowPendingPromotions(!showPendingPromotions)}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Pending Promotions</h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {cleaningBookings.length} booking(s)
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              {showPendingPromotions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showPendingPromotions && (
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
              {cleaningLoading ? (
                <div className="p-6 animate-pulse">Loading pending bookings...</div>
              ) : cleaningError ? (
                <div className="p-6 text-rose-600">{cleaningError}</div>
              ) : cleaningBookings.length === 0 ? (
                <div className="p-6 text-slate-500 text-center">No pending bookings to promote.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Customer</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Total</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Created</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cleaningBookings.map((cb) => (
                        <tr key={cb.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{cb.customer_name}</div>
                            <div className="text-sm text-slate-500">{cb.customer_email}</div>
                            {cb.phone && <div className="text-sm text-slate-400">{cb.phone}</div>}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">£{parseFloat(cb.total).toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(cb.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedCleaningId(cb.id);
                                setShowPromoteModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                            >
                              <Plus className="w-4 h-4" /> Promote
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ============================================================ */}
        {/* SECTION 1: BOOKING ANALYTICS (ServiceBookings) */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Booking Analytics</h2>
              <p className="text-sm text-slate-500">
                {analyticsLoading ? 'Loading...' : `${analyticsData.length} bookings found`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={analyticsSearch}
                  onChange={(e) => setAnalyticsSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full min-w-[160px] placeholder:text-slate-400"
                />
              </div>
              <select
                value={analyticsFilters.payment_status}
                onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, payment_status: e.target.value }))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All Payments</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid_cash">Cash</option>
                <option value="paid_card">Card</option>
                <option value="paid_bank">Bank</option>
              </select>
              <select
                value={analyticsFilters.job_status}
                onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, job_status: e.target.value }))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="quote">Quote</option>
                <option value="booked">Booked</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={analyticsFilters.has_complaint}
                onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, has_complaint: e.target.value }))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Complaint? All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <select
                value={analyticsFilters.rating}
                onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, rating: e.target.value }))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
              {(analyticsSearch || analyticsFilters.payment_status || analyticsFilters.job_status || analyticsFilters.has_complaint || analyticsFilters.rating) && (
                <button onClick={clearAnalyticsFilters} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Clear filters">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            {analyticsLoading ? (
              <div className="p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 mb-6 last:mb-0 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            ) : analyticsError ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-rose-50 p-4 rounded-full mb-4"><AlertCircle className="w-8 h-8 text-rose-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load analytics</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">{analyticsError}</p>
              </div>
            ) : analyticsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4"><FileText className="w-8 h-8 text-slate-400" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings found</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Service</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Date/Time</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Payment</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Rating</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Complaint</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Total</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analyticsData.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{booking.customer_name}</div>
                          <div className="text-xs text-slate-500">{booking.customer_email}</div>
                          {booking.phone && <div className="text-xs text-slate-400">{booking.phone}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-700">{booking.service_name}</div>
                          {booking.provider_name && <div className="text-xs text-slate-400">by {booking.provider_name}</div>}
                          {booking.completed_at && (
                            <div className="text-xs text-emerald-600 flex items-center mt-0.5">
                              <CalendarDays className="w-3 h-3 mr-1" />
                              {new Date(booking.completed_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-slate-600">
                            <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" />
                            {new Date(booking.start_time).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </div>
                          {booking.payment_date && (
                            <div className="text-xs text-slate-400 flex items-center mt-1">
                              <CreditCard className="w-3 h-3 mr-1" />
                              Paid: {new Date(booking.payment_date).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(booking.payment_status)}
                          {booking.payment_reference && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[80px] mt-1" title={booking.payment_reference}>
                              {booking.payment_reference.slice(0, 8)}…
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(booking.status)}
                          {booking.rescheduled_count > 0 && (
                            <span className="text-[10px] text-slate-400 block mt-1">Rescheduled {booking.rescheduled_count}x</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(booking.rating)}
                          {booking.feedback_text && (
                            <div className="text-xs text-slate-400 truncate max-w-[120px]" title={booking.feedback_text}>
                              “{booking.feedback_text}”
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.has_complaint ? (
                            <span className="flex items-center text-rose-600">
                              <Flag className="w-4 h-4 mr-1" />
                              {booking.complaint_resolved ? 'Resolved' : 'Open'}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                          {booking.complaint_notes && (
                            <div className="text-xs text-slate-400 truncate max-w-[120px]" title={booking.complaint_notes}>
                              {booking.complaint_notes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">£{parseFloat(booking.total_price).toFixed(2)}</span>
                          {parseFloat(booking.discount_applied) > 0 && (
                            <span className="text-xs text-emerald-600 block">-£{parseFloat(booking.discount_applied).toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!analyticsLoading && analyticsData.length > 0 && (
              <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Showing {analyticsData.length} records</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* SECTION 2: SUPERSET RECORDS (existing) */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Records Registry</h1>
              </div>
              <p className="text-sm font-medium text-slate-500">Live data synchronized from Superset</p>
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search records..."
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full placeholder:text-slate-400"
                value={supersetSearch}
                onChange={(e) => setSupersetSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            {supersetLoading ? (
              <div className="p-6">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center space-x-4 mb-6 last:mb-0 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : supersetError ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-rose-50 p-4 rounded-full mb-4"><AlertCircle className="w-8 h-8 text-rose-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load Superset data</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">{supersetError}</p>
              </div>
            ) : supersetData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4"><FileText className="w-8 h-8 text-slate-400" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No records found</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">No data available in this Superset chart.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      {supersetHeaders.map((header, idx) => (
                        <th key={idx} className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                          {header.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {supersetData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                        {supersetHeaders.map((header, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                            {renderSupersetCell(header, row[header])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!supersetLoading && supersetData.length > 0 && (
              <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Showing {supersetData.length} records</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ---- Promotion Modal ---- */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Promote to Service Booking</h2>
              <button
                onClick={() => setShowPromoteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Service *</label>
                <select
                  value={promoteServiceId}
                  onChange={(e) => setPromoteServiceId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a service...</option>
                  {servicesError ? (
                    <option value="" disabled className="text-red-500">
                      ⚠️ {servicesError} – refresh page
                    </option>
                  ) : services.length === 0 ? (
                    <option value="" disabled>Loading services...</option>
                  ) : (
                    services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Provider (optional)</label>
                <select
                  value={promoteProviderId}
                  onChange={(e) => setPromoteProviderId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.user_email} – {p.service_name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handlePromote}
                disabled={!promoteServiceId || promoting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {promoting ? 'Promoting...' : 'Promote'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Edit Modal ---- */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Booking #{editingBooking.id}</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Status</label>
                <select
                  value={editForm.payment_status}
                  onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid_cash">Paid (Cash)</option>
                  <option value="paid_card">Paid (Card)</option>
                  <option value="paid_bank">Paid (Bank Transfer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                <select
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="">Not rated</option>
                  {[1,2,3,4,5].map(r => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Completed At</label>
                <input
                  type="datetime-local"
                  value={editForm.completed_at}
                  onChange={(e) => setEditForm({ ...editForm, completed_at: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Complaint Notes</label>
                <textarea
                  value={editForm.complaint_notes}
                  onChange={(e) => setEditForm({ ...editForm, complaint_notes: e.target.value })}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  value={editForm.internal_notes}
                  onChange={(e) => setEditForm({ ...editForm, internal_notes: e.target.value })}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
