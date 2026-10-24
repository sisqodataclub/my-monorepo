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

  // Call the calculator at the top level so the summary has data on first render,
  // instead of waiting for ReviewSummary's internal debounced call.
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quoteId]);

  // Re-trigger calculation when tab regains visibility (fixes background-tab throttling)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && quoteData) {
        window.dispatchEvent(new Event("quote:refresh"));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [quoteData]);

  if (loading) return <GlassLayout><p>Loading your quote…</p></GlassLayout>;
  if (error) return <GlassLayout><p>{error}</p></GlassLayout>;

  return (
    <GlassLayout>
      <div className="quote-checkout">
        <h1>Complete your booking</h1>
        {quoteData && (
          <ReviewSummary
            quoteData={quoteData}
            finalTotal={finalTotal}
            discountCode={discountCode}
          />
        )}
      </div>
    </GlassLayout>
  );
}
