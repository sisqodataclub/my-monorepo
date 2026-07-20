// src/pages/BookingsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CalendarDays, AlertCircle, FileText, Search, Star, Flag, X,
  Plus, Edit, ChevronUp, ChevronDown, Mail, Send, Eye
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

import NextBookingCard from '../components/NextBookingCard';
import BookingDetailsModal from '../components/BookingDetailsModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';
const TENANT = 'DDEEP';
const DEFAULT_ARRIVAL_ETA = 'within 30 minutes';

// Full AnalyticsBooking interface – mirrors all ServiceBooking fields
export interface AnalyticsBooking {
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
  cleaning_booking_id?: number;
  cleaning_details?: any;
  last_arrival_sent_at?: string | null;
  last_review_sent_at?: string | null;
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

type SortDirection = 'asc' | 'desc';

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

  // ---- Sorting state ----
  const [sortField, setSortField] = useState<keyof AnalyticsBooking | ''>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
    customer_name: '',
    customer_email: '',
    phone: '',
    service_name: '',
    provider_name: '',
    start_time: '',
    end_time: '',
    payment_status: '',
    status: '',
    rating: '',
    complaint_notes: '',
    internal_notes: '',
    completed_at: '',
    payment_date: '',
    payment_reference: '',
    has_complaint: false,
    complaint_resolved: false,
    complaint_resolved_at: '',
    feedback_text: '',
    cancellation_reason: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    actual_duration_minutes: '',
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

  // --- Track which action is loading per booking ---
  const [actionLoading, setActionLoading] = useState<{ [key: number]: 'arrival' | 'review' | null }>({});

  // --- ETA Modal state ---
  const [showEtaModal, setShowEtaModal] = useState(false);
  const [etaBookingId, setEtaBookingId] = useState<number | null>(null);
  const [etaValue, setEtaValue] = useState(DEFAULT_ARRIVAL_ETA);

  // --- Details Modal state ---
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState<AnalyticsBooking | null>(null);

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

      let servicesData: Service[] = [];
      try {
        const servicesRes = await axios.get(`${API_BASE}/api/payments/services/`, { headers });
        servicesData = Array.isArray(servicesRes.data) ? servicesRes.data : [];
      } catch (err: any) {
        console.error('Failed to fetch services:', err);
        setServicesError(err.message || 'Could not load services');
      }

