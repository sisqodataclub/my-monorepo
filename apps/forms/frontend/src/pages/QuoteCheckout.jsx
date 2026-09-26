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

  const handleSubmit = async () => {
    if (!bookingDate || !timeslot || !paymentMethod) {
      setError("Please select a date, time slot, and payment method.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/api/cleaning-bookings/${quoteId}/confirm/`, {
        booking_date: bookingDate,
        timeslot,
        payment_method: paymentMethod,
        address,
        postcode,
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

  if (loading) {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center p-8">
          <p>Loading your quote…</p>
        </div>
      </GlassLayout>
    );
  }

  if (error && !quoteData) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
        <h1 className="text-2xl font-semibold">Confirm your booking</h1>

        {error && (
          <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
        )}

        <BookingDatePicker
          value={bookingDate}
          onChange={setBookingDate}
          blockedDates={blockedDates}
        />

        <TimeSlotSelector
          value={timeslot}
          onChange={setTimeslot}
          partiallyBlockedSlots={partiallyBlockedSlots}
        />

        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className="rounded border px-3 py-2"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label className="font-medium" htmlFor="postcode">
            Postcode
          </label>
          <input
            id="postcode"
            className="rounded border px-3 py-2"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          <label className="font-medium" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="rounded border px-3 py-2"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-medium">Payment method</span>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash
          </label>
        </div>

        {quoteData && (
          <ReviewSummary
            quoteData={quoteData}
            sizedAreas={SIZED_AREAS}
            bookingDate={bookingDate}
            timeslot={timeslot}
            paymentMethod={paymentMethod}
          />
        )}

        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Confirming…" : "Confirm booking"}
        </button>
      </div>

      {showSuccess && (
        <BookingSuccessModal
          onClose={() => setShowSuccess(false)}
        />
      )}
    </GlassLayout>
  );
}
