// src/components/BookingDetailsModal.tsx
import { X, User, Mail, Phone, CalendarDays } from 'lucide-react';
import type { AnalyticsBooking } from '../pages/BookingsPage';

interface BookingDetailsModalProps {
  booking: AnalyticsBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-medium">{booking.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-400" />
              <span>{booking.customer_email}</span>
            </div>
            {booking.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <span>{booking.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-slate-400" />
              <span>{new Date(booking.start_time).toLocaleString()}</span>
            </div>
          </div>

          {/* Service & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Service</span>
              <p className="font-medium">{booking.service_name}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Status</span>
              <p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  booking.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                  booking.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' :
                  booking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {booking.status}
                </span>
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Payment Status</span>
              <p>{booking.payment_status}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Total</span>
              <p className="text-lg font-bold text-slate-900">£{parseFloat(booking.total_price).toFixed(2)}</p>
            </div>
          </div>

          {/* Extended Details (if available) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Additional Info</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {booking.payment_reference && (
                <div>
                  <span className="text-slate-500">Payment Ref:</span>
                  <span className="ml-1 font-mono">{booking.payment_reference}</span>
                </div>
              )}
              {booking.completed_at && (
                <div>
                  <span className="text-slate-500">Completed:</span>
                  <span className="ml-1">{new Date(booking.completed_at).toLocaleString()}</span>
                </div>
              )}
              {booking.rating !== null && (
                <div>
                  <span className="text-slate-500">Rating:</span>
                  <span className="ml-1">{booking.rating} / 5</span>
                </div>
              )}
              {booking.has_complaint && (
                <div className="col-span-2">
                  <span className="text-slate-500">Complaint:</span>
                  <span className="ml-1 text-rose-600">
                    {booking.complaint_resolved ? 'Resolved' : 'Open'}
                    {booking.complaint_notes && ` – ${booking.complaint_notes}`}
                  </span>
                </div>
              )}
              {booking.provider_name && (
                <div>
                  <span className="text-slate-500">Provider:</span>
                  <span className="ml-1">{booking.provider_name}</span>
                </div>
              )}
              {booking.rescheduled_count > 0 && (
                <div>
                  <span className="text-slate-500">Rescheduled:</span>
                  <span className="ml-1">{booking.rescheduled_count}x</span>
                </div>
              )}
            </div>
          </div>

          {/* Raw Data (for debugging, optional) */}
          <details className="text-xs text-slate-500 mt-4 border-t pt-4">
            <summary className="cursor-pointer font-medium">View raw data</summary>
            <pre className="mt-2 bg-slate-50 p-3 rounded overflow-x-auto max-h-60">
              {JSON.stringify(booking, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
