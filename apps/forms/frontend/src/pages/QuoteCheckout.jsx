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

      setLoading(false);
    };

    fetchData();
  }, [quoteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    // If the booking was already confirmed when the page loaded, the user
    // is re-pressing Confirm on a confirmed booking. The backend will still
    // return 200 with status='confirmed', so we detect this client-side and
    // swap the modal copy instead of showing the standard success message.
    const alreadyConfirmed = quoteData?.status === "confirmed";

    try {
      const res = await api.patch(`/api/cleaning-bookings/${quoteId}/`, {
        status: "confirmed",
        booking_date: bookingDate,
        timeslot,
        payment_method: paymentMethod,
        address,
        postcode,
        phone,
        discount_code: discountCode,
      });

      // Belt-and-braces: also treat a returned status of 'confirmed' on a
      // booking we already knew was confirmed as the 'already confirmed' case.
      const returnedStatus = res?.data?.status;
      const isAlreadyConfirmed = alreadyConfirmed || returnedStatus === "confirmed" && alreadyConfirmed;

      setModalVariant(isAlreadyConfirmed ? "alreadyConfirmed" : "default");
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <BookingDatePicker
            value={bookingDate}
            onChange={setBookingDate}
            blockedDates={blockedDates}
            partiallyBlockedSlots={partiallyBlockedSlots}
          />

          <TimeSlotSelector value={timeslot} onChange={setTimeslot} />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select…</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Postcode</label>
            <input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Discount code</label>
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="bg-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <ReviewSummary
            selectedAreas={quoteData?.selected_areas || []}
            quantities={quoteData?.quantities || {}}
            carpets={quoteData?.carpets || {}}
            appliances={quoteData?.appliances || {}}
            total={finalTotal}
          />

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
        show={showSuccess}
        variant={modalVariant}
        onClose={() => setShowSuccess(false)}
      />
    </GlassLayout>
  );
}
