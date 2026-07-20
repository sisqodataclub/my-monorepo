// apps/dashboards/src/pages/InvoicesPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, type Variants } from 'framer-motion';
import { Plus, Download, Edit, Mail, X, FileText, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
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
import BookingsTable from '../components/BookingsTable';

const API_BASE = import.meta.env.VITE_API_URL || 'https://core.franciscodes.com';
const TENANT = 'DDEEP';

type SortDirection = 'asc' | 'desc';

const getHeaders = async (token: string | null) => ({
  Authorization: `Bearer ${token}`,
  'X-Tenant': TENANT,
});

const fetchBookings = async (token: string | null): Promise<any[]> => {
  const headers = await getHeaders(token);
  try {
    const res = await axios.get(`${API_BASE}/api/cleaning-bookings/`, { headers });
    if (res.data?.results && Array.isArray(res.data.results)) return res.data.results;
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
};

// Helper for sorting/pagination (unchanged)
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
function sortData<T>(data: T[], field: string, direction: SortDirection): T[] {
  if (!field) return data;
  const sorted = [...data].sort((a, b) => {
    const aVal = getValueByPath(a, field) ?? '';
    const bVal = getValueByPath(b, field) ?? '';
    return aVal < bVal ? (direction === 'asc' ? -1 : 1) : aVal > bVal ? (direction === 'asc' ? 1 : -1) : 0;
  });
  return sorted;
}
function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------
export default function InvoicesPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Booking table state
  const [showBookings, setShowBookings] = useState(false);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingPageSize, setBookingPageSize] = useState(10);
  const [bookingSortField, setBookingSortField] = useState<string>('id');
  const [bookingSortOrder, setBookingSortOrder] = useState<SortDirection>('desc');
  const [bookingInvoiceMap, setBookingInvoiceMap] = useState<Record<number, number>>({});
  const [bookingActionLoading, setBookingActionLoading] = useState<Record<number, boolean>>({});

  // Invoice table state
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoicePageSize, setInvoicePageSize] = useState(10);
  const [invoiceSortField, setInvoiceSortField] = useState<string>('invoice_number');
  const [invoiceSortOrder, setInvoiceSortOrder] = useState<SortDirection>('desc');

  // Booking CRUD modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    customer_email: '',
    phone: '',
    total: '',
    status: 'pending',
    payment_method: 'cash',
  });
  const [bookingModalLoading, setBookingModalLoading] = useState(false);

  // Booking Invoice modal (unchanged)
  const [showBookingInvoiceModal, setShowBookingInvoiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingInvoiceForm, setBookingInvoiceForm] = useState({
    invoiceDate: '',
    dueDate: '',
    status: 'draft',
    adjustToBookingTotal: true,
  });

  // Form state for manual invoice creation (unchanged)
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

  // --- CRUD for bookings ---
  const createBooking = async (data: any) => {
    const token = await getToken();
    const headers = await getHeaders(token);
    const payload = {
      ...data,
      total: parseFloat(data.total) || 0,
      // Default required fields
      selected_areas: [],
      quantities: {},
      carpets: {},
      appliances: {},
      property_details: {},
      selected_datetime: {},
    };
    const res = await axios.post(`${API_BASE}/api/cleaning-bookings/`, payload, { headers });
    return res.data;
  };

  const updateBooking = async (id: number, data: any) => {
    const token = await getToken();
    const headers = await getHeaders(token);
    const payload = { ...data, total: parseFloat(data.total) || 0 };
    const res = await axios.patch(`${API_BASE}/api/cleaning-bookings/${id}/`, payload, { headers });
    return res.data;
  };

  const deleteBooking = async (id: number) => {
    const token = await getToken();
    const headers = await getHeaders(token);
    await axios.delete(`${API_BASE}/api/cleaning-bookings/${id}/`, { headers });
  };

  // --- Handlers for booking actions ---
  const handleEditBooking = (booking: any) => {
    setEditingBooking(booking);
    setBookingForm({
      customer_name: booking.customer_name || '',
      customer_email: booking.customer_email || '',
      phone: booking.phone || '',
      total: booking.total || '',
      status: booking.status || 'pending',
      payment_method: booking.payment_method || 'cash',
    });
    setShowBookingModal(true);
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    try {
      await deleteBooking(bookingId);
      await loadData();
      alert('Booking deleted successfully.');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete booking.');
    }
  };

  const handleBookingModalSubmit = async () => {
    setBookingModalLoading(true);
    try {
      const data = { ...bookingForm };
      if (editingBooking) {
        await updateBooking(editingBooking.id, data);
      } else {
        await createBooking(data);
      }
      setShowBookingModal(false);
      setEditingBooking(null);
      setBookingForm({ customer_name: '', customer_email: '', phone: '', total: '', status: 'pending', payment_method: 'cash' });
      await loadData();
      alert(editingBooking ? 'Booking updated!' : 'Booking created!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save booking.');
    } finally {
      setBookingModalLoading(false);
    }
  };

  const handleBookingModalClose = () => {
    setShowBookingModal(false);
    setEditingBooking(null);
    setBookingForm({ customer_name: '', customer_email: '', phone: '', total: '', status: 'pending', payment_method: 'cash' });
  };

  // --- Invoice handlers (unchanged) ---
  const resetForm = () => { /* ... unchanged ... */ };
  const handleEdit = (invoice: Invoice) => { /* ... unchanged ... */ };
  const handleInputChange = (e: any) => { /* ... unchanged ... */ };
  const handleItemChange = (idx: number, field: string, value: any) => { /* ... unchanged ... */ };
  const handleAddItem = () => { /* ... unchanged ... */ };
  const handleRemoveItem = (idx: number) => { /* ... unchanged ... */ };
  const handleSubmit = async (e: React.FormEvent) => { /* ... unchanged ... */ };

  // --- Booking invoice modal (unchanged) ---
  const openBookingInvoiceModal = (booking: any) => { /* ... unchanged ... */ };
  const closeBookingInvoiceModal = () => { /* ... unchanged ... */ };
  const buildBookingInvoicePayload = (booking: any, servicesList: Service[], form: typeof bookingInvoiceForm) => { /* ... unchanged ... */ };
  const handleCreateInvoiceFromBooking = async () => { /* ... unchanged ... */ };
  const handleDownloadFromBooking = (invoiceId: number) => { /* ... unchanged ... */ };
  const handleEmailFromBooking = async (invoiceId: number) => { /* ... unchanged ... */ };

  // --- Computed data for tables ---
  const sortedBookings = useMemo(() => sortData(bookings, bookingSortField, bookingSortOrder), [bookings, bookingSortField, bookingSortOrder]);
  const paginatedBookings = useMemo(() => paginateData(sortedBookings, bookingPage, bookingPageSize), [sortedBookings, bookingPage, bookingPageSize]);
  const totalBookingPages = Math.max(1, Math.ceil(bookings.length / bookingPageSize));

  const sortedInvoices = useMemo(() => sortData(invoices, invoiceSortField, invoiceSortOrder), [invoices, invoiceSortField, invoiceSortOrder]);
  const paginatedInvoices = useMemo(() => paginateData(sortedInvoices, invoicePage, invoicePageSize), [sortedInvoices, invoicePage, invoicePageSize]);
  const totalInvoicePages = Math.max(1, Math.ceil(invoices.length / invoicePageSize));

  const handleBookingSort = (field: string) => {
    if (bookingSortField === field) setBookingSortOrder(bookingSortOrder === 'asc' ? 'desc' : 'asc');
    else { setBookingSortField(field); setBookingSortOrder('asc'); }
    setBookingPage(1);
  };

  const handleInvoiceSort = (field: string) => {
    if (invoiceSortField === field) setInvoiceSortOrder(invoiceSortOrder === 'asc' ? 'desc' : 'asc');
    else { setInvoiceSortField(field); setInvoiceSortOrder('asc'); }
    setInvoicePage(1);
  };

  const computeVariance = () => { /* ... unchanged ... */ };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices & Billing</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* ---- Manual Invoice Form (unchanged) ---- */}
      {showForm && ( /* ... same as before ... */ )}

      {/* ---- Bookings Section ---- */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowBookings(!showBookings)}
            className="flex items-center gap-2 text-xl font-semibold hover:text-blue-600 transition-colors"
          >
            {showBookings ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span>Bookings (Ready to Invoice)</span>
            <span className="text-sm font-normal text-gray-500 ml-2">({bookings.length})</span>
          </button>
          <button
            onClick={() => { setEditingBooking(null); setBookingForm({ customer_name: '', customer_email: '', phone: '', total: '', status: 'pending', payment_method: 'cash' }); setShowBookingModal(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
          >
            <Plus size={16} /> New Booking
          </button>
        </div>

        <BookingsTable
          bookings={paginatedBookings}
          loading={loading}
          show={showBookings}
          onToggle={() => setShowBookings(!showBookings)}
          page={bookingPage}
          pageSize={bookingPageSize}
          totalPages={totalBookingPages}
          onPageChange={setBookingPage}
          onPageSizeChange={(size) => { setBookingPageSize(size); setBookingPage(1); }}
          sortField={bookingSortField}
          sortOrder={bookingSortOrder}
          onSort={handleBookingSort}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
          onCreateInvoice={openBookingInvoiceModal}
          onDownloadPdf={handleDownloadFromBooking}
          onEmailInvoice={handleEmailFromBooking}
          bookingInvoiceMap={bookingInvoiceMap}
          bookingActionLoading={bookingActionLoading}
        />
      </div>

      {/* ---- Booking CRUD Modal ---- */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingBooking ? 'Edit Booking' : 'New Booking'}</h2>
              <button onClick={handleBookingModalClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={bookingForm.customer_name}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={bookingForm.customer_email}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bookingForm.total}
                  onChange={(e) => setBookingForm({ ...bookingForm, total: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={bookingForm.status}
                  onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={bookingForm.payment_method}
                  onChange={(e) => setBookingForm({ ...bookingForm, payment_method: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <button
                onClick={handleBookingModalSubmit}
                disabled={bookingModalLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
              >
                {bookingModalLoading ? 'Saving...' : (editingBooking ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Booking Invoice Modal (unchanged) ---- */}
      {showBookingInvoiceModal && selectedBooking && ( /* ... same as before ... */ )}

      {/* ---- Invoices Table ---- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          {/* ... invoice table (unchanged) ... */}
        </motion.div>
      </div>
    </div>
  );
}
