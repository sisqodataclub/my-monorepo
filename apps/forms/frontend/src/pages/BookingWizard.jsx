import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlassLayout from "../components/ui/GlassLayout";
import WizardSteps from "../components/booking/WizardSteps";
import WizardNavigation from "../components/booking/WizardNavigation";

import useQuoteCalculator from "../hooks/useQuoteCalculator";
import useAutoSnapshot, { getSessionId } from "../hooks/useAutoSnapshot";

import api from "../api";
import SuccessModal from "../components/SuccessModal";

// ---------------------------
// CONSTANTS
// ---------------------------
const SESSION_ID = getSessionId();
const SIZED_AREAS = ["Kitchen", "Bedroom"];
const SPECIAL_SERVICE = "Carpet, Upholstery & Appliances Cleaning ONLY";

const INITIAL_DETAILS = {
  name: "",
  email: "",
  phone: "",
  furnished_status: "",
  parking: "",
  biohazard: "",
  payment_method: "",
  booking_date: "",
  timeslot: "",
};

// ---------------------------
// COMPONENT
// ---------------------------
export default function BookingWizard() {
  const navigate = useNavigate();

  // ---------------------------
  // STATE
  // ---------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [service, setService] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [carpets, setCarpets] = useState({});
  const [appliances, setAppliances] = useState({});
  const [discountCode, setDiscountCode] = useState("");

  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [canProceed, setCanProceed] = useState(false);

  // ---------------------------
  // STEP FLOW
  // ---------------------------
  const normalFlow = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9], []);
  const carpetFlow = useMemo(() => [1, 4, 5, 6, 7, 8, 9], []);
  const stepsOrder = useMemo(() => 
    service === SPECIAL_SERVICE ? carpetFlow : normalFlow
  , [service, carpetFlow, normalFlow]);

  // ---------------------------
  // QUOTE (SINGLE SOURCE OF TRUTH)
  // ---------------------------
  const { baseQuote, furnishedFee, biohazardFee, discount, finalTotal } =
    useQuoteCalculator({
      selectedAreas,
      quantities,
      carpets,
      appliances,
      details,
      discountCode,
    });

  // ---------------------------
  // NAVIGATION (Memoized)
  // ---------------------------
  const goNext = useCallback(() => {
    const idx = stepsOrder.indexOf(step);
    if (stepsOrder[idx + 1]) setStep(stepsOrder[idx + 1]);
    setError(null); // Clear any previous errors on navigation
  }, [step, stepsOrder]);

  const goPrev = useCallback(() => {
    const idx = stepsOrder.indexOf(step);
    if (stepsOrder[idx - 1]) setStep(stepsOrder[idx - 1]);
    setError(null);
  }, [step, stepsOrder]);

  const resetAll = useCallback(() => {
    setStep(1);
    setService("");
    setSelectedAreas([]);
    setQuantities({});
    setCarpets({});
    setAppliances({});
    setDiscountCode("");
    setDetails(INITIAL_DETAILS);
    setShowSuccess(false);
    setError(null);
  }, []);

  // ---------------------------
  // EFFECTS
  // ---------------------------
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!service) return;
    setStep(service === SPECIAL_SERVICE ? 4 : 2);
  }, [service]);

  useEffect(() => {
    if (!showSuccess) return;
    
    // Use React Router's navigate instead of window.location.href
    // to prevent a full hard-reload of the React SPA.
    const t = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(t);
  }, [showSuccess, navigate]);

  // ---------------------------
  // SNAPSHOT (AUTO SAVE)
  // ---------------------------
  // Wrapped in useMemo to prevent unnecessary re-renders or API spamming
  const snapshotPayload = useMemo(() => ({
    selected_areas: selectedAreas,
    quantities: {
      ...quantities,
      Carpets: carpets,
      Appliances: appliances,
      furnished_fee: furnishedFee,
      biohazard_fee: details.biohazard ? biohazardFee : 0,
      discount: discount ?? 0,
      booking_date: details.booking_date,
      timeslot: details.timeslot,
    },
    details,
  }), [selectedAreas, quantities, carpets, appliances, furnishedFee, biohazardFee, discount, details]);

  useAutoSnapshot(SESSION_ID, snapshotPayload);

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    const normalAreas = selectedAreas.filter((a) => !SIZED_AREAS.includes(a));
  
    // Cleaner way to map sized areas safely
    const sizedAreas = {};
    SIZED_AREAS.forEach(area => {
      if (selectedAreas.includes(area)) {
        sizedAreas[`${area}_Small`] = quantities[`${area}_Small`] ?? 0;
        sizedAreas[`${area}_Medium`] = quantities[`${area}_Medium`] ?? 0;
        sizedAreas[`${area}_Large`] = quantities[`${area}_Large`] ?? 0;
      }
    });
  
    // Map normal area quantities
    const normalQuantities = {};
    normalAreas.forEach(area => {
      normalQuantities[area] = quantities[area] ?? 1;
    });

    const allQuantities = {
      ...sizedAreas,
      ...normalQuantities,
      ...carpets,
      ...appliances,
      furnished_fee: furnishedFee,
      biohazard_fee: details.biohazard ? biohazardFee : 0,
      discount: discount ?? 0,
      booking_date: details.booking_date,
      timeslot: details.timeslot,
    };
  
    try {
      let paymentlink = null;
  
      // 1. Generate payment link if using card
      if (details.payment_method === "card") {
        const payRes = await api.post("/api/payment-link/", {
          total: finalTotal,
          name: details.name,
          email: details.email,
        });
        paymentlink = payRes.data.paymentlink;
      }
  
      // 2. Save booking with paymentlink included
      const payload = {
        session_id: SESSION_ID,
        ...details,
        selected_areas: [service, ...normalAreas],
        quantities: allQuantities,
        total: finalTotal,
        paymentlink: paymentlink,
      };
      const res = await api.post("/api/bookings/", payload);
  
      // 3. Process Success
      if (res.status === 200 || res.status === 201) {
        
        // Trigger the backend Thank You email logic
        await api.post("/api/contact-messages/", {
          name: details.name,
          email: details.email,
          message: `Your cleaning quote total is £${finalTotal}.`,
        });
  
        // Redirect to Stripe if applicable
        // We use window.location.href here because Stripe is an external URL
        if (paymentlink) {
          window.location.href = paymentlink;
          return;
        }
  
        setShowSuccess(true);
        
        // Clear all form fields to reset the UI behind the modal
        setService("");
        setSelectedAreas([]);
        setQuantities({});
        setCarpets({});
        setAppliances({});
        setDiscountCode("");
        setDetails(INITIAL_DETAILS);
        setStep(1);
        
      } else {
        throw new Error("Failed to create booking.");
      }

    } catch (err) {
      console.error("Booking Error:", err);
      setError("Failed to process your booking. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };
  
  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <GlassLayout
      title="DDEEP CLEANING SERVICES"
      subtitle="Step-by-step booking with instant pricing"
    >
      {/* Optional UI Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <WizardSteps
        step={step}
        service={service}
        setService={setService}
        selectedAreas={selectedAreas}
        setSelectedAreas={setSelectedAreas}
        quantities={quantities}
        setQuantities={setQuantities}
        carpets={carpets}
        setCarpets={setCarpets}
        appliances={appliances}
        setAppliances={setAppliances}
        details={details}
        setDetails={setDetails}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        totalQuote={finalTotal}
        setCanProceed={setCanProceed}
        handleSubmit={handleSubmit}
      />

      <WizardNavigation
        step={step}
        stepsOrder={stepsOrder}
        canProceed={canProceed}
        details={details}
        goNext={goNext}
        goPrev={goPrev}
        resetAll={resetAll}
        loading={loading} // Pass loading state to prevent double clicks
      />

      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </GlassLayout>
  );
}
