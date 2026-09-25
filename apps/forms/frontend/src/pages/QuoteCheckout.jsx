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
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState(""); // ✅ Added phone state

  useEffect(() => {
    if (!quoteId) {
      setError("No quote ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // 1) Authoritative: fetch the quote first. If this fails, the page cannot work.
      let data;
      try {
        const quoteRes = await api.get(`/api/cleaning-bookings/${quoteId}/`);
        data = quoteRes.data;
        setQuoteData(data);

        // Pre-fill if data exists from the initial quote
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
          setError("This quote link is no longer valid.");
        } else if (status === 401 || status === 403) {
          setError("Please sign in or use the original email link to view this quote.");
        } else {
          setError("Could not load your quote. Please try again.");
        }
        setLoading(false);
        return;
      }

      // 2) Non-authoritative: blocked-times is best-effort. Degrade to empty arrays on failure.
      try {
        const timesRes = await api.get("/api/blocked-times/");
        setBlockedDates(timesRes.data.fully_blocked_dates || []);
        setPartiallyBlockedSlots(timesRes.data.partially_blocked_slots || {});
      } catch (err) {
        console.warn("blocked-times unavailable; continuing without availability hints", err);
        setBlockedDates([]);
        setPartiallyBlockedSlots({});
      }

      setLoading(false);
    };
    fetchData();
  }, [quoteId]);

  const handleConfirm = async () => {
    // ✅ Strict validation enforcing ALL crucial fields are filled out
    if (!bookingDate || !timeslot) {
      setError("Please select a valid date and time for your booking.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number so we can contact you.");
      return;
    }
    if (!address.trim() || !postcode.trim()) {
      setError("Please provide your full property address and postcode.");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        payment_method: paymentMethod,
        selected_datetime: { booking_date: bookingDate, timeslot: timeslot },
        status: "confirmed",
        phone: phone, // Send updated phone number
        property_details: {
          address: address,
          postcode: postcode,
        },
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
      <GlassLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-white/80">Loading your quote…</p>
        </div>
      </GlassLayout>
    );
  }

  if (error && !quoteData) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            Back to home
          </button>
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-semibold text-white">Confirm your booking</h1>

        {error && (
          <div className="rounded-lg bg-red-500/20 text-red-100 px-4 py-3">
            {error}
          </div>
        )}

        {quoteData && <ReviewSummary quote={quoteData} />}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-white/10 text-white px-3 py-2 outline-none"
              placeholder="e.g. 07123 456789"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg bg-white/10 text-white px-3 py-2 outline-none"
              placeholder="123 Example Street"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="w-full rounded-lg bg-white/10 text-white px-3 py-2 outline-none"
              placeholder="AB1 2CD"
            />
          </div>

          <BookingDatePicker
            value={bookingDate}
            onChange={setBookingDate}
            blockedDates={blockedDates}
            partiallyBlockedSlots={partiallyBlockedSlots}
          />

          <TimeSlotSelector
            value={timeslot}
            onChange={setTimeslot}
            bookingDate={bookingDate}
            blockedDates={blockedDates}
            partiallyBlockedSlots={partiallyBlockedSlots}
          />

          <div>
            <label className="block text-sm text-white/80 mb-1">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg bg-white/10 text-white px-3 py-2 outline-none"
            >
              <option value="">Select…</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank transfer</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-500 text-white py-3 font-medium hover:bg-emerald-600 disabled:opacity-60"
        >
          {submitting ? "Confirming…" : "Confirm booking"}
        </button>
      </div>

      <BookingSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </GlassLayout>
  );
}
