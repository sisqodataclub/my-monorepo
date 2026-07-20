// src/components/BookingsTable.tsx
import { Download, Mail, FileText, Edit, Trash2, Plus } from 'lucide-react';

type SortDirection = 'asc' | 'desc';

interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  total: string;
  status: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  show: boolean;
  onToggle: () => void;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortField: string;
  sortOrder: SortDirection;
  onSort: (field: string) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: number) => void;
  onCreateInvoice: (booking: Booking) => void;
  onDownloadPdf: (invoiceId: number) => void;
  onEmailInvoice: (invoiceId: number) => void;
  bookingInvoiceMap: Record<number, number>;
  bookingActionLoading: Record<number, boolean>;
}

export default function BookingsTable({
  bookings,
  loading,
  show,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onCreateInvoice,
  onDownloadPdf,
  onEmailInvoice,
  bookingInvoiceMap,
  bookingActionLoading,
}: BookingsTableProps) {
  if (!show) return null;

  const renderSortIndicator = (field: string) =>
    sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => onSort('id')}
              >
                Booking # {renderSortIndicator('id')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => onSort('customer_name')}
              >
                Customer {renderSortIndicator('customer_name')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => onSort('total')}
              >
                Total {renderSortIndicator('total')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => onSort('status')}
              >
                Status {renderSortIndicator('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const invoiceId = bookingInvoiceMap[booking.id];
                const isLoading = bookingActionLoading[booking.id] || false;
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.customer_name}</div>
                      <div className="text-sm text-gray-500">{booking.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      £{Number(booking.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        {invoiceId ? (
                          <>
                            <span className="text-xs text-gray-500 mr-1">Inv #{invoiceId}</span>
                            <button
                              onClick={() => onDownloadPdf(invoiceId)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded"
                              title="Download PDF"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => onEmailInvoice(invoiceId)}
                              className="text-purple-600 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1 rounded"
                              title="Email Invoice"
                            >
                              <Mail size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onCreateInvoice(booking)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded disabled:opacity-50"
                          >
                            {isLoading ? 'Loading...' : <FileText size={16} />}
                            {isLoading ? 'Loading...' : 'Create Invoice'}
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(booking)}
                          className="text-amber-600 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-3 py-1 rounded"
                          title="Edit Booking"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(booking.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 bg-red-50 px-3 py-1 rounded"
                          title="Delete Booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
