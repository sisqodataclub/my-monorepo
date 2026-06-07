import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  duration_minutes?: number;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_rate?: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  title?: string;
  status: string;
  currency?: string;
  invoice_date: string;       // renamed from issue_date
  due_date: string;
  total_amount: number;
  customer_name: string;      // direct field on invoice
  contacts?: {                // JSON field storing email and phone
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  created_at: string;
  // optional fields
  receipt?: boolean;
  notes?: string;
  template_choice?: string;
  category?: any;
}

const getValidToken = (token: string | null): string => {
  if (!token) throw new Error('No authentication token available');
  return token;
};

export const fetchServices = async (token: string | null): Promise<Service[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/services/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const fetchInvoices = async (token: string | null): Promise<Invoice[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/invoices/`, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  // Ensure we return an array (backend may return object on error)
  return Array.isArray(res.data) ? res.data : [];
};

export const createInvoice = async (
  token: string | null,
  data: {
    customer_email: string;
    customer_name?: string;
    customer_phone?: string;
    title?: string;
    status?: string;
    currency?: string;
    template_choice?: string;
    notes?: string;
    invoice_date?: string;    // renamed from issue_date
    due_date?: string;
    receipt?: boolean;
    items: Array<{
      service_id?: number | string;
      description?: string;
      quantity: number;
      unit_price?: number;
      tax_rate?: number;
      discount?: number;
    }>;
  }
): Promise<Invoice> => {
  const res = await axios.post(`${API_BASE}/api/payments/invoices/create_with_items/`, data, {
    headers: { Authorization: `Bearer ${getValidToken(token)}` }
  });
  return res.data;
};

export const downloadInvoicePdf = (invoiceId: number, token: string | null) => {
  const url = `${API_BASE}/api/payments/invoices/${invoiceId}/pdf/`;
  fetch(url, { headers: { Authorization: `Bearer ${getValidToken(token)}` } })
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error('PDF download failed:', err));
};
