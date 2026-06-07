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

export const fetchServices = async (token: string): Promise<Service[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/services/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchInvoices = async (token: string): Promise<Invoice[]> => {
  const res = await axios.get(`${API_BASE}/api/payments/invoices/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createInvoice = async (token: string, data: {
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
}): Promise<Invoice> => {
  const res = await axios.post(`${API_BASE}/api/payments/invoices/create_with_items/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const downloadInvoicePdf = (invoiceId: number, token: string) => {
  const url = `${API_BASE}/api/payments/invoices/${invoiceId}/pdf/`;
  // Open in new tab – works if the endpoint sets Content-Disposition
  window.open(url, '_blank');
};
