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

        // Guard: a non-JSON payload (string/HTML) must not propagate into quoteData,
        // or the page will blank out when it tries to read properties off a string.
        if (!data || typeof data !== "object") {
          setError("Could not load your quote. Please try again.");
          setLoading(false);
          return;
        }

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
        // Guard: coerce any non-object response payload (string/HTML error page) to a generic message.
        if (!err.response?.data || typeof err.response.data !== "object") {
          setError("Could not load your quote. Please try again.");
        } else if (status === 404) {
          setError("This quote link is no longer valid.");
        } else if (status === 401 || status === 403) {
          setError("Please sign in or use the original email link to view this quote.");
        } else {
          setError("Could not load your quote. Please try again.");
        }
        setLoading(false);
        return;
      }

      // 2) Non-authoritative: availability data. Failures here must not blank the page.
      try {
        const [blockedRes, partialRes] = await Promise.all([
          api.get("/api/cleaning-bookings/blocked-dates/"),
          api.get("/api/cleaning-bookings/partially-blocked-slots/"),
        ]);
        setBlockedDates(blockedRes.data || []);
        setPartiallyBlockedSlots(partialRes.data || {});
      } catch (err) {
        console.warn("Availability data unavailable:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [quoteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !timeslot || !paymentMethod) {
      setError("Please select a date, time slot, and payment method.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post(`/api/cleaning-bookings/${quoteId}/confirm/`, {
        selected_datetime: { booking_date: bookingDate, timeslot },
        payment_method: paymentMethod,
        property_details: { address, postcode },
        phone,
      });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not confirm your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <GlassLayout>
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <h1 className="text-2xl font-semibold text-white">Confirm your booking</h1>

        {loading && (
          <p className="text-white/80">Loading your quote…</p>
        )}

        {error && !loading && (
          <p className="rounded-lg bg-red-500/20 border border-red-400/40 px-4 py-3 text-red-100">
            {error}
          </p>
        )}

        {!loading && !error && quoteData && (
          <>
            <ReviewSummary quote={quoteData} sizedAreas={SIZED_AREAS} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Booking date</label>
                <BookingDatePicker
                  value={bookingDate}
                  onChange={setBookingDate}
                  blockedDates={blockedDates}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Time slot</label>
                <TimeSlotSelector
                  value={timeslot}
                  onChange={setTimeslot}
                  bookingDate={bookingDate}
                  partiallyBlockedSlots={partiallyBlockedSlots}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                >
                  <option value="">Select a payment method</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank transfer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                  placeholder="123 Example Street"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Postcode</label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                  placeholder="AB1 2CD"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                  placeholder="07123 456789"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-4 py-3 font-semibold text-white"
              >
                {submitting ? "Confirming…" : "Confirm booking"}
              </button>
            </form>
          </>
        )}
      </div>

      {showSuccess && (
        <BookingSuccessModal onClose={handleSuccessClose} />
      )}
    </GlassLayout>
  );
}
