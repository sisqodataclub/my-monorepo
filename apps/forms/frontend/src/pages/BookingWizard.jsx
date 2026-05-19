import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WizardSteps from "../components/booking/WizardSteps";
import WizardNavigation from "../components/booking/WizardNavigation";

import useQuoteCalculator from "../hooks/useQuoteCalculator";
import useAutoSnapshot, { getSessionId, regenerateSessionId } from "../hooks/useAutoSnapshot";

import api from "../api";
import SuccessModal from "../components/SuccessModal";

// ---------------------------
// CONSTANTS
// ---------------------------
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
  const scrollContainerRef = useRef(null);

  // ---------------------------
  // STATE
  // ---------------------------
  const [sessionId, setSessionId] = useState(getSessionId());
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
    setError(null);
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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  useEffect(() => {
    if (!service) return;
    setStep(service === SPECIAL_SERVICE ? 4 : 2);
  }, [service]);

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(t);
  }, [showSuccess, navigate]);

  // ---------------------------
  // SNAPSHOT (AUTO SAVE)
  // ---------------------------
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

  useAutoSnapshot(sessionId, snapshotPayload);

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(details.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const normalAreas = selectedAreas.filter((a) => !SIZED_AREAS.includes(a));

    const sizedAreas = {};
    SIZED_AREAS.forEach(area => {
      if (selectedAreas.includes(area)) {
        sizedAreas[`${area}_Small`] = quantities[`${area}_Small`] ?? 0;
        sizedAreas[`${area}_Medium`] = quantities[`${area}_Medium`] ?? 0;
        sizedAreas[`${area}_Large`] = quantities[`${area}_Large`] ?? 0;
      }
    });

    const normalQuantities = {};
    normalAreas.forEach(area => {
      normalQuantities[area] = quantities[area] ?? 1;
    });

    // ✅ Removed the spread of ...details from allQuantities
    const allQuantities = {
      ...sizedAreas,
      ...normalQuantities,
      ...carpets,
      ...appliances,
      furnished_fee: furnishedFee,
      biohazard_fee: details.biohazard ? biohazardFee : 0,
      discount: discount ?? 0,
    };

    try {
      const payload = {
        session_id: sessionId,
        ...details,
        selected_areas: [service, ...normalAreas],
        quantities: allQuantities,
        total: finalTotal,
        payment_method: details.payment_method,
      };

      const res = await api.post("/api/bookings/", payload);

      if (res.status === 200 || res.status === 201) {
        const paymentlink = res.data.paymentlink;
        if (paymentlink) {
          window.location.href = paymentlink;
          return;
        }

        setShowSuccess(true);
        resetAll();
        const freshId = regenerateSessionId();
        setSessionId(freshId);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        const firstKey = Object.keys(backendErrors)[0];
        const firstMessage = Array.isArray(backendErrors[firstKey])
          ? backendErrors[firstKey][0]
          : backendErrors[firstKey];

        const formattedKey = firstKey.charAt(0).toUpperCase() + firstKey.slice(1);
        setError(`${formattedKey}: ${firstMessage}`);
      } else {
        setError("Failed to process your booking. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // RENDER (APP-STYLE LAYOUT)
  // ---------------------------
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <header className="flex-shrink-0 pt-6 pb-4 px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-20 shadow-md">
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center tracking-wide">
          DDEEP CLEANING SERVICES
        </h1>
        <p className="text-gray-400 text-center text-xs sm:text-sm mt-1">
          Step-by-step booking with instant pricing
        </p>
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-center shadow-lg animate-fade-in">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-0 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full pb-8">
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
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 lg:px-8 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-20 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto w-full">
          <WizardNavigation
            step={step}
            stepsOrder={stepsOrder}
            canProceed={canProceed}
            details={details}
            goNext={goNext}
            goPrev={goPrev}
            resetAll={resetAll}
            loading={loading}
          />
        </div>
      </footer>

      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
