#####try

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

  // 🚀 Pull 'loading' from the hook and rename it to 'isCalculating'
  const { finalTotal, loading: isCalculating } = useQuoteCalculator({
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

    const alreadyConfirmed = quoteData?.status === "confirmed";

    try {
      const res = await api.patch(`/api/cleaning-bookings/${quoteId}/`, {
        status: "confirmed",
        booking_date: bookingDate,
        timeslot,
        payment_method: paymentMethod,
        property_details: { address, postcode },
        phone,
        discount_code: discountCode,
      });

      const returnedStatus = res?.data?.status;
      const isAlreadyConfirmed = alreadyConfirmed || (returnedStatus === "confirmed" && alreadyConfirmed);

      setModalVariant(isAlreadyConfirmed ? "alreadyConfirmed" : "default");
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

  return (
    <GlassLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Complete Your Booking</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="flex flex-col h-full">
            {quoteData ? (
              // 🚀 Replaces the table with a spinner while isCalculating is true
              isCalculating ? (
                <div className="p-6 bg-white/10 rounded-xl text-white flex flex-col items-center justify-center min-h-[250px]">
                  <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-lg font-semibold">Calculating summary…</p>
                </div>
              ) : (
                <ReviewSummary
                  selectedAreas={quoteData.selected_areas || []}
                  quantities={quoteData.quantities || {}}
                  carpets={quoteData.carpets || {}}
                  appliances={quoteData.appliances || {}}
                  total={finalTotal || quoteData.total || 0} 
                />
              )
            ) : (
              <div className="p-6 bg-white/10 rounded-xl text-white">
                <p>Loading your summary…</p>
              </div>
            )}
            
            <button
              type="submit"
              // 🚀 Keep button disabled while calculating
              disabled={submitting || isCalculating || (!finalTotal && !quoteData?.total)}
              className="mt-8 w-full py-3 bg-[#915EFF] hover:bg-[#7c4dff] text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "Confirming…" : isCalculating ? "Calculating..." : "Confirm Booking"}
            </button>
          </div>
        </form>
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
