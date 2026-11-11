// src/pages/QuoteCheckout.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import GlassLayout from "../components/ui/GlassLayout";
import BookingDatePicker from "../components/ui/BookingDatePicker";
import TimeSlotSelector from "../components/ui/TimeSlotSelector";
import BookingSuccessModal from "../components/BookingSuccessModal";

export default function QuoteCheckout() {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quote_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalVariant, setModalVariant] = useState("default");
  const [quoteData, setQuoteData] = useState(null);

  const [bookingDate, setBookingDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [partiallyBlockedSlots, setPartiallyBlockedSlots] = useState({});
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!quoteId) {
      setError("No quote ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const quoteRes = await api.get(`/api/cleaning-bookings/${quoteId}/`);
        const data = quoteRes.data;

        if (!data || typeof data !== "object") {
          setError("Could not load your quote. Please try again.");
          setLoading(false);
          return;
        }

        setQuoteData(data);
        setBookingDate(data.selected_datetime?.booking_date || "");
        setTimeslot(data.selected_datetime?.timeslot || "");
        setPaymentMethod(data.payment_method || "");
        setAddress(data.property_details?.address || "");
        setPostcode(data.property_details?.postcode || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error(err);
        const status = err.response?.status;
        if (status === 404) {
          setError("This quote could not be found. Please request a new quote.");
        } else {
          setError("Could not load your quote. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Best-effort: fetch blocked dates/slots
      try {
        const [blockedRes, partialRes] = await Promise.all([
          api.get("/api/blocked-dates/"),
          api.get("/api/partially-blocked-slots/"),
        ]);
        setBlockedDates(blockedRes.data || []);
        setPartiallyBlockedSlots(partialRes.data || {});
      } catch (err) {
        console.warn("Could not load blocked dates:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [quoteId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!bookingDate || !timeslot || !paymentMethod || !address || !postcode || !phone) {
      setError("Please fill in all required fields to confirm your booking.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.patch(`/api/cleaning-bookings/${quoteId}/`, {
        status: "confirmed",
        booking_date: bookingDate,
        timeslot,
        payment_method: paymentMethod,
        property_details: { address, postcode },
        phone,
      });

      setModalVariant("default");
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not confirm your booking. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white text-lg">Loading your quote…</p>
        </div>
      </GlassLayout>
    );
  }

  if (error && !quoteData) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-white text-lg">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </GlassLayout>
    );
  }

  // 🚀 INTERCEPT: If the booking is already confirmed, skip the form entirely.
  if (quoteData && quoteData.status === "confirmed") {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20 max-w-lg w-full text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Booking Already Confirmed</h2>
            <p className="text-gray-200 mb-8 text-lg leading-relaxed">
              This booking is already secured. Please check your email for the booking details and receipt.
            </p>
            
            <div className="bg-black/20 rounded-xl p-6 text-left mb-8 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Need help or need to make changes?</h3>
              <div className="space-y-3 text-gray-300">
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-gray-400 min-w-[120px]">Email:</span>
                  <a href="mailto:clean@ddeepcleaningservices.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    clean@ddeepcleaningservices.com
                  </a>
                </p>
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-gray-400 min-w-[120px]">Call / WhatsApp:</span>
                  <a href="tel:07459416262" className="text-blue-400 hover:text-blue-300 transition-colors">
                    07459 416262
                  </a>
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-[#915EFF] hover:bg-[#7c4dff] text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </GlassLayout>
    );
  }

  // Safely parse the total directly from the database response
  const displayTotal = parseFloat(quoteData?.total) || 0;

  return (
    <GlassLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold text-white mb-6">Complete Your Booking</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Form Inputs */}
          <div className="space-y-4">
            <BookingDatePicker
              value={bookingDate}
              onChange={setBookingDate}
              blockedDates={blockedDates}
            />
            <TimeSlotSelector
              value={timeslot}
              onChange={setTimeslot}
              date={bookingDate}
              partiallyBlockedSlots={partiallyBlockedSlots}
            />
            <div>
              <label className="block text-white mb-1">Payment Method *</label>
              <select
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              >
                <option value="" className="text-black">Select…</option>
                <option value="card" className="text-black">Card</option>
                <option value="cash" className="text-black">Cash</option>
                <option value="bank_transfer" className="text-black">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-1">Address *</label>
              <input
                required
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Postcode *</label>
              <input
                required
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-white mb-1">Phone *</label>
              <input
                id="phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
          </div>

          {/* Right Column: Clean Checkout Card */}
          <div className="flex flex-col h-full">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20 flex flex-col h-full shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6">Booking Overview</h2>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-300 text-lg">Total Amount</span>
                <span className="text-3xl font-bold text-white">
                  £{displayTotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={submitting || displayTotal === 0}
                  className="w-full py-4 bg-[#915EFF] hover:bg-[#7c4dff] text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? "Confirming Booking…" : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Fresh confirmations still trigger the modal */}
      {showSuccess && (
        <BookingSuccessModal
          variant={modalVariant}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </GlassLayout>
  );
}1~// src/pages/QuoteCheckout.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import GlassLayout from "../components/ui/GlassLayout";
import BookingDatePicker from "../components/ui/BookingDatePicker";
import TimeSlotSelector from "../components/ui/TimeSlotSelector";
import BookingSuccessModal from "../components/BookingSuccessModal";

export default function QuoteCheckout() {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quote_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalVariant, setModalVariant] = useState("default");
  const [quoteData, setQuoteData] = useState(null);

  const [bookingDate, setBookingDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [partiallyBlockedSlots, setPartiallyBlockedSlots] = useState({});
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!quoteId) {
      setError("No quote ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const quoteRes = await api.get(`/api/cleaning-bookings/${quoteId}/`);
        const data = quoteRes.data;

        if (!data || typeof data !== "object") {
          setError("Could not load your quote. Please try again.");
          setLoading(false);
          return;
        }

        setQuoteData(data);
        setBookingDate(data.selected_datetime?.booking_date || "");
        setTimeslot(data.selected_datetime?.timeslot || "");
        setPaymentMethod(data.payment_method || "");
        setAddress(data.property_details?.address || "");
        setPostcode(data.property_details?.postcode || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error(err);
        const status = err.response?.status;
        if (status === 404) {
          setError("This quote could not be found. Please request a new quote.");
        } else {
          setError("Could not load your quote. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Best-effort: fetch blocked dates/slots
      try {
        const [blockedRes, partialRes] = await Promise.all([
          api.get("/api/blocked-dates/"),
          api.get("/api/partially-blocked-slots/"),
        ]);
        setBlockedDates(blockedRes.data || []);
        setPartiallyBlockedSlots(partialRes.data || {});
      } catch (err) {
        console.warn("Could not load blocked dates:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [quoteId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!bookingDate || !timeslot || !paymentMethod || !address || !postcode || !phone) {
      setError("Please fill in all required fields to confirm your booking.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.patch(`/api/cleaning-bookings/${quoteId}/`, {
        status: "confirmed",
        booking_date: bookingDate,
        timeslot,
        payment_method: paymentMethod,
        property_details: { address, postcode },
        phone,
      });

      setModalVariant("default");
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not confirm your booking. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white text-lg">Loading your quote…</p>
        </div>
      </GlassLayout>
    );
  }

  if (error && !quoteData) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-white text-lg">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </GlassLayout>
    );
  }

  // 🚀 INTERCEPT: If the booking is already confirmed, skip the form entirely.
  if (quoteData && quoteData.status === "confirmed") {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20 max-w-lg w-full text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Booking Already Confirmed</h2>
            <p className="text-gray-200 mb-8 text-lg leading-relaxed">
              This booking is already secured. Please check your email for the booking details and receipt.
            </p>
            
            <div className="bg-black/20 rounded-xl p-6 text-left mb-8 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Need help or need to make changes?</h3>
              <div className="space-y-3 text-gray-300">
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-gray-400 min-w-[120px]">Email:</span>
                  <a href="mailto:clean@ddeepcleaningservices.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    clean@ddeepcleaningservices.com
                  </a>
                </p>
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-gray-400 min-w-[120px]">Call / WhatsApp:</span>
                  <a href="tel:07459416262" className="text-blue-400 hover:text-blue-300 transition-colors">
                    07459 416262
                  </a>
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-[#915EFF] hover:bg-[#7c4dff] text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </GlassLayout>
    );
  }

  // Safely parse the total directly from the database response
  const displayTotal = parseFloat(quoteData?.total) || 0;

  return (
    <GlassLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold text-white mb-6">Complete Your Booking</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Form Inputs */}
          <div className="space-y-4">
            <BookingDatePicker
              value={bookingDate}
              onChange={setBookingDate}
              blockedDates={blockedDates}
            />
            <TimeSlotSelector
              value={timeslot}
              onChange={setTimeslot}
              date={bookingDate}
              partiallyBlockedSlots={partiallyBlockedSlots}
            />
            <div>
              <label className="block text-white mb-1">Payment Method *</label>
              <select
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              >
                <option value="" className="text-black">Select…</option>
                <option value="card" className="text-black">Card</option>
                <option value="cash" className="text-black">Cash</option>
                <option value="bank_transfer" className="text-black">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-1">Address *</label>
              <input
                required
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Postcode *</label>
              <input
                required
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-white mb-1">Phone *</label>
              <input
                id="phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
          </div>

          {/* Right Column: Clean Checkout Card */}
          <div className="flex flex-col h-full">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20 flex flex-col h-full shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6">Booking Overview</h2>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-300 text-lg">Total Amount</span>
                <span className="text-3xl font-bold text-white">
                  £{displayTotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={submitting || displayTotal === 0}
                  className="w-full py-4 bg-[#915EFF] hover:bg-[#7c4dff] text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? "Confirming Booking…" : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Fresh confirmations still trigger the modal */}
      {showSuccess && (
        <BookingSuccessModal
          variant={modalVariant}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </GlassLayout>
  );
}
