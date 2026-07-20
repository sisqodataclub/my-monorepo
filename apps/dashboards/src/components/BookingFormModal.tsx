// src/components/BookingFormModal.tsx
import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface Service {
  id: number;
  name: string;
  price: string | number;
}

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  services: Service[];
  loading?: boolean;
  apiBase: string;
  tenant: string;
}

interface ServiceSelection {
  service_id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function BookingFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  services,
  loading: externalLoading = false,
  apiBase,
  tenant,
}: BookingFormModalProps) {
  const { getToken } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [status, setStatus] = useState('pending');
  const [furnishedStatus, setFurnishedStatus] = useState('');
  const [parking, setParking] = useState('');
  const [biohazard, setBiohazard] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [total, setTotal] = useState(0);
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customer_name || '');
      setCustomerEmail(initialData.customer_email || '');
      setPhone(initialData.phone || '');
      setPaymentMethod(initialData.payment_method || 'cash');
      setStatus(initialData.status || 'pending');
      setFurnishedStatus(initialData.furnished_status || '');
      setParking(initialData.parking || '');
      setBiohazard(initialData.biohazard || '');
      setDiscountCode('');

      const quantities = initialData.quantities || {};
      const serviceIds = Object.keys(quantities)
        .filter(k => !isNaN(Number(k)))
        .map(Number);
      const initialSelections: ServiceSelection[] = serviceIds
        .map(id => {
          const svc = services.find(s => s.id === id);
          if (!svc) return null;
          return {
            service_id: id,
            name: svc.name,
            quantity: Number(quantities[id]) || 1,
            price: Number(svc.price) || 0,
          };
        })
        .filter(Boolean) as ServiceSelection[];
      setSelectedServices(initialSelections);
      setTotal(Number(initialData.total) || 0);
    } else {
      resetForm();
    }
  }, [initialData, services]);

  const resetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setPhone('');
    setPaymentMethod('cash');
    setStatus('pending');
    setFurnishedStatus('');
    setParking('');
    setBiohazard('');
    setDiscountCode('');
    setSelectedServices([]);
    setTotal(0);
  };

  const addService = (service: Service) => {
    const existing = selectedServices.find(s => s.service_id === service.id);
    if (existing) {
      setSelectedServices(prev =>
        prev.map(s =>
          s.service_id === service.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      );
    } else {
      setSelectedServices(prev => [
        ...prev,
        {
          service_id: service.id,
          name: service.name,
          quantity: 1,
          price: Number(service.price) || 0,
        },
      ]);
    }
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(prev => prev.filter(s => s.service_id !== serviceId));
  };

  const updateQuantity = (serviceId: number, newQty: number) => {
    if (newQty <= 0) {
      removeService(serviceId);
      return;
    }
    setSelectedServices(prev =>
      prev.map(s =>
        s.service_id === serviceId ? { ...s, quantity: newQty } : s
      )
    );
  };

  const calculateQuote = async () => {
    if (selectedServices.length === 0) {
      setTotal(0);
      return;
    }
    const token = await getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'X-Tenant': tenant,
    };
    const items = selectedServices.map(s => ({
      service_id: s.service_id,
      quantity: s.quantity,
    }));
    const payload = {
      items,
      furnished_status: furnishedStatus || undefined,
      biohazard: biohazard || undefined,
      discount_code: discountCode || undefined,
    };
    setQuoteLoading(true);
    try {
      const res = await axios.post(`${apiBase}/api/services/calculate_quote/`, payload, { headers });
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Quote calculation failed:', err);
      alert('Failed to calculate total.');
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    calculateQuote();
  }, [selectedServices, furnishedStatus, biohazard, discountCode]);

  const handleSubmit = async () => {
    // ✅ Validation: name and email are required
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Customer Name and Email are required.');
      return;
    }

    // Build quantities
    const quantities: Record<string, number> = {};
    selectedServices.forEach(s => {
      quantities[s.service_id] = s.quantity;
    });

    // Build selected_areas (strings and IDs)
    const selectedAreas: (string | number)[] = selectedServices.map(s => s.name);
    selectedServices.forEach(s => {
      selectedAreas.push(s.service_id);
    });

    // ✅ Generate a unique session_id for new bookings
    const sessionId = initialData?.session_id || (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + '-' + Math.random().toString(36).substring(2));

    // ✅ Use the exact field names expected by the backend
    const payload = {
      session_id: sessionId,
      name: customerName.trim(),          // 👈 backend expects 'name'
      email: customerEmail.trim(),        // 👈 backend expects 'email'
      phone: phone || '',
      payment_method: paymentMethod,
      status,
      furnished_status: furnishedStatus,
      parking,
      biohazard,
      total,
      quantities,
      selected_areas: selectedAreas,
      property_details: {},
      selected_datetime: {},
    };

    await onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Booking' : 'New Booking'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Furnished Status</label>
              <select
                value={furnishedStatus}
                onChange={(e) => setFurnishedStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Unfurnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parking</label>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">None</option>
                <option value="on-street-paid">On‑street Paid</option>
                <option value="on-street-free">On‑street Free</option>
                <option value="off-street">Off‑street</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Biohazard</label>
              <select
                value={biohazard}
                onChange={(e) => setBiohazard(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">None</option>
                <option value="yes-human">Human</option>
                <option value="yes-animal">Animal</option>
                <option value="yes-blood">Blood</option>
              </select>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => addService(svc)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <Plus size={14} />
                  {svc.name}
                </button>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div className="space-y-2 border rounded-lg p-3">
                {selectedServices.map((item) => (
                  <div key={item.service_id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.service_id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.service_id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeService(item.service_id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Code</label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              £{total.toFixed(2)}
              {quoteLoading && <span className="ml-2 text-sm text-gray-500">(calculating...)</span>}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={externalLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {externalLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
