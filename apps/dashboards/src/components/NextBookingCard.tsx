// src/components/NextBookingCard.tsx
import { useMemo } from 'react';
import { CalendarDays, User, Mail, Send, Phone, ClipboardList } from 'lucide-react';

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
  onViewDetails?: (bookingId: number) => void;
  actionLoading?: Record<number, 'arrival' | 'review' | null>;
  statusFilter?: string | string[];
  getStartTime?: (booking: T) => string;
  limit?: number; // new: max number of bookings to show
}

export default function NextBookingCard<T extends Booking>({
  bookings,
  loading = false,
  onArrivalClick,
  onReviewClick,
  onViewDetails,
  actionLoading = {},
  statusFilter = 'confirmed',
  getStartTime = (b) => b.start_time,
  limit = 3,
}: NextBookingCardProps<T>) {
  // Compute the next bookings list (up to `limit`)
  const nextBookings = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    const statuses = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
    const now = new Date();

    // Filter by status and sort ascending by start_time
    const filtered = bookings.filter(b => statuses.includes(b.status));
    const sorted = [...filtered].sort((a, b) => {
      const aTime = new Date(getStartTime(a)).getTime();
      const bTime = new Date(getStartTime(b)).getTime();
      return aTime - bTime;
    });

    // Split into future and past
    const future = sorted.filter(b => new Date(getStartTime(b)) > now);
    const past = sorted.filter(b => new Date(getStartTime(b)) <= now);

    // Build the result list:
    // 1. Take up to `limit` from future (already sorted ascending)
    // 2. If we still need more, take the most recent past bookings (sorted descending by start_time)
    let result: T[] = [...future].slice(0, limit);
    if (result.length < limit) {
      const needed = limit - result.length;
      // Sort past descending (most recent first)
      const mostRecentPast = [...past].sort((a, b) => {
        const aTime = new Date(getStartTime(a)).getTime();
        const bTime = new Date(getStartTime(b)).getTime();
        return bTime - aTime;
      });
      result = result.concat(mostRecentPast.slice(0, needed));
    }

    return result;
  }, [bookings, statusFilter, getStartTime, limit]);

  const hasBookings = nextBookings.length > 0;

  // Determine if any booking is loading (we don't have per‑booking loading for the card)
  const isLoading = loading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="min-w-[280px] flex-1 bg-slate-100 rounded-xl p-4 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasBookings) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 text-center text-slate-500">
        No confirmed upcoming bookings
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {nextBookings.length === 1 ? 'Next Booking' : 'Next Bookings'}
        </h3>
        {nextBookings.length > 1 && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            {nextBookings.length} upcoming
          </span>
        )}
      </div>

      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {nextBookings.map((booking, index) => {
            const isFirst = index === 0;
            const isArrivalLoading = actionLoading[booking.id] === 'arrival';
            const isReviewLoading = actionLoading[booking.id] === 'review';

            return (
              <div
                key={booking.id}
                className={`flex-shrink-0 w-72 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-xl border ${
                  isFirst
                    ? 'border-blue-300 shadow-md shadow-blue-100/50'
                    : 'border-slate-200'
                } p-4 transition hover:shadow-md`}
              >
                {isFirst && (
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Next Up</span>
                )}
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-800">{booking.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.customer_email}</span>
                  </div>
                  {booking.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(getStartTime(booking)).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium">Service:</span>
                    <span className="text-slate-700">{booking.service_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                      booking.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' :
                      booking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => onArrivalClick(booking.id)}
                    disabled={isArrivalLoading}
                    className="flex-1 min-w-[70px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    {isArrivalLoading ? 'Sending…' : 'Arrival'}
                  </button>
                  <button
                    onClick={() => onReviewClick(booking.id)}
                    disabled={isReviewLoading}
                    className="flex-1 min-w-[70px] bg-amber-600 hover:bg-amber-700 text-white px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition disabled:opacity-50"
                  >
                    <Mail className="w-3 h-3" />
                    {isReviewLoading ? 'Sending…' : 'Review'}
                  </button>
                  {onViewDetails && (
                    <button
                      onClick={() => onViewDetails(booking.id)}
                      className="flex-1 min-w-[70px] bg-slate-600 hover:bg-slate-700 text-white px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                    >
                      <ClipboardList className="w-3 h-3" />
                      Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
