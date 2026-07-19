// src/components/BookingDetailsModal.tsx
import { X, User, Mail, Phone, CalendarDays, ClipboardList } from 'lucide-react';
import type { AnalyticsBooking } from '../pages/BookingsPage';

interface BookingDetailsModalProps {
  booking: AnalyticsBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  const cleaning = (booking as any).cleaning_details;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
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

          {/* Cleaning Details */}
          {cleaning && (
            <div className="space-y-4 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Cleaning Details
              </h3>

              {cleaning.selected_areas && cleaning.selected_areas.length > 0 && (
                <div>
                  <span className="text-xs text-slate-500">Selected Areas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cleaning.selected_areas.map((area: any, i: number) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {String(area)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cleaning.item_names && Object.keys(cleaning.item_names).length > 0 && (
                <div>
                  <span className="text-xs text-slate-500">Services:</span>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {Object.entries(cleaning.item_names).map(([name, qty]) => (
                      <div key={name} className="text-sm flex justify-between border-b border-slate-100 py-0.5">
                        <span>{name}</span>
                        <span className="text-slate-500">×{String(qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500">Carpets:</span>
                  <pre className="text-xs bg-slate-50 p-1 rounded mt-1 overflow-x-auto">
                    {cleaning.carpets && Object.keys(cleaning.carpets).length > 0
                      ? JSON.stringify(cleaning.carpets, null, 2)
                      : 'None'}
                  </pre>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Appliances:</span>
                  <pre className="text-xs bg-slate-50 p-1 rounded mt-1 overflow-x-auto">
                    {cleaning.appliances && Object.keys(cleaning.appliances).length > 0
                      ? JSON.stringify(cleaning.appliances, null, 2)
                      : 'None'}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {cleaning.furnished_status && (
                  <div>
                    <span className="text-slate-500">Furnished:</span>
                    <span className="ml-1 font-medium">{cleaning.furnished_status}</span>
                  </div>
                )}
                {cleaning.parking && (
                  <div>
                    <span className="text-slate-500">Parking:</span>
                    <span className="ml-1 font-medium">{cleaning.parking}</span>
                  </div>
                )}
                {cleaning.biohazard && (
                  <div>
                    <span className="text-slate-500">Biohazard:</span>
                    <span className="ml-1 font-medium">{cleaning.biohazard}</span>
                  </div>
                )}
                {cleaning.payment_method && (
                  <div>
                    <span className="text-slate-500">Payment Method:</span>
                    <span className="ml-1 font-medium">{cleaning.payment_method}</span>
                  </div>
                )}
              </div>

              {cleaning.paymentlink && (
                <div>
                  <span className="text-xs text-slate-500">Payment Link:</span>
                  <a
                    href={cleaning.paymentlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline text-sm truncate block"
                  >
                    {cleaning.paymentlink}
                  </a>
                </div>
              )}

              {cleaning.property_details && (
                <div>
                  <span className="text-xs text-slate-500">Property Details:</span>
                  <div className="mt-1 text-sm bg-slate-50 p-2 rounded space-y-1">
                    {cleaning.property_details.address && (
                      <div><span className="text-slate-500">Address:</span> {cleaning.property_details.address}</div>
                    )}
                    {cleaning.property_details.postcode && (
                      <div><span className="text-slate-500">Postcode:</span> {cleaning.property_details.postcode}</div>
                    )}
                    {cleaning.property_details.additional_info && (
                      <div><span className="text-slate-500">Info:</span> {cleaning.property_details.additional_info}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Service Info */}
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Additional Service Info</h3>
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

          {/* Raw Data */}
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
