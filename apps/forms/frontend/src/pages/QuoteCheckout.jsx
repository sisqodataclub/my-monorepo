// src/pages/QuoteCheckout.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import GlassLayout from "../components/ui/GlassLayout";
import BookingDatePicker from "../components/ui/BookingDatePicker";
import TimeSlotSelector from "../components/ui/TimeSlotSelector";
import ReviewSummary from "../components/ReviewSummary";
import BookingSuccessModal from "../components/BookingSuccessModal";

const SIZED_AREAS = ["Kitchen", "Bedroom"];

export default function QuoteCheckout() {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quote_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [partiallyBlockedSlots, setPartiallyBlockedSlots] = useState({});

  useEffect(() => {
    if (!quoteId) {
      setError("No quote ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [quoteRes, timesRes] = await Promise.all([
          api.get(`/api/cleaning-bookings/${quoteId}/`),
          api.get("/api/blocked-times/"),
        ]);
        const data = quoteRes.data;
        setQuoteData(data);
        setBookingDate(data.selected_datetime?.booking_date || "");
        setTimeslot(data.selected_datetime?.timeslot || "");
        setPaymentMethod(data.payment_method || "");
        setBlockedDates(timesRes.data.fully_blocked_dates || []);
        setPartiallyBlockedSlots(timesRes.data.partially_blocked_slots || {});
      } catch (err) {
        console.error(err);
        setError("Could not load your quote. It may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quoteId]);

  const handleConfirm = async () => {
    if (!bookingDate || !timeslot || !paymentMethod) {
      setError("Please select a date, time, and payment method.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        payment_method: paymentMethod,
        selected_datetime: { booking_date: bookingDate, timeslot: timeslot },
        status: "confirmed",
      };
      const res = await api.patch(`/api/cleaning-bookings/${quoteId}/`, payload);
      if (res.data.paymentlink) {
        window.location.href = res.data.paymentlink;
        return;
      }
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-pulse text-xl">Loading your quote...</div>
      </div>
    );
  }

  if (error && !quoteData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-xl text-center max-w-md">
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const disabledSlotsForDate = bookingDate ? (partiallyBlockedSlots[bookingDate] || []) : [];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Finalize Your Booking
          </h1>
          <p className="text-gray-400 mt-2">Quote #{quoteId}</p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <ReviewSummary
          selectedAreas={quoteData.selected_areas || []}
          quantities={quoteData.quantities || {}}
          carpets={quoteData.carpets || {}}
          appliances={quoteData.appliances || {}}
          SIZED_AREAS={SIZED_AREAS}
          furnished_status={quoteData.furnished_status}
          biohazard={quoteData.biohazard}
          hideDiscountInput={true}
        />

        <GlassLayout title="Final Details">
          <div className="mb-8 space-y-4 border-b border-gray-700/50 pb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">1. Confirm Date & Time</h3>
            <BookingDatePicker
              required
              value={bookingDate}
              holidays={blockedDates}
              onChange={(data) => {
                setBookingDate(data.booking_date);
                setTimeslot("");
              }}
            />
            <TimeSlotSelector
              required
              value={timeslot}
              disabledSlots={disabledSlotsForDate}
              onChange={setTimeslot}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-4">2. Confirm Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-1/2"
            >
              <option value="" disabled>Select...</option>
              <option value="cash">Cash on the day</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Credit/Debit Card (Online)</option>
            </select>
          </div>
        </GlassLayout>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={`px-8 py-4 rounded-xl text-white font-bold transition shadow-lg ${
              submitting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {submitting ? "Processing..." : `Confirm & Pay £${quoteData.total}`}
          </button>
        </div>
      </div>
      <BookingSuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
