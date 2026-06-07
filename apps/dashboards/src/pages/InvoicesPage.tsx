import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, type Variants } from 'framer-motion';
import { Plus, Download } from 'lucide-react';
import type { Service, Invoice } from '../api/invoiceApi';
import { fetchServices, fetchInvoices, createInvoice, downloadInvoicePdf } from '../api/invoiceApi';

export default function InvoicesPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ service_id: '', quantity: 1, tax_rate: 0 }]);

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
      setInvoices(invoicesData);
      setServices(servicesData);
    } catch (err) {
      console.error('Failed to load invoices/services', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { service_id: '', quantity: 1, tax_rate: 0 }]);
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    const payload = {
      customer_email: customerEmail,
      customer_name: customerName,
      items: items.map(item => ({
        service_id: item.service_id ? parseInt(item.service_id) : undefined,
        quantity: item.quantity,
        tax_rate: item.tax_rate
      }))
    };
    try {
      await createInvoice(token, payload);
      setShowCreateForm(false);
      setCustomerEmail('');
      setCustomerName('');
      setItems([{ service_id: '', quantity: 1, tax_rate: 0 }]);
      await loadData();
    } catch (err) {
      console.error('Failed to create invoice', err);
      alert('Error creating invoice');
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
          <form onSubmit={handleCreateInvoice}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Customer Email *"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Invoice Items</h3>
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-wrap gap-3 mb-3 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <select
                      value={item.service_id}
                      onChange={e => handleItemChange(idx, 'service_id', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required={idx === 0}
                    >
                      <option value="">Select a service</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Tax %"
                      value={item.tax_rate}
                      onChange={e => handleItemChange(idx, 'tax_rate', parseFloat(e.target.value))}
                      step="0.1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddItem} className="text-blue-600 text-sm mt-2">
                + Add another item
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Create Invoice</button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices yet. Click "New Invoice" to create one.</td>
              </tr>
            ) : (
              invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inv.customer_detail?.name || inv.customer_detail?.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${inv.total_amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      inv.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(inv.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDownload(inv.id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
