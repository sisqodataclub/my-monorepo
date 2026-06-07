import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

// ========== Types ==========
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  measurement_unit?: string;
  unit_price: number;
  tax_rate: number;
  discount_rate?: number;
  total?: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  title?: string;
  slug?: string;
  tracking_code?: string;
  issue_date: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  is_receipt: boolean;
  currency: string;
  total_amount: number;
  category?: Category;
  notes?: string;
  logo?: string;        // URL
  signature?: string;   // URL
  stamp?: string;       // URL
  template_choice?: string;
  customer: number;
  customer_detail: Customer;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

// Helper for token
const getValidToken = (token: string | null): string => {
  if (!token) throw new Error('No authentication token');
  return token;
};

// ========== API Calls ==========
export const fetchCategories = async (token: string | null): Promise<Category[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/categories/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const fetchCustomers = async (token: string | null): Promise<Customer[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/customers/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const fetchServices = async (token: string | null): Promise<Service[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/services/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const fetchInvoices = async (
  token: string | null,
  params?: { status?: string; date_range?: string; search?: string }
): Promise<Invoice[]> => {
  const query = new URLSearchParams(params as any).toString();
  const url = `${API_BASE}/api/payments/invoices/${query ? `?${query}` : ''}`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const getInvoice = async (token: string | null, id: number): Promise<Invoice> => {
  const res = await axios.get(`${API_BASE}/api/payments/invoices/${id}/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const createInvoice = async (token: string | null, data: Partial<Invoice>): Promise<Invoice> => {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'items') {
      formData.append('items', JSON.stringify(data.items));
    } else if (key === 'logo' || key === 'signature' || key === 'stamp') {
      if (data[key] instanceof File) formData.append(key, data[key]);
    } else if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  }
  const res = await axios.post(`${API_BASE}/api/payments/invoices/`, formData, {
    headers: {
      Authorization: `Bearer ${getValidToken(token)}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const updateInvoice = async (token: string | null, id: number, data: Partial<Invoice>): Promise<Invoice> => {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'items') {
      formData.append('items', JSON.stringify(data.items));
    } else if (key === 'logo' || key === 'signature' || key === 'stamp') {
      if (data[key] instanceof File) formData.append(key, data[key]);
    } else if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  }
  const res = await axios.put(`${API_BASE}/api/payments/invoices/${id}/`, formData, {
    headers: {
      Authorization: `Bearer ${getValidToken(token)}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteInvoice = async (token: string | null, id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/api/payments/invoices/${id}/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
};

export const downloadInvoicePdf = (invoiceId: number, token: string | null) => {
  const url = `${API_BASE}/api/payments/invoices/${invoiceId}/pdf/`;
  fetch(url, { headers: { Authorization: `Bearer ${getValidToken(token)}` } })
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error('PDF download failed:', err));
};

// Simplified creation from services (kept for compatibility)
export const createInvoiceFromServices = async (
  token: string | null,
  data: {
    customer_email: string;
    customer_name?: string;
    issue_date?: string;
    due_date?: string;
    items: Array<{ service_id?: number; quantity: number; tax_rate?: number; description?: string; unit_price?: number }>;
  }
): Promise<Invoice> => {
  const res = await axios.post(`${API_BASE}/api/payments/invoices/create_with_items/`, data, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};
