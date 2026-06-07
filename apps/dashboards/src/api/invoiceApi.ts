import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  customer_detail: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  created_at: string;
}

// Helper to ensure token is string (not null)
const getValidToken = (token: string | null): string => {
  if (!token) throw new Error('No authentication token available');
  return token;
};

export const fetchServices = async (token: string | null): Promise<Service[]> => {
  const validToken = getValidToken(token);
  const res = await axios.get(`${API_BASE}/api/payments/services/`, {
    headers: { Authorization: `Bearer ${validToken}` }
  });
  return res.data;
};

export const fetchInvoices = async (token: string | null): Promise<Invoice[]> => {
  const validToken = getValidToken(token);
  const res = await axios.get(`${API_BASE}/api/payments/invoices/`, {
    headers: { Authorization: `Bearer ${validToken}` }
  });
  return res.data;
};

export const createInvoice = async (
  token: string | null,
  data: {
    customer_email: string;
    customer_name?: string;
    issue_date?: string;
    due_date?: string;
    items: Array<{
      service_id?: number;
      description?: string;
      quantity: number;
      unit_price?: number;
      tax_rate?: number;
    }>;
  }
): Promise<Invoice> => {
  const validToken = getValidToken(token);
  const res = await axios.post(`${API_BASE}/api/payments/invoices/create_with_items/`, data, {
    headers: { Authorization: `Bearer ${validToken}` }
  });
  return res.data;
};

export const downloadInvoicePdf = (invoiceId: number, token: string | null) => {
  const validToken = getValidToken(token);
  const url = `${API_BASE}/api/payments/invoices/${invoiceId}/pdf/`;
  // Use fetch with token to open in new tab (or window.open with Bearer is not supported, so we use a blob approach)
  // Simplified: open in new tab with token in URL? No, better to use fetch and create blob URL.
  // For simplicity, we'll use fetch and create a blob URL.
  fetch(url, {
    headers: { Authorization: `Bearer ${validToken}` }
  })
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error('PDF download failed:', err));
};
