// src/pages/BookingWizard.jsx
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WizardSteps from "../components/booking/WizardSteps";
import WizardNavigation from "../components/booking/WizardNavigation";
import useQuoteCalculator from "../hooks/useQuoteCalculator";
import useAutoSnapshot, { getSessionId, regenerateSessionId } from "../hooks/useAutoSnapshot";
import api from "../api";
import BookingSuccessModal from "../components/BookingSuccessModal";
import { getServices } from "../lib/api";

const SIZED_AREAS = ["Kitchen", "Bedroom"];
const SPECIAL_SERVICE = "Carpet, Upholstery & Appliances Cleaning ONLY";

const INITIAL_DETAILS = {
  name: "", email: "", phone: "", furnished_status: "",
  parking: "", biohazard: "", payment_method: "",
  booking_date: "", timeslot: "", postcode: "", address: ""
};

export default function BookingWizard() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // Pre‑fetched services
  const [allServices, setAllServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  const [sessionId, setSessionId] = useState(getSessionId());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Blocked dates
  const [blockedDates, setBlockedDates] = useState([]);
  const [partiallyBlockedSlots, setPartiallyBlockedSlots] = useState({});

  const [service, setService] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [carpets, setCarpets] = useState({});
  const [appliances, setAppliances] = useState({});
  const [discountCode, setDiscountCode] = useState("");

  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [canProceed, setCanProceed] = useState(false);

  // Fetch all services once
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getServices(); // fetches ALL pages
        setAllServices(data);
      } catch (err) {
        console.error(err);
        setServicesError("Failed to load services. Please refresh the page.");
      } finally {
        setServicesLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Memoized filtered lists
  const cleaningServices = useMemo(() => {
    return allServices.filter((s) => s.category_name?.toLowerCase() === "cleaning_services");
  }, [allServices]);

  const areasServices = useMemo(() => {
    return allServices.filter((s) => {
      const cat = s.category_name?.toLowerCase();
      return cat === "areas" && !s.name.includes("_");
    });
  }, [allServices]);

  const carpetsServices = useMemo(() => {
    return allServices.filter((s) => s.category_name?.toLowerCase() === "carpets");
  }, [allServices]);

  const appliancesServices = useMemo(() => {
    return allServices.filter((s) => s.category_name?.toLowerCase() === "appliances");
  }, [allServices]);

  const allAreas = useMemo(() => {
    return allServices.filter((s) => s.category_name?.toLowerCase() === "areas");
  }, [allServices]);

  // Step flow, etc. (unchanged from your existing code)
  const normalFlow = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9], []);
  const carpetFlow = useMemo(() => [1, 4, 5, 6, 7, 8, 9], []);
  const stepsOrder = useMemo(() =>
    service === SPECIAL_SERVICE ? carpetFlow : normalFlow
  , [service, carpetFlow, normalFlow]);

  const { baseQuote, furnishedFee, biohazardFee, discount, finalTotal, breakdown } =
    useQuoteCalculator({
      selectedAreas, quantities, carpets, appliances, details, discountCode,
    });

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
    setError(null);
  }, []);

  // Scroll to top
  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Reset when service changes
  useEffect(() => {
    if (service === "") return;
    setSelectedAreas([]);
    setQuantities({});
    setCarpets({});
    setAppliances({});
    setDiscountCode("");
    setDetails(INITIAL_DETAILS);
  }, [service]);

  // Set step after service selection
  useEffect(() => {
    if (!service) return;
    setStep(service === SPECIAL_SERVICE ? 4 : 2);
  }, [service]);

  // Auto‑reset on step 1
  useEffect(() => {
    if (step === 1) {
      setService("");
      setSelectedAreas([]);
      setQuantities({});
      setCarpets({});
      setAppliances({});
      setDiscountCode("");
      setDetails(INITIAL_DETAILS);
      setError(null);
    }
  }, [step]);

  // Fetch blocked times
  useEffect(() => {
    const fetchBlockedTimes = async () => {
      try {
        const res = await api.get("/api/blocked-times/");
        setBlockedDates(res.data.fully_blocked_dates || []);
        setPartiallyBlockedSlots(res.data.partially_blocked_slots || {});
      } catch (err) {
        console.error("Failed to fetch blocked times", err);
      }
    };
    fetchBlockedTimes();
  }, []);

  const snapshotPayload = useMemo(() => ({
    selected_areas: selectedAreas,
    quantities: {
      ...quantities, Carpets: carpets, Appliances: appliances,
      furnished_fee: furnishedFee, biohazard_fee: details.biohazard ? biohazardFee : 0,
      discount: discount ?? 0, booking_date: details.booking_date, timeslot: details.timeslot,
    },
    details,
  }), [selectedAreas, quantities, carpets, appliances, furnishedFee, biohazardFee, discount, details]);

  useAutoSnapshot(sessionId, snapshotPayload);

  const handleSubmit = async () => {
    // ... (unchanged from your current handleSubmit)
  };

  // If services are still loading, show a full‑screen loader once
  if (servicesLoading) {
    return (
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-pulse text-xl">Loading booking wizard...</div>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-red-900/30 p-6 rounded-xl text-center">
          <p>{servicesError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 rounded">Retry</button>
        </div>
      </div>
    );
  }

  // Render with all pre‑fetched data passed down
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      {/* Header (unchanged) */}
      <header className="flex-shrink-0 pt-6 pb-4 px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-20 shadow-md">
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center tracking-wide">
          DDEEP CLEANING SERVICES
        </h1>
        <p className="text-gray-400 text-center text-xs sm:text-sm mt-1">Step-by-step booking with instant pricing</p>
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-center shadow-lg animate-fade-in">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-0 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full pb-8">
          <WizardSteps
            step={step} service={service} setService={setService}
            selectedAreas={selectedAreas} setSelectedAreas={setSelectedAreas}
            quantities={quantities} setQuantities={setQuantities}
            carpets={carpets} setCarpets={setCarpets}
            appliances={appliances} setAppliances={setAppliances}
            details={details} setDetails={setDetails}
            discountCode={discountCode} setDiscountCode={setDiscountCode}
            totalQuote={finalTotal} setCanProceed={setCanProceed} handleSubmit={handleSubmit}
            blockedDates={blockedDates} partiallyBlockedSlots={partiallyBlockedSlots}
            // ✅ Pass pre‑filtered data
            cleaningServices={cleaningServices}
            areasServices={areasServices}
            carpetsServices={carpetsServices}
            appliancesServices={appliancesServices}
            allAreas={allAreas}
          />
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 lg:px-8 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-20 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto w-full">
          <WizardNavigation step={step} stepsOrder={stepsOrder} canProceed={canProceed} details={details} goNext={goNext} goPrev={goPrev} resetAll={resetAll} loading={loading} />
        </div>
      </footer>

      <BookingSuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
