// src/pages/QuoteCheckout.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import GlassLayout from "../components/ui/GlassLayout";
import BookingDatePicker from "../components/ui/BookingDatePicker";
import TimeSlotSelector from "../components/ui/TimeSlotSelector";
import ReviewSummary from "../components/ReviewSummary";
import BookingSuccessModal from "../components/BookingSuccessModal";
import useQuoteCalculator from "../hooks/useQuoteCalculator";

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
  const [discountCode, setDiscountCode] = useState("");

  const { finalTotal } = useQuoteCalculator({
    selectedAreas: quoteData?.selected_areas || [],
    quantities: quoteData?.quantities || {},
    carpets: quoteData?.carpets || {},
    appliances: quoteData?.appliances || {},
    details: {
      furnished_status: quoteData?.furnished_status,
      biohazard: quoteData?.biohazard,
    },
    discountCode,
  });

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
        // Guard: 404 means the quote id is stale/unknown.
        if (status === 404) {
          setError("This quote could not be found. Please request a new quote.");
        } else {
          setError("Could not load your quote. Please try again.");
        }
        setLoading(false);
        return;
      }

      // 2) Non-authoritative: fetch blocked dates and partially blocked slots.
      try {
        const [blockedRes, partialRes] = await Promise.all([
          api.get("/api/cleaning-bookings/blocked-dates/"),
          api.get("/api/cleaning-bookings/partially-blocked-slots/"),
        ]);
        setBlockedDates(blockedRes.data || []);
        setPartiallyBlockedSlots(partialRes.data || {});
      } catch (err) {
        console.error("Could not load availability data", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [quoteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.post(`/cleaning-bookings/${quoteId}/confirm/`, {
        booking_date: bookingDate,
        timeslot,
        payment_method: paymentMethod,
        address,
        postcode,
        phone,
        discount_code: discountCode,
      });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      if (status === 404) {
        setError("Could not confirm your booking. Please try again.");
      } else if (status === 400) {
        setError(err.response?.data?.detail || "Please check your booking details and try again.");
      } else {
        setError("Could not confirm your booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GlassLayout>
        <div className="flex items-center justify-center min-h-screen text-white">
          Loading your quote…
        </div>
      </GlassLayout>
    );
  }

  if (error && !quoteData) {
    return (
      <GlassLayout>
        <div className="flex flex-col items-center justify-center min-h-screen text-white gap-4 px-6">
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#915EFF] hover:bg-[#7c4dff] transition-colors rounded-lg px-6 py-2"
          >
            Back to home
          </button>
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout>
      <div className="max-w-3xl mx-auto px-4 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6">Confirm your booking</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <BookingDatePicker
            value={bookingDate}
            onChange={setBookingDate}
            blockedDates={blockedDates}
            partiallyBlockedSlots={partiallyBlockedSlots}
          />

          <TimeSlotSelector value={timeslot} onChange={setTimeslot} />

          <div className="flex flex-col gap-2">
            <label className="font-medium">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-[#1d1836] border border-[#915EFF] rounded-lg px-4 py-2"
            >
              <option value="">Select…</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank transfer</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#1d1836] border border-[#915EFF] rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="bg-[#1d1836] border border-[#915EFF] rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#1d1836] border border-[#915EFF] rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Discount code (optional)</label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="bg-[#1d1836] border border-[#915EFF] rounded-lg px-4 py-2"
            />
          </div>

          <ReviewSummary quoteData={quoteData} finalTotal={finalTotal} />

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#915EFF] hover:bg-[#7c4dff] transition-colors rounded-lg px-6 py-3 font-semibold disabled:opacity-50"
          >
            {submitting ? "Confirming…" : "Confirm booking"}
          </button>
        </form>
      </div>

      <BookingSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        quoteId={quoteId}
      />
    </GlassLayout>
  );
}
