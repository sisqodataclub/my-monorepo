import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';

// ============================================================================
// Types
// ============================================================================

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
  measurement: string;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  title?: string;
  status: string;
  currency?: string;
  invoice_date: string;
  due_date: string;
  customer_name: string;
  contacts?: {
    'Contact Info'?: { email?: string; phone?: string };
  };
  expense?: {
    subtotal: number;
    total_amount: number;
    tax_amount: number;
    discount_amount: number;
    tax_percentage?: number;
    discount_percentage?: number;
    concession_percentage?: number;
    concession_amount?: number;
  };
  items: InvoiceItem[];
  created_at: string;
  notes?: any;
  receipt?: boolean;
  template_choice?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const getValidToken = (token: string | null): string => {
  if (!token) throw new Error('No authentication token available');
  return token;
};

const getTenantHeader = (): string | null => {
  return 'DDEEP'; // Change to your tenant identifier or null if not used
};

// ============================================================================
// API Calls
// ============================================================================

export const fetchServices = async (token: string | null): Promise<Service[]> => {
  const headers: any = { Authorization: `Bearer ${getValidToken(token)}` };
  const tenant = getTenantHeader();
  if (tenant) headers['X-Tenant'] = tenant;

  const res = await axios.get(`${API_BASE}/api/payments/services/`, { headers });
  return res.data;
};

export const fetchInvoices = async (token: string | null): Promise<Invoice[]> => {
  const headers: any = { Authorization: `Bearer ${getValidToken(token)}` };
  const tenant = getTenantHeader();
  if (tenant) headers['X-Tenant'] = tenant;

  const res = await axios.get(`${API_BASE}/api/payments/invoices/`, { headers });
  if (res.data && res.data.results && Array.isArray(res.data.results)) {
    return res.data.results;
  }
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
    issue_date?: string;
    due_date?: string;
    receipt?: boolean;
    items: Array<{
      service_id?: number | string;
      description?: string;
      quantity: number;
      unit_price?: number;
      tax_rate?: number;
      discount?: number;
      measurement?: string;
    }>;
  }
): Promise<Invoice> => {
  const headers: any = { Authorization: `Bearer ${getValidToken(token)}` };
  const tenant = getTenantHeader();
  if (tenant) headers['X-Tenant'] = tenant;

  const res = await axios.post(`${API_BASE}/api/payments/invoices/create_with_items/`, data, { headers });
  return res.data;
};

export const updateInvoice = async (
  token: string | null,
  id: number,
  data: Parameters<typeof createInvoice>[1]
): Promise<Invoice> => {
  const headers: any = { Authorization: `Bearer ${getValidToken(token)}` };
  const tenant = getTenantHeader();
  if (tenant) headers['X-Tenant'] = tenant;

  const res = await axios.put(`${API_BASE}/api/payments/invoices/${id}/edit/`, data, { headers });
  return res.data;
};

export const downloadInvoicePdf = (invoiceId: number, token: string | null) => {
  const headers: any = { Authorization: `Bearer ${getValidToken(token)}` };
  const tenant = getTenantHeader();
  if (tenant) headers['X-Tenant'] = tenant;

  const url = `${API_BASE}/api/payments/invoices/${invoiceId}/pdf/`;
  fetch(url, { headers })
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error('PDF download failed:', err));
};

// ========== NEW: Email Invoice ==========
export const emailInvoice = async (invoiceId: number, token: string | null): Promise<void> => {
  const headers: any = { Authorization: `Bearer ${getValidToken(token)}` };
  const tenant = getTenantHeader();
  if (tenant) headers['X-Tenant'] = tenant;

  await axios.post(`${API_BASE}/api/payments/invoices/${invoiceId}/email/`, {}, { headers });
};
