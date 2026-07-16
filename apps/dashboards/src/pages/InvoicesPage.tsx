import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, type Variants } from 'framer-motion';
import { Plus, Download, Edit, Mail, X, FileText, ChevronDown, ChevronRight } from 'lucide-react';
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

const API_BASE = import.meta.env.VITE_API_URL || 'https://core.franciscodes.com';

const fetchBookings = async (token: string | null): Promise<any[]> => {
  const headers: any = { Authorization: `Bearer ${token}` };
  try {
    const res = await axios.get(`${API_BASE}/api/cleaning-bookings/`, { headers });
    if (res.data && res.data.results && Array.isArray(res.data.results)) {
      return res.data.results;
    }
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Failed to fetch bookings', err);
    return [];
  }
};

export default function InvoicesPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [bookingInvoiceMap, setBookingInvoiceMap] = useState<Record<number, number>>({});
  const [bookingActionLoading, setBookingActionLoading] = useState<Record<number, boolean>>({});
  const [showBookings, setShowBookings] = useState(false);

  // Modal state for creating invoice from booking
  const [showBookingInvoiceModal, setShowBookingInvoiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingInvoiceForm, setBookingInvoiceForm] = useState({
    invoiceDate: '',
    dueDate: '',
    status: 'draft',
    adjustToBookingTotal: true,
  });

  // Form state for manual invoice creation
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

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    let noteContent = '';
    if (invoice.notes && Array.isArray(invoice.notes) && invoice.notes.length > 0) {
      noteContent = invoice.notes[0].content || '';
    }
    setFormData({
      title: invoice.title || '',
      customerName: invoice.customer_name,
      customerEmail: invoice.contacts?.['Contact Info']?.email || '',
      customerPhone: invoice.contacts?.['Contact Info']?.phone || '',
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date,
      status: invoice.status,
      currency: invoice.currency || 'USD',
      templateChoice: invoice.template_choice || 'quotation_1',
      notes: noteContent,
      receipt: invoice.receipt || false,
    });
    setItems(
      invoice.items.map((item) => ({
        service_id: '',
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: 0,
        discount: 0,
        measurement: item.measurement || '',
      }))
    );
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    if (field === 'service_id' && value !== '') {
      const svc = services.find((s) => s.id.toString() === value);
      if (svc) {
        newItems[idx].unit_price = svc.price;
        newItems[idx].description = svc.name;
      }
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { service_id: '', quantity: 1, tax_rate: 0, discount: 0, unit_price: 0, description: '', measurement: '' }]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    const payload = {
      title: formData.title,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      issue_date: formData.invoiceDate || undefined,
      due_date: formData.dueDate || undefined,
      status: formData.status,
      currency: formData.currency,
      template_choice: formData.templateChoice,
      notes: formData.notes,
      receipt: formData.receipt,
      items: items.map((item) => ({
        service_id: item.service_id ? parseInt(item.service_id) : undefined,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount: item.discount,
        measurement: item.measurement,
      })),
    };
    try {
      if (editingInvoice) {
        await updateInvoice(token, editingInvoice.id, payload);
      } else {
        await createInvoice(token, payload);
      }
      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      console.error('Failed to save invoice', err);
      alert('Error saving invoice. Please check the console.');
    }
  };

  // ---- Booking invoice modal ----
  const openBookingInvoiceModal = (booking: any) => {
    setSelectedBooking(booking);
    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 30);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    setBookingInvoiceForm({
      invoiceDate: formatDate(now),
      dueDate: formatDate(due),
      status: 'draft',
      adjustToBookingTotal: true,
    });
    setShowBookingInvoiceModal(true);
  };

  const closeBookingInvoiceModal = () => {
    setShowBookingInvoiceModal(false);
    setSelectedBooking(null);
  };

  // Build invoice payload from booking with user‑selected options
  const buildBookingInvoicePayload = (booking: any, servicesList: Service[], form: typeof bookingInvoiceForm) => {
    const invoiceItems: any[] = [];
    const quantities = booking.quantities || {};

    // 1. Build list of service items from quantities
    const allItems: { id: number; name: string; qty: number; price: number }[] = [];
    Object.entries(quantities).forEach(([key, qty]) => {
      const qtyNum = Number(qty);
      if (qtyNum <= 0) return;
      const serviceId = Number(key);
      if (isNaN(serviceId)) return;
      const service = servicesList.find(s => s.id === serviceId);
      if (!service) return;
      allItems.push({
        id: serviceId,
        name: service.name,
        qty: qtyNum,
        price: Number(service.price) || 0,
      });
    });

    // 2. Exclude base areas if variations exist
    const baseNamesWithVariation = new Set<string>();
    allItems.forEach(item => {
      if (item.name.includes('_')) {
        const base = item.name.split('_')[0];
        baseNamesWithVariation.add(base);
      }
    });
    const filteredItems = allItems.filter(item => {
      if (item.name.includes('_')) return true;
      return !baseNamesWithVariation.has(item.name);
    });

    // 3. Convert to invoice line items
    filteredItems.forEach(item => {
      invoiceItems.push({
        description: item.name,
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    });

    // 4. Add main service from selected_areas (if it's a string and not already included)
    const mainServiceName = booking.selected_areas?.find((item: any) => typeof item === 'string');
    if (mainServiceName) {
      const alreadyExists = filteredItems.some(item => item.name === mainServiceName);
      if (!alreadyExists) {
        const mainService = servicesList.find(s => s.name === mainServiceName);
        if (mainService && Number(mainService.price) > 0) {
          invoiceItems.push({
            description: mainServiceName,
            quantity: 1,
            unit_price: Number(mainService.price),
            total_price: Number(mainService.price),
            tax_rate: 0,
            discount: 0,
            measurement: '',
          });
        }
      }
    }

    // 5. Add fees
    if (booking.furnished_status === 'furnished') {
      invoiceItems.push({
        description: 'Furnished Property Fee',
        quantity: 1,
        unit_price: 10,
        total_price: 10,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    }
    if (booking.biohazard === 'yes-human') {
      invoiceItems.push({
        description: 'Biohazard (Human)',
        quantity: 1,
        unit_price: 25,
        total_price: 25,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    } else if (booking.biohazard === 'yes-animal') {
      invoiceItems.push({
        description: 'Biohazard (Animal)',
        quantity: 1,
        unit_price: 15,
        total_price: 15,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    } else if (booking.biohazard === 'yes-blood') {
      invoiceItems.push({
        description: 'Biohazard (Blood)',
        quantity: 1,
        unit_price: 40,
        total_price: 40,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    }
    const discountAmount = Number(booking.discount) || 0;
    if (discountAmount > 0) {
      invoiceItems.push({
        description: 'Discount',
        quantity: 1,
        unit_price: -discountAmount,
        total_price: -discountAmount,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    }

    // 6. Compute sum and variance
    const sum = invoiceItems.reduce((acc, item) => acc + item.total_price, 0);
    const bookingTotal = Number(booking.total) || 0;
    const diff = bookingTotal - sum;
    const variance = Math.abs(diff);

    // 7. If user wants to match booking total and variance > 0.01, add adjustment
    if (form.adjustToBookingTotal && variance > 0.01) {
      invoiceItems.push({
        description: 'Adjustment to match booking total',
        quantity: 1,
        unit_price: diff,
        total_price: diff,
        tax_rate: 0,
        discount: 0,
        measurement: '',
      });
    }

    return {
      title: `Invoice for ${booking.customer_name}`,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email || 'customer@example.com',
      customer_phone: booking.phone || '',
      issue_date: form.invoiceDate,
      due_date: form.dueDate,
      status: form.status,
      currency: 'GBP',
      template_choice: 'quotation_1',
      notes: `Booking #${booking.id}\n${booking.notes || ''}`,
      receipt: false,
      items: invoiceItems,
    };
  };

  const handleCreateInvoiceFromBooking = async () => {
    if (!selectedBooking) return;
    const bookingId = selectedBooking.id;
    setBookingActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      const token = await getToken();
      const payload = buildBookingInvoicePayload(selectedBooking, services, bookingInvoiceForm);
      const newInvoice = await createInvoice(token, payload);
      setBookingInvoiceMap((prev) => ({ ...prev, [bookingId]: newInvoice.id }));
      await loadData();
      alert(`Invoice #${newInvoice.id} created successfully!`);
      closeBookingInvoiceModal();
    } catch (err) {
      console.error('Failed to create invoice from booking', err);
      alert('Error creating invoice. Please try again.');
    } finally {
      setBookingActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleDownloadFromBooking = (invoiceId: number) => {
    getToken().then((token) => downloadInvoicePdf(invoiceId, token));
  };

  const handleEmailFromBooking = async (invoiceId: number) => {
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

  // Compute variance for the modal
  const computeVariance = () => {
    if (!selectedBooking) return { sum: 0, bookingTotal: 0, diff: 0, variance: 0 };
    const tempItems: any[] = [];
    const quantities = selectedBooking.quantities || {};
    const allItems: { id: number; name: string; qty: number; price: number }[] = [];
    Object.entries(quantities).forEach(([key, qty]) => {
      const qtyNum = Number(qty);
      if (qtyNum <= 0) return;
      const serviceId = Number(key);
      if (isNaN(serviceId)) return;
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      allItems.push({
        id: serviceId,
        name: service.name,
        qty: qtyNum,
        price: Number(service.price) || 0,
      });
    });
    const baseNamesWithVariation = new Set<string>();
    allItems.forEach(item => {
      if (item.name.includes('_')) {
        const base = item.name.split('_')[0];
        baseNamesWithVariation.add(base);
      }
    });
    const filtered = allItems.filter(item => {
      if (item.name.includes('_')) return true;
      return !baseNamesWithVariation.has(item.name);
    });
    filtered.forEach(item => {
      tempItems.push({ total_price: item.price * item.qty });
    });
    // Add fees
    let fees = 0;
    if (selectedBooking.furnished_status === 'furnished') fees += 10;
    if (selectedBooking.biohazard === 'yes-human') fees += 25;
    else if (selectedBooking.biohazard === 'yes-animal') fees += 15;
    else if (selectedBooking.biohazard === 'yes-blood') fees += 40;
    const discount = Number(selectedBooking.discount) || 0;
    const sum = tempItems.reduce((acc, item) => acc + item.total_price, 0) + fees - discount;
    const bookingTotal = Number(selectedBooking.total) || 0;
    const diff = bookingTotal - sum;
    return { sum, bookingTotal, diff, variance: Math.abs(diff) };
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

      {/* ---- Manual Invoice Form ---- */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingInvoice ? 'Edit Invoice' : 'Invoice Configuration'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="title" placeholder="Invoice Title" value={formData.title} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full" />
                <input name="customerName" placeholder="Customer Name *" value={formData.customerName} onChange={handleInputChange} required className="border rounded-lg px-4 py-2 w-full" />
                <input type="email" name="customerEmail" placeholder="Customer Email *" value={formData.customerEmail} onChange={handleInputChange} required className="border rounded-lg px-4 py-2 w-full" />
                <input name="customerPhone" placeholder="Customer Phone" value={formData.customerPhone} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full" />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Invoice Date</label>
                  <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full bg-white">
                    <option value="draft">Draft (Unpaid)</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="receipt" checked={formData.receipt} onChange={handleInputChange} className="mr-2" />
                  <label className="text-sm">This is a receipt (not an invoice)</label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Design & Formatting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full bg-white">
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Template Choice</label>
                  <select name="templateChoice" value={formData.templateChoice} onChange={handleInputChange} className="border rounded-lg px-4 py-2 w-full bg-white">
                    <option value="quotation_1">Standard Invoice 1</option>
                    <option value="quotation_2">Modern Invoice 2</option>
                    <option value="receipt1">Basic Receipt</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Line Items</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
                {items.map((item, idx) => (
                  <div key={idx} className="flex flex-wrap gap-3 items-end pb-3 border-b last:border-0">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs text-gray-500 mb-1">Service / Description</label>
                      <select value={item.service_id} onChange={(e) => handleItemChange(idx, 'service_id', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-white mb-2">
                        <option value="">Custom Manual Item...</option>
                        {services.map((s) => (<option key={s.id} value={s.id}>{s.name} (${s.price})</option>))}
                      </select>
                      {!item.service_id && (
                        <input type="text" placeholder="Custom description" value={item.description} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                      )}
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
                      <input type="number" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(idx, 'unit_price', parseFloat(e.target.value))} className="w-full border rounded-lg px-3 py-2" disabled={!!item.service_id} />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-gray-500 mb-1">Qty</label>
                      <input type="number" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value))} min="1" className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-gray-500 mb-1">Unit</label>
                      <input type="text" placeholder="measure" value={item.measurement} onChange={(e) => handleItemChange(idx, 'measurement', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">Tax %</label>
                      <input type="number" step="0.1" value={item.tax_rate} onChange={(e) => handleItemChange(idx, 'tax_rate', parseFloat(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">Disc %</label>
                      <input type="number" step="0.1" value={item.discount} onChange={(e) => handleItemChange(idx, 'discount', parseFloat(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 font-bold mb-2 hover:text-red-700">X</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-blue-600 font-medium text-sm mt-2 hover:underline">+ Add Row</button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional Notes</h3>
              <textarea name="notes" placeholder="Terms & Conditions, Payment details, etc." value={formData.notes} onChange={handleInputChange} rows={3} className="border rounded-lg px-4 py-2 w-full" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md">
                {editingInvoice ? 'Update Invoice' : 'Generate Invoice'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ---- Bookings Section ---- */}
      <div className="mt-10">
        <button
          onClick={() => setShowBookings(!showBookings)}
          className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-blue-600 transition-colors"
        >
          {showBookings ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span>Bookings (Ready to Invoice)</span>
          <span className="text-sm font-normal text-gray-500 ml-2">({bookings.length})</span>
        </button>

        {showBookings && (
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
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No bookings found.</td></tr>
                ) : (
                  bookings.map((booking) => {
                    const invoiceId = bookingInvoiceMap[booking.id];
                    const isLoading = bookingActionLoading[booking.id] || false;
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.customer_name}</div>
                          <div className="text-sm text-gray-500">{booking.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">£{Number(booking.total).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {invoiceId ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-500 mr-1">Inv #{invoiceId}</span>
                              <button onClick={() => handleDownloadFromBooking(invoiceId)} className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded">
                                <Download size={16} /> PDF
                              </button>
                              <button onClick={() => handleEmailFromBooking(invoiceId)} className="text-purple-600 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1 rounded">
                                <Mail size={16} /> Email
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => openBookingInvoiceModal(booking)} disabled={isLoading} className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded disabled:opacity-50">
                              {isLoading ? 'Loading...' : <FileText size={16} />}
                              {isLoading ? 'Loading...' : 'Create Invoice'}
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
        )}
      </div>

      {/* ---- Booking Invoice Modal with variance detection ---- */}
      {showBookingInvoiceModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Invoice from Booking #{selectedBooking.id}</h2>
              <button onClick={closeBookingInvoiceModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={bookingInvoiceForm.invoiceDate}
                  onChange={(e) => setBookingInvoiceForm({ ...bookingInvoiceForm, invoiceDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={bookingInvoiceForm.dueDate}
                  onChange={(e) => setBookingInvoiceForm({ ...bookingInvoiceForm, dueDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={bookingInvoiceForm.status}
                  onChange={(e) => setBookingInvoiceForm({ ...bookingInvoiceForm, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="draft">Draft (Unpaid)</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Variance warning */}
              {(() => {
                const { sum, bookingTotal, diff, variance } = computeVariance();
                if (variance > 0.01) {
                  return (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 font-medium">Variance Detected</p>
                      <p className="text-sm text-yellow-700">
                        Calculated sum: £{sum.toFixed(2)}<br />
                        Booking total: £{bookingTotal.toFixed(2)}<br />
                        Difference: £{diff.toFixed(2)}
                      </p>
                      <div className="mt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={bookingInvoiceForm.adjustToBookingTotal}
                            onChange={(e) => setBookingInvoiceForm({ ...bookingInvoiceForm, adjustToBookingTotal: e.target.checked })}
                            className="accent-blue-600"
                          />
                          Add adjustment line to match booking total
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {bookingInvoiceForm.adjustToBookingTotal
                            ? 'An adjustment line will be added to force the invoice total to match the booking total.'
                            : 'The invoice total will be the sum of calculated line items (may not match booking total).'}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600 font-medium">Booking Summary</p>
                <p className="text-sm text-gray-500">Customer: {selectedBooking.customer_name}</p>
                <p className="text-sm text-gray-500">Total: £{Number(selectedBooking.total).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Services: {Object.keys(selectedBooking.quantities || {}).length} items</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={closeBookingInvoiceModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleCreateInvoiceFromBooking} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={bookingActionLoading[selectedBooking.id]}>
                  {bookingActionLoading[selectedBooking.id] ? 'Creating...' : 'Generate Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Invoices Table ---- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices yet. Click "New Invoice" to create one.</td></tr>
              ) : (
                invoices.map((inv) => (
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
                      {inv.currency === 'EUR' ? '€' : inv.currency === 'GBP' ? '£' : '$'}{inv.expense?.total_amount || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {inv.status === 'paid' ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 flex-wrap">
                      <button onClick={() => handleEdit(inv)} className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => getToken().then((t) => downloadInvoicePdf(inv.id, t))} className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded">
                        <Download size={16} /> PDF
                      </button>
                      <button onClick={async () => {
                        const token = await getToken();
                        try {
                          await emailInvoice(inv.id, token);
                          alert('Invoice emailed successfully');
                        } catch (err) {
                          console.error(err);
                          alert('Error sending email. Please try again.');
                        }
                      }} className="text-purple-600 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1 rounded">
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
