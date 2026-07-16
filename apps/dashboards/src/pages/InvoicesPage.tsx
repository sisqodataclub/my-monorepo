import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, type Variants } from 'framer-motion';
import { Plus, Download, Edit, Mail, X, FileText } from 'lucide-react';
import type { Service, Invoice } from '../api/invoiceApi';
import {
  fetchServices,
  fetchInvoices,
  createInvoice,
  updateInvoice,
  downloadInvoicePdf,
  emailInvoice,
} from '../api/invoiceApi';
import axios from 'axios';

// -------------------------------------------------------------------
// API base – adjust if needed
// -------------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL || 'https://core.franciscodes.com';

// -------------------------------------------------------------------
// Fetch bookings – reuses the same pattern as fetchInvoices
// -------------------------------------------------------------------
const fetchBookings = async (token: string | null): Promise<any[]> => {
  const headers: any = { Authorization: `Bearer ${token}` };
  // If you use tenant header, add it here
  // const tenant = getTenantHeader();
  // if (tenant) headers['X-Tenant'] = tenant;
  const res = await axios.get(`${API_BASE}/api/cleaning-bookings/`, { headers });
  // handle paginated response
  if (res.data && res.data.results && Array.isArray(res.data.results)) {
    return res.data.results;
  }
  return Array.isArray(res.data) ? res.data : [];
};

export default function InvoicesPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  // Map booking ID → created invoice ID (so we can show download/email actions)
  const [bookingInvoiceMap, setBookingInvoiceMap] = useState<Record<number, number>>({});
  const [bookingActionLoading, setBookingActionLoading] = useState<Record<number, boolean>>({});

  // Form state (unchanged)
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    invoiceDate: '',
    dueDate: '',
    status: 'draft',
    currency: 'USD',
    templateChoice: 'quotation_1',
    notes: '',
    receipt: false,
  });
  const [items, setItems] = useState([
    { service_id: '', quantity: 1, tax_rate: 0, discount: 0, unit_price: 0, description: '', measurement: '' },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const token = await getToken();
    try {
      const [invoicesData, servicesData, bookingsData] = await Promise.all([
        fetchInvoices(token),
        fetchServices(token),
        fetchBookings(token),
      ]);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form (unchanged)
  const resetForm = () => {
    setFormData({
      title: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      invoiceDate: '',
      dueDate: '',
      status: 'draft',
      currency: 'USD',
      templateChoice: 'quotation_1',
      notes: '',
      receipt: false,
    });
    setItems([
      { service_id: '', quantity: 1, tax_rate: 0, discount: 0, unit_price: 0, description: '', measurement: '' },
    ]);
    setEditingInvoice(null);
  };

  // ---- handlers for invoice form (unchanged) ----
  const handleEdit = (invoice: Invoice) => {
    // ... (existing code, omitted for brevity; keep as is)
    // It's the same as the original – no changes needed.
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // ... (unchanged)
  };
  const handleItemChange = (idx: number, field: string, value: any) => {
    // ... (unchanged)
  };
  const handleAddItem = () => {
    // ... (unchanged)
  };
  const handleRemoveItem = (idx: number) => {
    // ... (unchanged)
  };
  const handleSubmit = async (e: React.FormEvent) => {
    // ... (unchanged)
  };

  // ---- Booking actions ----
  const mapBookingToInvoicePayload = (booking: any) => {
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 30);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    return {
      title: `Invoice for ${booking.customer_name}`,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email || 'customer@example.com',
      customer_phone: booking.phone || '',
      issue_date: formatDate(now),
      due_date: formatDate(dueDate),
      status: 'draft',
      currency: 'GBP', // or use a default from tenant
      template_choice: 'quotation_1',
      notes: `Booking #${booking.id}\n${booking.notes || ''}`,
      receipt: false,
      items: [
        {
          description: `Cleaning service – Booking #${booking.id}`,
          quantity: 1,
          unit_price: Number(booking.total),
          tax_rate: 0,
          discount: 0,
          measurement: '',
        },
      ],
    };
  };

  const handleCreateInvoiceFromBooking = async (booking: any) => {
    const bookingId = booking.id;
    setBookingActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      const token = await getToken();
      const payload = mapBookingToInvoicePayload(booking);
      const newInvoice = await createInvoice(token, payload);
      // store mapping so we can show download/email buttons
      setBookingInvoiceMap(prev => ({ ...prev, [bookingId]: newInvoice.id }));
      // refresh the list so the new invoice appears in the invoices table
      await loadData();
      alert(`Invoice #${newInvoice.id} created successfully!`);
    } catch (err) {
      console.error('Failed to create invoice from booking', err);
      alert('Error creating invoice. Please try again.');
    } finally {
      setBookingActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleDownloadFromBooking = (bookingId: number, invoiceId: number) => {
    getToken().then(token => downloadInvoicePdf(invoiceId, token));
  };

  const handleEmailFromBooking = async (bookingId: number, invoiceId: number) => {
    const token = await getToken();
    try {
      await emailInvoice(invoiceId, token);
      alert('Invoice emailed successfully');
    } catch (err) {
      console.error('Failed to email invoice', err);
      alert('Error sending email. Please try again.');
    }
  };

  // ---- render helpers ----
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices & Billing</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* ---- Invoice Form (unchanged) ---- */}
      {showForm && (
        // ... keep the existing form UI exactly as before (omitted for brevity)
        // It should be identical to the original code – we don't need to touch it.
        <div></div>
      )}

      {/* ---- Bookings Section ---- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Bookings (Ready to Invoice)</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map(booking => {
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
                        {invoiceId ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 mr-1">Inv #{invoiceId}</span>
                            <button
                              onClick={() => handleDownloadFromBooking(booking.id, invoiceId)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded"
                            >
                              <Download size={16} /> PDF
                            </button>
                            <button
                              onClick={() => handleEmailFromBooking(booking.id, invoiceId)}
                              className="text-purple-600 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1 rounded"
                            >
                              <Mail size={16} /> Email
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCreateInvoiceFromBooking(booking)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded disabled:opacity-50"
                          >
                            {isLoading ? 'Creating...' : <FileText size={16} />}
                            {isLoading ? 'Creating...' : 'Create Invoice'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Invoices Table (unchanged) ---- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No invoices yet. Click "New Invoice" to create one.
                  </td>
                </tr>
              ) : (
                invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inv.invoice_number}</div>
                      {inv.title && <div className="text-xs text-gray-500">{inv.title}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inv.customer_name}</div>
                      <div className="text-sm text-gray-500">{inv.contacts?.['Contact Info']?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {inv.currency === 'EUR' ? '€' : inv.currency === 'GBP' ? '£' : '$'}
                      {inv.expense?.total_amount || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inv.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {inv.status === 'paid' ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => getToken().then(t => downloadInvoicePdf(inv.id, t))}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded"
                      >
                        <Download size={16} /> PDF
                      </button>
                      <button
                        onClick={async () => {
                          const token = await getToken();
                          try {
                            await emailInvoice(inv.id, token);
                            alert('Invoice emailed successfully');
                          } catch (err) {
                            console.error(err);
                            alert('Error sending email. Please try again.');
                          }
                        }}
                        className="text-purple-600 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1 rounded"
                      >
                        <Mail size={16} /> Email
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
