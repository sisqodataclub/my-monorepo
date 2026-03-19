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
const API_BASE = "https://core.franciscodes.com"; // Added for multi-tenant fetch

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
      biohazard_fee: details.biohazard === "Yes" ? biohazardFee : 0, // Updated to Version 2's strict check
      discount: discount ?? 0,
      booking_date: details.booking_date,
      timeslot: details.timeslot,
    },
    details,
  });

  // ---------------------------
  // SUBMIT (MERGED LOGIC)
  // ---------------------------
  const handleSubmit = async () => {
    setLoading(true);

    // 1. The £1 Chunking Strategy
    const checkoutItems = [];
    const PRODUCT_ID = 1; // Ensure this matches your multi-tenant DB

    let remainingTotal = Math.ceil(finalTotal); // Round to nearest pound
    let partCounter = 1;

    // Split the dynamic total quote into quantities of 100 max to bypass backend limits
    while (remainingTotal > 0) {
      const chunkQty = Math.min(remainingTotal, 100);
      checkoutItems.push({
        product_id: PRODUCT_ID,
        quantity: chunkQty,
        variant: `Cleaning Quote (Part ${partCounter})`,
      });
      remainingTotal -= chunkQty;
      partCounter++;
    }

    // 2. Pack extra custom details into the gift_message field
    const extraDetails = `Areas: ${selectedAreas.join(", ")} | Phone: ${details.phone} | Furnished: ${
      details.furnished_status
    } | Biohazard: ${details.biohazard || "No"} | Parking: ${
      details.parking
    } | Date: ${details.booking_date} | Time: ${
      details.timeslot
    } | Total: £${finalTotal}`;

    // 3. Assemble checkout payload
    const payload = {
      items: checkoutItems,
      customer_email: details.email || "guest@example.com",
      customer_name: details.name || "Guest User",
      is_gift: false,
      gift_message: extraDetails,
    };

    try {
      // 4. Hit the Multi-Tenant Backend Endpoint using native fetch
      const response = await fetch(
        `${API_BASE}/api/payments/bookings/create_checkout/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Tenant": "dcs", // Target the DCS database
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || "Submission failed");
      }

      const data = await response.json();

      // 5. Fire off the original contact message notification (Optional but recommended)
      try {
        await api.post("/api/contact-messages/", {
          name: details.name,
          email: details.email,
          message: `Your cleaning quote total is £${finalTotal}.`,
        });
      } catch (msgErr) {
        console.warn("Failed to send contact message alert:", msgErr);
      }

      // 6. Handle Stripe Redirection
      if (data && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      alert(`Checkout Error: ${err.message || "An unexpected error occurred."}`);
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
        handleSubmit={handleSubmit} // Triggers the newly merged fetch logic
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
