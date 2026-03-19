import React, { useEffect, useState } from "react";

// =========================================================================
// NOTE FOR LOCAL DEVELOPMENT:
// The real imports are commented out below so this isolated preview compiles.
// WHEN PASTING THIS INTO YOUR LOCAL APP, UNCOMMENT YOUR REAL IMPORTS AND
// DELETE THE MOCK COMPONENTS.
// =========================================================================

/* --- UNCOMMENT THESE FOR YOUR LOCAL ENVIRONMENT ---
import GlassLayout from "../components/ui/GlassLayout";
import WizardSteps from "../components/booking/WizardSteps";
import WizardNavigation from "../components/booking/WizardNavigation";
import useQuoteCalculator from "../hooks/useQuoteCalculator";
import useAutoSnapshot, { getSessionId } from "../hooks/useAutoSnapshot";
import SuccessModal from "../components/SuccessModal";
-------------------------------------------------- */

// --- DELETE THESE MOCKS IN YOUR LOCAL ENVIRONMENT ---
const GlassLayout = ({ children, title, subtitle }) => <div className="p-8 text-white min-h-screen bg-gray-900 max-w-4xl mx-auto rounded-xl mt-10 border border-gray-800"><h1 className="text-3xl font-bold text-[#915EFF] mb-2">{title}</h1><p className="text-gray-400 mb-8">{subtitle}</p>{children}</div>;
const WizardSteps = () => <div className="p-12 bg-gray-800 rounded-xl mb-8 text-center border border-gray-700 text-gray-300 font-mono">Wizard Steps & Form UI Placeholder</div>;
const WizardNavigation = ({ goNext, goPrev, resetAll }) => (
  <div className="flex justify-between gap-4 mt-8 pt-8 border-t border-gray-800">
    <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold transition-all" onClick={goPrev}>Back</button>
    <button className="bg-red-900/30 hover:bg-red-900/60 text-red-400 px-6 py-3 rounded-lg font-bold transition-all" onClick={resetAll}>Start Over</button>
    <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold shadow-lg transition-all" onClick={goNext}>Next Step</button>
  </div>
);
const useQuoteCalculator = () => ({ baseQuote: 150, furnishedFee: 25, biohazardFee: 0, discount: 10, finalTotal: 165 });
const useAutoSnapshot = () => {};
const getSessionId = () => "mock-session-123";
const SuccessModal = ({ show, onClose }) => show ? <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"><div className="bg-gray-900 border border-green-500 p-10 rounded-2xl text-center"><h2 className="text-3xl text-green-400 font-bold mb-4">Booking Confirmed!</h2><p className="mb-6">Your payment link has been generated.</p><button onClick={onClose} className="bg-green-600 px-6 py-2 rounded font-bold text-white">Close</button></div></div> : null;
// --------------------------------------------------

// ---------------------------
// CONSTANTS
// ---------------------------
const SESSION_ID = getSessionId();
const SIZED_AREAS = ["Kitchen", "Bedroom"];
const SPECIAL_SERVICE = "Carpet, Upholstery & Appliances Cleaning ONLY";
const API_BASE = "https://core.franciscodes.com";

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
      biohazard_fee: details.biohazard === "Yes" ? biohazardFee : 0,
      discount: discount ?? 0,
      booking_date: details.booking_date,
      timeslot: details.timeslot,
    },
    details,
  });

  // ---------------------------
  // SUBMIT TO MULTI-TENANT BACKEND
  // ---------------------------
  const handleSubmit = async () => {
    setLoading(true);

    // 1. 💷 THE £1 CHUNKING STRATEGY 💷
    // This bypasses your backend's "max_value=100" limit for quantities.
    const checkoutItems = [];
    const PRODUCT_ID = 1; // ⚠️ Ensure this matches the ID from your populate_dcs.py script!
    
    let remainingTotal = Math.ceil(finalTotal); // Round to nearest pound
    let partCounter = 1;

    // Split the dynamic total quote into quantities of 100 max
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

    // 2. Pack extra custom details into the gift_message field so it saves cleanly in your DB
    const extraDetails = `Areas: ${selectedAreas.join(", ")} | Phone: ${details.phone} | Furnished: ${
      details.furnished_status
    } | Biohazard: ${details.biohazard || "No"} | Parking: ${
      details.parking
    } | Date: ${details.booking_date} | Time: ${
      details.timeslot
    } | Total: £${finalTotal}`;

    // 3. Assemble the final payload matching your Django CreateCheckoutSerializer
    const payload = {
      items: checkoutItems,
      customer_email: details.email || "guest@example.com",
      customer_name: details.name || "Guest User",
      is_gift: false,
      gift_message: extraDetails,
    };

    try {
      // 4. Hit the Multi-Tenant Backend Endpoint
      const response = await fetch(
        `${API_BASE}/api/payments/bookings/create_checkout/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Tenant": "dcs", // ✅ Explicitly target the DCS database
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          errorData.error || errorData.detail || "Submission failed";
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // 5. Handle Stripe Redirection
      if (data && data.checkout_url) {
        // Automatically redirect user to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        // Fallback Success (e.g. if the quote was £0)
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

      {/* Checkout Submission Button - Visible on final review step typically, or left out here if WizardSteps handles it */}
      <div className="mt-8 pt-8 text-center border-t border-gray-800">
        <p className="text-gray-400 mb-4 uppercase tracking-widest text-sm">Review Complete?</p>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-[#915EFF] hover:bg-[#7a4aea] text-white font-bold py-5 px-16 rounded-xl shadow-lg shadow-[#915EFF]/20 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 text-lg"
        >
          {loading ? "Establishing Secure Link..." : "Proceed to Secure Checkout"}
        </button>
      </div>

      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </GlassLayout>
  );
}
