import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Download, Trash2, Edit2, X, Filter, Upload, FileSpreadsheet, Search } from 'lucide-react';
import type { Invoice, Customer, Category, Service, InvoiceItem } from '../api/invoiceApi';
import {
  fetchInvoices, deleteInvoice, downloadInvoicePdf, fetchCustomers, fetchCategories,
  fetchServices, createInvoice, updateInvoice, createInvoiceFromServices
} from '../api/invoiceApi';

// ========== Zod Schema for the Mega Form ==========
const invoiceItemSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1, 'Description required'),
  quantity: z.number().min(1),
  measurement_unit: z.string().optional(),
  unit_price: z.number().min(0),
  tax_rate: z.number().min(0).max(100).default(0),
  discount_rate: z.number().min(0).max(100).default(0),
});

const invoiceSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  tracking_code: z.string().optional(),
  customer: z.number({ required_error: 'Customer is required' }),
  category: z.number().nullable().optional(),
  issue_date: z.string(),
  due_date: z.string().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  is_receipt: z.boolean().default(false),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  logo: z.any().optional(),
  signature: z.any().optional(),
  stamp: z.any().optional(),
  template_choice: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item required'),
  tax_percentage: z.number().min(0).max(100).default(0),
  discount_percentage: z.number().min(0).max(100).default(0),
  concession_percentage: z.number().min(0).max(100).default(0),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function InvoicesPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ status: '', date_range: '', search: '' });

  // Form handling
  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: 'draft',
      is_receipt: false,
      currency: 'USD',
      items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount_rate: 0 }],
      tax_percentage: 0,
      discount_percentage: 0,
      concession_percentage: 0,
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const loadData = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    try {
      const [inv, cust, cat, serv] = await Promise.all([
        fetchInvoices(token, filters),
        fetchCustomers(token),
        fetchCategories(token),
        fetchServices(token),
      ]);
      setInvoices(inv);
      setCustomers(cust);
      setCategories(cat);
      setServices(serv);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const onSubmit = async (data: InvoiceFormData) => {
    const token = await getToken();
    try {
      if (editingId) {
        await updateInvoice(token, editingId, data);
      } else {
        await createInvoice(token, data);
      }
      setShowForm(false);
      setEditingId(null);
      reset();
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save invoice');
    }
  };

  const handleEdit = async (invoice: Invoice) => {
    setEditingId(invoice.id);
    reset({
      title: invoice.title,
      slug: invoice.slug,
      tracking_code: invoice.tracking_code,
      customer: invoice.customer,
      category: invoice.category?.id,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      status: invoice.status,
      is_receipt: invoice.is_receipt,
      currency: invoice.currency,
      notes: invoice.notes,
      template_choice: invoice.template_choice,
      items: invoice.items.map(i => ({
        id: i.id,
        description: i.description,
        quantity: i.quantity,
        measurement_unit: i.measurement_unit,
        unit_price: i.unit_price,
        tax_rate: i.tax_rate,
        discount_rate: i.discount_rate || 0,
      })),
      tax_percentage: 0,
      discount_percentage: 0,
      concession_percentage: 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this invoice?')) {
      const token = await getToken();
      await deleteInvoice(token, id);
      await loadData();
    }
  };

  const handleQuickCreateFromService = async () => {
    // Simplified version: just prompt for email and pick a service
    const email = prompt('Customer email:');
    if (!email) return;
    const serviceId = prompt('Service ID (from list):');
    if (!serviceId) return;
    const token = await getToken();
    try {
      await createInvoiceFromServices(token, {
        customer_email: email,
        items: [{ service_id: parseInt(serviceId), quantity: 1 }]
      });
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to create invoice');
    }
  };

  const totalAmount = watch('items').reduce((sum, item, idx) => {
    const qty = item.quantity || 0;
    const price = item.unit_price || 0;
    const tax = (item.tax_rate || 0) / 100;
    const disc = (item.discount_rate || 0) / 100;
    return sum + qty * price * (1 + tax) * (1 - disc);
  }, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex gap-2">
          <button onClick={() => alert('Import CSV')} className="border px-3 py-1 rounded flex items-center gap-1"><Upload size={16} /> Import</button>
          <button onClick={() => alert('Export CSV')} className="border px-3 py-1 rounded flex items-center gap-1"><FileSpreadsheet size={16} /> Export</button>
          <button onClick={handleQuickCreateFromService} className="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1"><Plus size={16} /> Quick (Service)</button>
          <button onClick={() => { setEditingId(null); reset(); setShowForm(true); }} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"><Plus size={16} /> New Invoice</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="border rounded px-3 py-1">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={filters.date_range} onChange={e => setFilters({ ...filters, date_range: e.target.value })} className="border rounded px-3 py-1">
          <option value="">Any date</option>
          <option value="today">Today</option>
          <option value="week">Past 7 days</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by invoice #, customer..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} className="border rounded pl-8 pr-3 py-1 w-full" />
        </div>
        <button onClick={loadData} className="bg-gray-200 px-3 py-1 rounded">Apply Filters</button>
      </div>

      {/* Invoice List Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Invoice #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>}
            {!loading && invoices.length === 0 && <tr><td colSpan={6} className="text-center py-8">No invoices found</td></tr>}
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{inv.invoice_number}</td>
                <td className="px-4 py-3 text-sm">{inv.customer_detail?.name || inv.customer_detail?.email}</td>
                <td className="px-4 py-3 text-sm">${inv.total_amount}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : inv.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{inv.status}</span>
                </td>
                <td className="px-4 py-3 text-sm">{new Date(inv.issue_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button onClick={() => handleEdit(inv)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(inv.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  <button onClick={() => downloadInvoicePdf(inv.id, getToken())} className="text-gray-600 hover:text-gray-800"><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mega Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Invoice' : 'New Invoice'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-gray-100"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium">Title</label><input {...register('title')} className="border rounded w-full p-2" /></div>
                  <div><label className="block text-sm font-medium">Slug</label><input {...register('slug')} className="border rounded w-full p-2" /></div>
                  <div><label className="block text-sm font-medium">Tracking Code</label><input {...register('tracking_code')} className="border rounded w-full p-2" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium">Customer *</label><Controller control={control} name="customer" render={({ field }) => (<select {...field} className="border rounded w-full p-2"><option value="">Select customer</option>{customers.map(c => (<option key={c.id} value={c.id}>{c.name} ({c.email})</option>))}</select>)} /></div>
                  <div><label className="block text-sm font-medium">Category</label><Controller control={control} name="category" render={({ field }) => (<select {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)} className="border rounded w-full p-2"><option value="">None</option>{categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select>)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium">Issue Date</label><input type="date" {...register('issue_date')} className="border rounded w-full p-2" /></div>
                  <div><label className="block text-sm font-medium">Due Date</label><input type="date" {...register('due_date')} className="border rounded w-full p-2" /></div>
                  <div><label className="block text-sm font-medium">Status</label><select {...register('status')} className="border rounded w-full p-2"><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option></select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium flex items-center gap-2"><input type="checkbox" {...register('is_receipt')} className="mr-1" /> Is Receipt</label></div>
                  <div><label className="block text-sm font-medium">Currency</label><input {...register('currency')} className="border rounded w-full p-2" /></div>
                </div>
                <div><label className="block text-sm font-medium">Notes</label><textarea {...register('notes')} rows={2} className="border rounded w-full p-2" /></div>

                {/* Design Elements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium">Logo</label><input type="file" accept="image/*" onChange={e => setValue('logo', e.target.files?.[0])} className="border rounded w-full p-1" /></div>
                  <div><label className="block text-sm font-medium">Signature</label><input type="file" accept="image/*" onChange={e => setValue('signature', e.target.files?.[0])} className="border rounded w-full p-1" /></div>
                  <div><label className="block text-sm font-medium">Stamp</label><input type="file" accept="image/*" onChange={e => setValue('stamp', e.target.files?.[0])} className="border rounded w-full p-1" /></div>
                  <div className="md:col-span-3"><label className="block text-sm font-medium">Template Choice</label><input {...register('template_choice')} className="border rounded w-full p-2" placeholder="e.g. quotation_4, receipt1" /></div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 className="font-bold mb-2">Items</h3>
                  <table className="w-full border">
                    <thead className="bg-gray-50"><tr><th className="p-2 text-left">Description</th><th className="p-2">Qty</th><th className="p-2">Unit</th><th className="p-2">Unit Price</th><th className="p-2">Tax %</th><th className="p-2">Discount %</th><th className="p-2">Total</th><th className="p-2"></th></tr></thead>
                    <tbody>
                      {fields.map((field, idx) => (
                        <tr key={field.id}>
                          <td className="p-2"><input {...register(`items.${idx}.description`)} className="border rounded w-full p-1" /></td>
                          <td className="p-2"><input type="number" {...register(`items.${idx}.quantity`, { valueAsNumber: true })} className="border rounded w-20 p-1" /></td>
                          <td className="p-2"><input {...register(`items.${idx}.measurement_unit`)} className="border rounded w-20 p-1" placeholder="unit" /></td>
                          <td className="p-2"><input type="number" step="0.01" {...register(`items.${idx}.unit_price`, { valueAsNumber: true })} className="border rounded w-24 p-1" /></td>
                          <td className="p-2"><input type="number" step="0.1" {...register(`items.${idx}.tax_rate`, { valueAsNumber: true })} className="border rounded w-20 p-1" /></td>
                          <td className="p-2"><input type="number" step="0.1" {...register(`items.${idx}.discount_rate`, { valueAsNumber: true })} className="border rounded w-20 p-1" /></td>
                          <td className="p-2 text-right">
                            {((watch(`items.${idx}.quantity`) || 0) * (watch(`items.${idx}.unit_price`) || 0) * (1 + (watch(`items.${idx}.tax_rate`) || 0)/100) * (1 - (watch(`items.${idx}.discount_rate`) || 0)/100)).toFixed(2)}
                          </td>
                          <td className="p-2"><button type="button" onClick={() => remove(idx)} className="text-red-500"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" onClick={() => append({ description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount_rate: 0 })} className="mt-2 text-blue-600 text-sm flex items-center gap-1"><Plus size={16} /> Add item</button>
                </div>

                {/* Global Tax/Discount */}
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm">Tax % (global)</label><input type="number" step="0.1" {...register('tax_percentage', { valueAsNumber: true })} className="border rounded w-full p-2" /></div>
                  <div><label className="block text-sm">Discount % (global)</label><input type="number" step="0.1" {...register('discount_percentage', { valueAsNumber: true })} className="border rounded w-full p-2" /></div>
                  <div><label className="block text-sm">Concession %</label><input type="number" step="0.1" {...register('concession_percentage', { valueAsNumber: true })} className="border rounded w-full p-2" /></div>
                </div>
                <div className="text-right text-xl font-bold">Total: ${totalAmount.toFixed(2)}</div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50">Save Invoice</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
