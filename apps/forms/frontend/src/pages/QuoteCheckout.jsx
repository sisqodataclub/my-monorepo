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
  const [phone, setPhone] = useState("");
  const [discountCode, setDiscountCode] = useState("");

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
        setError("Could not load your quote. Please try again.");
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
  if (!quoteData) return <GlassLayout><p>Loading your quote…</p></GlassLayout>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/api/cleaning-bookings/${quoteId}/confirm/`, {
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
      setError("Could not confirm your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassLayout>
      <div className="quote-checkout">
        <h1>Complete your booking</h1>

        <form onSubmit={handleSubmit}>
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

          <div className="form-field">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Discount code</label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>

          <ReviewSummary quoteData={quoteData} />

          <button type="submit" disabled={submitting}>
            {submitting ? "Confirming…" : "Confirm booking"}
          </button>
        </form>
      </div>

      {showSuccess && (
        <BookingSuccessModal
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        />
      )}
    </GlassLayout>
  );
}
