import React, { useEffect, useState } from "react";
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

// ---------------------------
// COMPONENT
// ---------------------------
export default function BookingWizard() {
  // ---------------------------
  // STATE
  // ---------------------------
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [service, setService] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [carpets, setCarpets] = useState({});
  const [appliances, setAppliances] = useState({});
  const [discountCode, setDiscountCode] = useState("");

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    furnished_status: "",
    parking: "",
    biohazard: "",
    payment_method: "",
    booking_date: "",
    timeslot: "",
  });

  const [canProceed, setCanProceed] = useState(false);

  // ---------------------------
  // STEP FLOW
  // ---------------------------
  const normalFlow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const carpetFlow = [1, 4, 5, 6, 7, 8, 9];
  const stepsOrder = service === SPECIAL_SERVICE ? carpetFlow : normalFlow;

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
  // NAVIGATION
  // ---------------------------
  const goNext = () => {
    const idx = stepsOrder.indexOf(step);
    if (stepsOrder[idx + 1]) setStep(stepsOrder[idx + 1]);
  };

  const goPrev = () => {
    const idx = stepsOrder.indexOf(step);
    if (stepsOrder[idx - 1]) setStep(stepsOrder[idx - 1]);
  };

  const resetAll = () => {
    setStep(1);
    setService("");
    setSelectedAreas([]);
    setQuantities({});
    setCarpets({});
    setAppliances({});
    setDiscountCode("");
    setDetails({
      name: "",
      email: "",
      phone: "",
      furnished_status: "",
      parking: "",
      biohazard: "",
      payment_method: "",
      booking_date: "",
      timeslot: "",
    });
    setShowSuccess(false);
  };

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
    const t = setTimeout(() => (window.location.href = "/"), 5000);
    return () => clearTimeout(t);
  }, [showSuccess]);

  // ---------------------------
  // SNAPSHOT (AUTO SAVE)
  // ---------------------------
  useAutoSnapshot(SESSION_ID, {
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
  });

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    setLoading(true);
  
    const normalAreas = selectedAreas.filter((a) => !SIZED_AREAS.includes(a));
  
    const sizedAreas = SIZED_AREAS.reduce((acc, area) => {
      if (selectedAreas.includes(area)) {
        acc[`${area}_Small`] = quantities[`${area}_Small`] ?? 0;
        acc[`${area}_Medium`] = quantities[`${area}_Medium`] ?? 0;
        acc[`${area}_Large`] = quantities[`${area}_Large`] ?? 0;
      }
      return acc;
    }, {});
  
    const allQuantities = {
      ...sizedAreas,
      ...carpets,
      ...appliances,
      ...normalAreas.reduce((a, k) => {
        a[k] = quantities[k] ?? 1;
        return a;
      }, {}),
      furnished_fee: furnishedFee,
      biohazard_fee: details.biohazard ? biohazardFee : 0,
      discount: discount ?? 0,
      booking_date: details.booking_date,
      timeslot: details.timeslot,
    };
  
    try {
      let paymentlink = null;
  
      // If payment method is card, generate payment link first
      if (details.payment_method === "card") {
        const payRes = await api.post("/api/payment-link/", {
          total: finalTotal,
          // optionally pass user details for the payment API
          name: details.name,
          email: details.email,
        });
        paymentlink = payRes.data.paymentlink; // get link
      }
  
      // Include paymentlink in booking payload
      const payload = {
        session_id: SESSION_ID,
        ...details,
        selected_areas: [service, ...normalAreas],
        quantities: allQuantities,
        total: finalTotal,
        paymentlink: paymentlink, // ← added here
      };
  
      // Save booking with paymentlink included
      const res = await api.post("/api/bookings/", payload);
  
      if (res.status === 200 || res.status === 201) {
        await api.post("/api/contact-messages/", {
          name: details.name,
          email: details.email,
          message: `Your cleaning quote total is £${finalTotal}.`,
        });
  
        if (paymentlink) {
          // redirect directly
          window.location.href = paymentlink;
          return;
        }
  
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed");
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
      />

      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </GlassLayout>
  );
}
