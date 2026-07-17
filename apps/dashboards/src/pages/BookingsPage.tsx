import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CalendarDays, AlertCircle, FileText, Search, Star, Flag, CreditCard } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// -------------------------------------------------------------------
// Type definitions for analytics bookings
// -------------------------------------------------------------------
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
  status: string; // job status
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

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------
export default function BookingsPage() {
  const { getToken } = useAuth();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

  // --- State for Analytics Table (NEW) ---
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

  // --- State for Superset Table (existing) ---
  const [supersetData, setSupersetData] = useState<any[]>([]);
  const [supersetLoading, setSupersetLoading] = useState(true);
  const [supersetError, setSupersetError] = useState<string | null>(null);
  const [supersetSearch, setSupersetSearch] = useState('');

  // --- Fetch Analytics Data ---
  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const token = await getToken();
        const params = new URLSearchParams({
          ...(analyticsSearch && { search: analyticsSearch }),
          ...(analyticsFilters.payment_status && { payment_status: analyticsFilters.payment_status }),
          ...(analyticsFilters.job_status && { status: analyticsFilters.job_status }),
          ...(analyticsFilters.has_complaint && { has_complaint: analyticsFilters.has_complaint === 'true' }),
          ...(analyticsFilters.rating && { rating: analyticsFilters.rating }),
        });
        const response = await axios.get(
          `${API_BASE}/api/service-bookings/analytics/?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnalyticsData(response.data.results || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setAnalyticsError('Failed to load booking analytics.');
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [getToken, analyticsSearch, analyticsFilters]);

  // --- Fetch Superset Data (existing) ---
  useEffect(() => {
    const fetchSuperset = async () => {
      setSupersetLoading(true);
      setSupersetError(null);
      try {
        const token = await getToken();
        const queryParams = new URLSearchParams({ chart_ids: '3' });
        const response = await axios.get(
          `${API_BASE}/api/v1/dashboard/overview/?${queryParams}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
    fetchSuperset();
  }, [getToken]);

  // --- Helpers for Analytics Table ---
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

  const renderStatusBadge = (status: string, type: 'payment' | 'job') => {
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

  // --- Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  // --- Superset table helpers (unchanged) ---
  const supersetHeaders = supersetData.length > 0 ? Object.keys(supersetData[0]) : [];
  const renderSupersetCell = (key: string, value: any) => {
    // (same as original renderCell function – you can reuse it)
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

  // --- Clear filters helper ---
  const clearAnalyticsFilters = () => {
    setAnalyticsFilters({ payment_status: '', job_status: '', has_complaint: '', rating: '' });
    setAnalyticsSearch('');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-50 pt-6">
      <motion.div
        className="max-w-[90rem] mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ============================================================ */}
        {/* SECTION 1: BOOKING ANALYTICS (NEW) */}
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
                    <div className="h-4 bg-slate-100 rounded w-1/6"></div><div className="h-4 bg-slate-100 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/6"></div><div className="h-4 bg-slate-100 rounded w-1/6"></div>
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
                          {renderStatusBadge(booking.payment_status, 'payment')}
                          {booking.payment_reference && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[80px] mt-1" title={booking.payment_reference}>
                              {booking.payment_reference.slice(0, 8)}…
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(booking.status, 'job')}
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
        {/* SECTION 2: SUPERSET RECORDS (EXISTING) */}
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
    </div>
  );
}
