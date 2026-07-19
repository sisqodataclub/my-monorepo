// src/components/NextBookingCard.tsx
import { useMemo } from 'react';
import { CalendarDays, User, Mail, Send, Phone, ClipboardList } from 'lucide-react'; // 👈 added ClipboardList

// Minimal booking interface – extend as needed
export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  phone?: string;
  service_name: string;
  start_time: string;
  status: string;
}

interface NextBookingCardProps<T extends Booking = Booking> {
  bookings: T[];
  loading?: boolean;
  onArrivalClick: (bookingId: number) => void;
  onReviewClick: (bookingId: number) => void;
  onViewDetails?: (bookingId: number) => void; // 👈 new optional prop
  actionLoading?: Record<number, 'arrival' | 'review' | null>;
  statusFilter?: string | string[];      // default: 'confirmed'
  getStartTime?: (booking: T) => string; // custom time field mapping
}

export default function NextBookingCard<T extends Booking>({
  bookings,
  loading = false,
  onArrivalClick,
  onReviewClick,
  onViewDetails, // 👈 new prop
  actionLoading = {},
  statusFilter = 'confirmed',
  getStartTime = (b) => b.start_time,
}: NextBookingCardProps<T>) {
  // ---- Compute the next booking ----
  const nextBooking = useMemo(() => {
    if (!bookings || bookings.length === 0) return null;

    const statuses = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
    const now = new Date();

    // Filter by status
    const filtered = bookings.filter(b => statuses.includes(b.status));
    // Sort by start_time ascending
    const sorted = [...filtered].sort((a, b) => {
      const aTime = new Date(getStartTime(a)).getTime();
      const bTime = new Date(getStartTime(b)).getTime();
      return aTime - bTime;
    });

    // Pick first future booking, or the soonest overall if none future
    const future = sorted.filter(b => new Date(getStartTime(b)) > now);
    return future.length > 0 ? future[0] : sorted[0] || null;
  }, [bookings, statusFilter, getStartTime]);

  // Determine loading states for the next booking
  const isArrivalLoading = nextBooking ? actionLoading[nextBooking.id] === 'arrival' : false;
  const isReviewLoading = nextBooking ? actionLoading[nextBooking.id] === 'review' : false;

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded"></div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-slate-100 rounded w-24"></div>
          <div className="h-10 bg-slate-100 rounded w-24"></div>
          <div className="h-10 bg-slate-100 rounded w-24"></div>
        </div>
      </div>
    );
  }

  // ---- No booking ----
  if (!nextBooking) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 text-center text-slate-500">
        No confirmed upcoming bookings
      </div>
    );
  }

  // ---- Render the card ----
  return (
    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 p-6 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between flex-wrap gap-4">
        {/* Left: booking details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Next Booking</h3>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-600" />
            <span className="text-lg font-bold text-slate-900">{nextBooking.customer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4" />
            <span>{nextBooking.customer_email}</span>
            {nextBooking.phone && (
              <>
                <Phone className="w-4 h-4 ml-3" />
                <span>{nextBooking.phone}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{new Date(getStartTime(nextBooking)).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Service:</span>
              <span>{nextBooking.service_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                nextBooking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                nextBooking.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                nextBooking.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' :
                nextBooking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {nextBooking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onArrivalClick(nextBooking.id)}
            disabled={isArrivalLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isArrivalLoading ? 'Sending…' : 'Send Arrival'}
          </button>
          <button
            onClick={() => onReviewClick(nextBooking.id)}
            disabled={isReviewLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-4 h-4" />
            {isReviewLoading ? 'Sending…' : 'Request Review'}
          </button>
          {/* 👇 New View Details button */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(nextBooking.id)}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
            >
              <ClipboardList className="w-4 h-4" />
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
