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

      // 2) Best-effort: fetch blocked dates/slots. Failures here don't block the page.
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

  // Re-fire the summary calculation when the tab becomes visible again.
  // Background tabs throttle setTimeout, which can leave the summary empty
  // on first load until the user refocuses the tab.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && quoteData) {
        window.dispatchEvent(new CustomEvent("quote-summary-refresh"));
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [quoteData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !timeslot || !paymentMethod) {
      setError("Please select a date, time slot, and payment method.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.patch(`/api/cleaning-bookings/${quoteId}/`, {
        selected_datetime: { booking_date: bookingDate, timeslot },
        payment_method: paymentMethod,
        property_details: { address, postcode },
        phone,
        discount_code: discountCode,
      });
      setModalVariant("default");
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

  return (
    <GlassLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Complete Your Booking</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-white mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              >
                <option value="">Select…</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Discount Code</label>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
              />
            </div>
          </div>

          <div>
            {quoteData ? (
              <ReviewSummary
                quoteData={quoteData}
                finalTotal={finalTotal}
                discountCode={discountCode}
              />
            ) : (
              <div className="p-6 bg-white/10 rounded-xl text-white">
                <p>Loading your summary…</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Confirming…" : "Confirm Booking"}
        </button>
      </div>

      {showSuccess && (
        <BookingSuccessModal
          variant={modalVariant}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </GlassLayout>
  );
}
