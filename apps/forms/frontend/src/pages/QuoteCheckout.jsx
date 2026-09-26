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

      // 2) Non-authoritative: blocked-times is best-effort. Degrade to empty arrays on failure.
      try {
        const blockedRes = await api.get("/api/blocked-times/");
        const blockedData = blockedRes.data;
        if (blockedData && typeof blockedData === "object") {
          setBlockedDates(Array.isArray(blockedData.blocked_dates) ? blockedData.blocked_dates : []);
          setPartiallyBlockedSlots(
            blockedData.partially_blocked_slots && typeof blockedData.partially_blocked_slots === "object"
              ? blockedData.partially_blocked_slots
              : {}
          );
        }
      } catch (err) {
        // Non-fatal: the page still works without blocked-times data.
        console.warn("Could not load blocked times (non-fatal):", err);
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
      const payload = {
        selected_datetime: { booking_date: bookingDate, timeslot },
        payment_method: paymentMethod,
        property_details: { address, postcode },
        phone,
      };

      await api.patch(`/api/cleaning-bookings/${quoteId}/`, payload);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not confirm your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GlassLayout>
        <div className="checkout-loading">Loading your quote…</div>
      </GlassLayout>
    );
  }

  if (error && !quoteData) {
    return (
      <GlassLayout>
        <div className="checkout-error">
          <p>{error}</p>
          <button type="button" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="quote-checkout">
        <h1>Confirm your booking</h1>

        {error && <div className="checkout-error-banner">{error}</div>}

        {quoteData && <ReviewSummary quoteData={quoteData} />}

        <form onSubmit={handleSubmit}>
          <BookingDatePicker
            value={bookingDate}
            onChange={setBookingDate}
            blockedDates={blockedDates}
          />

          <TimeSlotSelector
            value={timeslot}
            onChange={setTimeslot}
            blockedDates={blockedDates}
            partiallyBlockedSlots={partiallyBlockedSlots}
          />

          <div className="field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="postcode">Postcode</label>
            <input
              id="postcode"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="paymentMethod">Payment method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select…</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Confirming…" : "Confirm booking"}
          </button>
        </form>
      </div>

      {showSuccess && (
        <BookingSuccessModal
          onClose={() => setShowSuccess(false)}
          onConfirm={() => navigate("/")}
        />
      )}
    </GlassLayout>
  );
}
