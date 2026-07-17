import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CalendarDays, AlertCircle, FileText, Search, Star, Flag, CreditCard, X,
  Plus, Edit, Check, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

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

  // --- Superset data (existing) ---
  const [supersetData, setSupersetData] = useState<any[]>([]);
  const [supersetLoading, setSupersetLoading] = useState(true);
  const [supersetError, setSupersetError] = useState<string | null>(null);

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
      const token = await getToken();
      const params = new URLSearchParams();
      if (analyticsSearch) params.append('search', analyticsSearch);
      if (analyticsFilters.payment_status) params.append('payment_status', analyticsFilters.payment_status);
      if (analyticsFilters.job_status) params.append('status', analyticsFilters.job_status);
      if (analyticsFilters.has_complaint) params.append('has_complaint', analyticsFilters.has_complaint === 'true' ? 'true' : 'false');
      if (analyticsFilters.rating) params.append('rating', analyticsFilters.rating);

      const response = await axios.get(
        `${API_BASE}/api/service-bookings/analytics/?${params.toString()}`,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
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
      const token = await getToken();
      const response = await axios.get(
        `${API_BASE}/api/cleaning-bookings/unpromoted/`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  const fetchServicesAndProviders = async () => {
    try {
      const token = await getToken();
      const [servicesRes, providersRes] = await Promise.all([
        axios.get(`${API_BASE}/api/services/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/service-providers/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setServices(servicesRes.data.results || servicesRes.data || []);
      setProviders(providersRes.data.results || providersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch services/providers:', err);
    }
  };

  // --- Promotion handler ---
  const handlePromote = async () => {
    if (!selectedCleaningId || !promoteServiceId) return;
    setPromoting(true);
    try {
      const token = await getToken();
      const payload: any = { service_id: parseInt(promoteServiceId) };
      if (promoteProviderId) payload.provider_id = parseInt(promoteProviderId);

      const response = await axios.post(
        `${API_BASE}/api/cleaning-bookings/${selectedCleaningId}/promote/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Close modal and refresh lists
      setShowPromoteModal(false);
      setSelectedCleaningId(null);
      setPromoteServiceId('');
      setPromoteProviderId('');
      await loadAllData();
      alert('Promoted successfully!');
    } catch (err) {
      console.error('Promotion failed:', err);
      alert('Failed to promote. Please try again.');
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
      const token = await getToken();
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      await fetchAnalytics(); // refresh
      alert('Booking updated!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update booking.');
    } finally {
      setUpdating(false);
    }
  };

  // --- Render helpers (unchanged) ---
  const renderStars = (rating: number | null) => { /* ... */ };
  const renderStatusBadge = (status: string) => { /* ... */ };
  const renderSupersetCell = (key: string, value: any) => { /* ... */ };
  const clearAnalyticsFilters = () => { /* ... */ };

  // --- Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
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
        {/* ============================================================ */}
        {/* SECTION 0: PENDING PROMOTIONS (CleaningBookings) */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Pending Promotions</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {cleaningBookings.length} booking(s)
            </span>
          </div>
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
              {/* ... existing filters ... */}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            {analyticsLoading ? ( /* skeleton */ ) : analyticsError ? ( /* error */ ) : analyticsData.length === 0 ? ( /* empty */ ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Customer</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Service</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Date/Time</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Payment</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Rating</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Complaint</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Total</th>
                      <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                        {/* ... existing cells ... */}
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
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* SECTION 2: SUPERSET RECORDS (unchanged) */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants}>
          {/* ... existing Superset table ... */}
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
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                  ))}
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