      let providersData: ServiceProvider[] = [];
      try {
        const providersRes = await axios.get(`${API_BASE}/api/service-providers/`, { headers });
        providersData = providersRes.data.results || providersRes.data || [];
      } catch (err) {
        console.warn('Could not fetch providers (optional):', err);
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

  // --- Edit handler (open modal and populate all fields) ---
  const openEditModal = (booking: AnalyticsBooking) => {
    setEditingBooking(booking);
    setEditForm({
      customer_name: booking.customer_name || '',
      customer_email: booking.customer_email || '',
      phone: booking.phone || '',
      service_name: booking.service_name || '',
      provider_name: booking.provider_name || '',
      start_time: booking.start_time || '',
      end_time: booking.end_time || '',
      payment_status: booking.payment_status || '',
      status: booking.status || '',
      rating: booking.rating ? String(booking.rating) : '',
      complaint_notes: booking.complaint_notes || '',
      internal_notes: booking.internal_notes || '',
      completed_at: booking.completed_at || '',
      payment_date: booking.payment_date || '',
      payment_reference: booking.payment_reference || '',
      has_complaint: booking.has_complaint || false,
      complaint_resolved: booking.complaint_resolved || false,
      complaint_resolved_at: booking.complaint_resolved_at || '',
      feedback_text: booking.feedback_text || '',
      cancellation_reason: booking.cancellation_reason || '',
      utm_source: booking.utm_source || '',
      utm_medium: booking.utm_medium || '',
      utm_campaign: booking.utm_campaign || '',
      actual_duration_minutes: booking.actual_duration_minutes ? String(booking.actual_duration_minutes) : '',
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;
    setUpdating(true);
    try {
      const headers = await getHeaders();
      const payload: any = {};

      const fieldsToUpdate = {
        customer_name: editForm.customer_name,
        customer_email: editForm.customer_email,
        phone: editForm.phone,
        payment_status: editForm.payment_status,
        status: editForm.status,
        rating: editForm.rating ? parseInt(editForm.rating) : null,
        complaint_notes: editForm.complaint_notes,
        internal_notes: editForm.internal_notes,
        completed_at: editForm.completed_at || undefined,
        payment_date: editForm.payment_date || undefined,
        payment_reference: editForm.payment_reference,
        has_complaint: editForm.has_complaint,
        complaint_resolved: editForm.complaint_resolved,
        complaint_resolved_at: editForm.complaint_resolved_at || undefined,
        feedback_text: editForm.feedback_text,
        cancellation_reason: editForm.cancellation_reason,
        utm_source: editForm.utm_source,
        utm_medium: editForm.utm_medium,
        utm_campaign: editForm.utm_campaign,
        actual_duration_minutes: editForm.actual_duration_minutes ? parseInt(editForm.actual_duration_minutes) : null,
      };

      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (value !== undefined && value !== '') {
          payload[key] = value;
        }
      }

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

  // ---- Check if notification already sent ----
  const checkNotificationSent = async (bookingId: number, type: 'arrival' | 'review'): Promise<boolean> => {
    try {
      const headers = await getHeaders();
      const response = await axios.get(
        `${API_BASE}/api/notifications/check/?booking_id=${bookingId}&type=${type}`,
        { headers }
      );
      return response.data.sent === true;
    } catch (err) {
      console.warn('Failed to check notification status:', err);
      return false;
    }
  };

  // ---- ETA Modal handlers (with check) ----
  const handleArrivalClick = async (bookingId: number) => {
    const alreadySent = await checkNotificationSent(bookingId, 'arrival');
    if (alreadySent) {
      const shouldResend = window.confirm(
        'An arrival notification has already been sent for this booking.\nDo you want to send another?'
      );
      if (!shouldResend) return;
    }
    openEtaModal(bookingId);
  };

  const openEtaModal = (bookingId: number) => {
    setEtaBookingId(bookingId);
    setEtaValue(DEFAULT_ARRIVAL_ETA);
    setShowEtaModal(true);
  };

  const handleSendArrivalWithEta = async () => {
    if (!etaBookingId) return;
    setActionLoading(prev => ({ ...prev, [etaBookingId]: 'arrival' }));
    try {
      const headers = await getHeaders();
      const payload = { eta: etaValue.trim() || DEFAULT_ARRIVAL_ETA };
      const response = await axios.post(
        `${API_BASE}/api/service-bookings/${etaBookingId}/notify_arrival/`,
        payload,
        { headers }
      );
      alert(`✅ ${response.data.message || 'Arrival email sent!'}`);
      setShowEtaModal(false);
      setEtaBookingId(null);
    } catch (err: any) {
      console.error('Arrival email failed:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to send arrival email.';
      alert(`❌ ${errorMsg}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [etaBookingId]: null }));
      setEtaBookingId(null);
    }
  };

  // ---- Review handler (with check) ----
  const handleSendReview = async (bookingId: number) => {
    const alreadySent = await checkNotificationSent(bookingId, 'review');
    if (alreadySent) {
      const shouldResend = window.confirm(
        'A review request has already been sent for this booking.\nDo you want to send another?'
      );
      if (!shouldResend) return;
    }

    setActionLoading(prev => ({ ...prev, [bookingId]: 'review' }));
    try {
      const headers = await getHeaders();
      const response = await axios.post(
        `${API_BASE}/api/service-bookings/${bookingId}/request_review/`,
        {},
        { headers }
      );
      alert(`✅ ${response.data.message || 'Review request sent!'}`);
    } catch (err: any) {
      console.error('Review request failed:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to send review request.';
      alert(`❌ ${errorMsg}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: null }));
    }
  };

  // --- View Details handler (fetches cleaning details if available) ---
  const handleViewDetails = async (bookingId: number) => {
    const serviceBooking = analyticsData.find(b => b.id === bookingId);
    if (!serviceBooking) return;

    if (serviceBooking.cleaning_booking_id) {
      try {
        const headers = await getHeaders();
        const response = await axios.get(
          `${API_BASE}/api/cleaning-bookings/${serviceBooking.cleaning_booking_id}/details/`,
          { headers }
        );
        const fullBooking = {
          ...serviceBooking,
          cleaning_details: response.data,
        };
        setDetailsBooking(fullBooking);
        setShowDetailsModal(true);
      } catch (err) {
        console.error('Failed to fetch cleaning details:', err);
        setDetailsBooking(serviceBooking);
        setShowDetailsModal(true);
      }
    } else {
      setDetailsBooking(serviceBooking);
      setShowDetailsModal(true);
    }
  };

  // ---- Sorting ----
  const handleSort = (field: keyof AnalyticsBooking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ---- Sorted data ----
  const sortedData = useMemo(() => {
    if (!sortField || !analyticsData.length) return analyticsData;
    const sorted = [...analyticsData];
    sorted.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [analyticsData, sortField, sortDirection]);

  // --- Render helpers ---
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
        {/* Next Booking Card */}
        <NextBookingCard
          bookings={analyticsData}
          loading={analyticsLoading}
          onArrivalClick={handleArrivalClick}
          onReviewClick={handleSendReview}
          onViewDetails={handleViewDetails}
          actionLoading={actionLoading}
          statusFilter="confirmed"
        />

        {/* Pending Promotions */}
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

        {/* Booking Analytics – full columns */}
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
              <div className="p-6">Loading...</div>
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
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('customer_name')}
                      >
                        Customer {sortField === 'customer_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('service_name')}
                      >
                        Service {sortField === 'service_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('start_time')}
                      >
                        Date/Time {sortField === 'start_time' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('payment_status')}
                      >
                        Payment Status {sortField === 'payment_status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('status')}
                      >
                        Job Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('rating')}
                      >
                        Rating {sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('has_complaint')}
                      >
                        Complaint {sortField === 'has_complaint' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort('total_price')}
                      >
                        Total {sortField === 'total_price' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      {/* Additional fields */}
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Payment Info</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Completed</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Discount</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Tax</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Cancellation</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">UTM</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Duration</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Internal Notes</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Created</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Last Arrival</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Last Review</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedData.map((booking) => {
                      const isLoadingArrival = actionLoading[booking.id] === 'arrival';
                      const isLoadingReview = actionLoading[booking.id] === 'review';
                      return (
                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{booking.customer_name}</div>
                            <div className="text-xs text-slate-500">{booking.customer_email}</div>
                            {booking.phone && <div className="text-xs text-slate-400">{booking.phone}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-700">{booking.service_name}</div>
                            {booking.provider_name && <div className="text-xs text-slate-400">by {booking.provider_name}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-slate-600">
                              <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" />
                              {new Date(booking.start_time).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </div>
                            {booking.end_time && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                End: {new Date(booking.end_time).toLocaleTimeString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(booking.payment_status)}
                            {booking.payment_reference && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[80px] mt-1" title={booking.payment_reference}>
                                Ref: {booking.payment_reference.slice(0, 8)}…
                              </div>
                            )}
                            {booking.payment_date && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(booking.payment_date).toLocaleDateString()}
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
                            {parseFloat(booking.tax_applied) > 0 && (
                              <span className="text-xs text-slate-500 block">Tax: £{parseFloat(booking.tax_applied).toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.payment_date ? new Date(booking.payment_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.completed_at ? new Date(booking.completed_at).toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            £{parseFloat(booking.discount_applied).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            £{parseFloat(booking.tax_applied).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.cancellation_reason || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.utm_source || '-'}
                            {booking.utm_medium && <span className="text-xs text-slate-400 block">{booking.utm_medium}</span>}
                            {booking.utm_campaign && <span className="text-xs text-slate-400 block">{booking.utm_campaign}</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.actual_duration_minutes ? `${booking.actual_duration_minutes}m` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.internal_notes ? (
                              <div className="text-xs text-slate-400 truncate max-w-[100px]" title={booking.internal_notes}>
                                {booking.internal_notes}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.last_arrival_sent_at ? new Date(booking.last_arrival_sent_at).toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.last_review_sent_at ? new Date(booking.last_review_sent_at).toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => openEditModal(booking)}
                                className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => handleViewDetails(booking.id)}
                                className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition"
                              >
                                <Eye className="w-4 h-4" /> Details
                              </button>
                              <button
                                onClick={() => handleArrivalClick(booking.id)}
                                disabled={isLoadingArrival}
                                className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition disabled:opacity-50"
                              >
                                <Send className="w-4 h-4" />
                                {isLoadingArrival ? 'Sending…' : 'Arrival'}
                              </button>
                              <button
                                onClick={() => handleSendReview(booking.id)}
                                disabled={isLoadingReview}
                                className="text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition disabled:opacity-50"
                              >
                                <Mail className="w-4 h-4" />
                                {isLoadingReview ? 'Sending…' : 'Review'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

        {/* Superset Records */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Records Registry</h1>
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
              <div className="p-6">Loading...</div>
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

      {/* Promotion Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Promote to Service Booking</h2>
              <button onClick={() => setShowPromoteModal(false)} className="text-slate-400 hover:text-slate-600">
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
                    <option value="" disabled className="text-red-500">⚠️ {servicesError} – refresh page</option>
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

      {/* ETA Modal */}
      {showEtaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Estimated Arrival Time</h2>
              <button onClick={() => setShowEtaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Enter the estimated arrival time for the customer:</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ETA (e.g., "within 30 minutes" or "2:30 PM")
                </label>
                <input
                  type="text"
                  value={etaValue}
                  onChange={(e) => setEtaValue(e.target.value)}
                  placeholder="e.g., within 30 minutes"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSendArrivalWithEta}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition"
              >
                Send Arrival Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Booking #{editingBooking.id}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={editForm.customer_name}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={editForm.customer_email}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    name="service_name"
                    value={editForm.service_name}
                    disabled
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
                  <input
                    type="text"
                    name="provider_name"
                    value={editForm.provider_name || ''}
                    disabled
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={editForm.start_time}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={editForm.end_time}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Status</label>
                  <select
                    name="payment_status"
                    value={editForm.payment_status}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid_cash">Paid (Cash)</option>
                    <option value="paid_card">Paid (Card)</option>
                    <option value="paid_bank">Paid (Bank Transfer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditFormChange}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                  <select
                    name="rating"
                    value={editForm.rating}
                    onChange={handleEditFormChange}
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
                    name="completed_at"
                    value={editForm.completed_at}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
                  <input
                    type="datetime-local"
                    name="payment_date"
                    value={editForm.payment_date}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Reference</label>
                  <input
                    type="text"
                    name="payment_reference"
                    value={editForm.payment_reference}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Has Complaint</label>
                  <input
                    type="checkbox"
                    name="has_complaint"
                    checked={editForm.has_complaint}
                    onChange={(e) => setEditForm(prev => ({ ...prev, has_complaint: e.target.checked }))}
                    className="mr-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Complaint Resolved</label>
                  <input
                    type="checkbox"
                    name="complaint_resolved"
                    checked={editForm.complaint_resolved}
                    onChange={(e) => setEditForm(prev => ({ ...prev, complaint_resolved: e.target.checked }))}
                    className="mr-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Complaint Resolved At</label>
                  <input
                    type="datetime-local"
                    name="complaint_resolved_at"
                    value={editForm.complaint_resolved_at}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Actual Duration (minutes)</label>
                  <input
                    type="number"
                    name="actual_duration_minutes"
                    value={editForm.actual_duration_minutes}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Complaint Notes</label>
                <textarea
                  name="complaint_notes"
                  value={editForm.complaint_notes}
                  onChange={handleEditFormChange}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  name="internal_notes"
                  value={editForm.internal_notes}
                  onChange={handleEditFormChange}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Feedback Text</label>
                <textarea
                  name="feedback_text"
                  value={editForm.feedback_text}
                  onChange={handleEditFormChange}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Reason</label>
                <textarea
                  name="cancellation_reason"
                  value={editForm.cancellation_reason}
                  onChange={handleEditFormChange}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">UTM Source</label>
                  <input
                    type="text"
                    name="utm_source"
                    value={editForm.utm_source}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">UTM Medium</label>
                  <input
                    type="text"
                    name="utm_medium"
                    value={editForm.utm_medium}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">UTM Campaign</label>
                  <input
                    type="text"
                    name="utm_campaign"
                    value={editForm.utm_campaign}
                    onChange={handleEditFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <BookingDetailsModal
        booking={detailsBooking}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
}
