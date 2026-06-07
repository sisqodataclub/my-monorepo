import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, type Variants } from 'framer-motion';
import { Plus, Download, X } from 'lucide-react';
import type { Service, Invoice } from '../api/invoiceApi';
import { fetchServices, fetchInvoices, createInvoice, downloadInvoicePdf } from '../api/invoiceApi';

export default function InvoicesPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state – using backend field names
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    invoiceDate: '',   // was issueDate
    dueDate: '',
    status: 'draft',
    currency: 'USD',
    templateChoice: 'quotation_1',
    notes: '',
    receipt: false,    // new boolean field
  });

  const [items, setItems] = useState([{ service_id: '', quantity: 1, tax_rate: 0, discount: 0, unit_price: 0, description: '' }]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const token = await getToken();
    try {
      const [invoicesData, servicesData] = await Promise.all([
        fetchInvoices(token),
        fetchServices(token)
      ]);
      // Ensure arrays
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (err) {
      console.error('Failed to load invoices/services', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    if (field === 'service_id' && value !== '') {
      const svc = services.find(s => s.id.toString() === value);
      if (svc) {
        newItems[idx].unit_price = svc.price;
        newItems[idx].description = svc.name;
      }
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { service_id: '', quantity: 1, tax_rate: 0, discount: 0, unit_price: 0, description: '' }]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();

    const payload = {
      title: formData.title,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      invoice_date: formData.invoiceDate || undefined,   // renamed from issue_date
      due_date: formData.dueDate || undefined,
      status: formData.status,
      currency: formData.currency,
      template_choice: formData.templateChoice,
      notes: formData.notes,
      receipt: formData.receipt,
      items: items.map(item => ({
        service_id: item.service_id ? parseInt(item.service_id) : undefined,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount: item.discount
      }))
    };

    try {
      await createInvoice(token, payload);
      setShowCreateForm(false);
      // Reset form
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
      setItems([{ service_id: '', quantity: 1, tax_rate: 0, discount: 0, unit_price: 0, description: '' }]);
      await loadData();
    } catch (err) {
      console.error('Failed to create invoice', err);
      alert('Error creating invoice. Please check the console.');
    }
  };

  const handleDownload = (invoiceId: number) => {
    getToken().then(token => downloadInvoicePdf(invoiceId, token));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading invoices...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices & Billing</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? <X size={18} /> : <Plus size={18} />}
          {showCreateForm ? 'Cancel Creation' : 'New Invoice'}
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Invoice Configuration</h2>

          <form onSubmit={handleCreateInvoice} className="space-y-8">
            {/* Basic Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="title" placeholder="Invoice Title" value={formData.title} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full" />
                <input type="text" name="customerName" placeholder="Customer Name *" value={formData.customerName} onChange={handleInputChange} required className="border border-gray-300 rounded-lg px-4 py-2 w-full" />
                <input type="email" name="customerEmail" placeholder="Customer Email *" value={formData.customerEmail} onChange={handleInputChange} required className="border border-gray-300 rounded-lg px-4 py-2 w-full" />
                <input type="tel" name="customerPhone" placeholder="Customer Phone" value={formData.customerPhone} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full" />

                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Invoice Date</label>
                  <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white">
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

            {/* Design & Formatting */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Design & Formatting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white">
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Template Choice</label>
                  <select name="templateChoice" value={formData.templateChoice} onChange={handleInputChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white">
                    <option value="quotation_1">Standard Invoice 1</option>
                    <option value="quotation_2">Modern Invoice 2</option>
                    <option value="receipt1">Basic Receipt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Line Items (unchanged) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Line Items</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {items.map((item, idx) => (
                  <div key={idx} className="flex flex-wrap gap-3 items-end pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Service / Description</label>
                      <select
                        value={item.service_id}
                        onChange={e => handleItemChange(idx, 'service_id', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white mb-2"
                      >
                        <option value="">Custom Manual Item...</option>
                        {services.map(s => (<option key={s.id} value={s.id}>{s.name} (${s.price})</option>))}
                      </select>
                      {!item.service_id && (
                        <input
                          type="text"
                          placeholder="Custom item description"
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      )}
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Unit Price</label>
                      <input type="number" step="0.01" value={item.unit_price} onChange={e => handleItemChange(idx, 'unit_price', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2" disabled={!!item.service_id} />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Qty</label>
                      <input type="number" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value))} min="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Tax %</label>
                      <input type="number" step="0.1" value={item.tax_rate} onChange={e => handleItemChange(idx, 'tax_rate', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Discnt %</label>
                      <input type="number" step="0.1" value={item.discount} onChange={e => handleItemChange(idx, 'discount', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 font-bold mb-2 ml-2 hover:text-red-700">X</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-blue-600 font-medium text-sm mt-2 hover:underline">+ Add Row</button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional Notes</h3>
              <textarea name="notes" placeholder="Terms & Conditions, Payment details, etc." value={formData.notes} onChange={handleInputChange} rows={3} className="border border-gray-300 rounded-lg px-4 py-2 w-full"></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">Generate Invoice</button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
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
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices yet. Click "New Invoice" to create one.</td>
              </tr>
            ) : (
              invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{inv.invoice_number}</div>
                    {inv.title && <div className="text-xs text-gray-500">{inv.title}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inv.customer_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{inv.contacts?.email || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {inv.currency === 'EUR' ? '€' : inv.currency === 'GBP' ? '£' : '$'}{inv.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {inv.status === 'paid' ? 'PAID' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownload(inv.id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded transition-colors hover:bg-blue-100"
                    >
                      <Download size={16} /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
