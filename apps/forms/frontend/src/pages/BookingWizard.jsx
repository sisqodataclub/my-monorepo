// src/pages/BookingWizard.jsx
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quote_id");

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

  // Build a map from area name to service ID
  const areaNameToId = useMemo(() => {
    const map = {};
    allAreas.forEach(area => {
      map[area.name] = area.id;
    });
    return map;
  }, [allAreas]);

  // Step flow
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

  // Scroll to top on step change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  // ✅ CORRECTED handleSubmit – includes variation IDs regardless of selectedAreas
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

    const getId = (name) => areaNameToId[name];

    // Process sized areas – directly use variation quantities
    SIZED_AREAS.forEach(area => {
      const sizes = ["Small", "Medium", "Large"];
      sizes.forEach(size => {
        const variationName = `${area}_${size}`;
        const varId = getId(variationName);
        if (varId && (quantities[varId] || 0) > 0) {
          sizedAreas[varId] = quantities[varId];
        }
      });
    });

    // Process normal areas (non‑sized)
    const normalQuantities = {};
    normalAreas.forEach(area => {
      const areaId = getId(area);
      if (areaId && (quantities[areaId] || 0) > 0) {
        normalQuantities[areaId] = quantities[areaId];
      } else {
        // Fallback – should not happen
        normalQuantities[area] = quantities[area] ?? 1;
      }
    });

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
        items_breakdown: breakdown,
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
        setSessionId(regenerateSessionId());
      }
    } catch (err) {
      console.error("Booking Error:", err);
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        const firstKey = Object.keys(backendErrors)[0];
        const firstMessage = Array.isArray(backendErrors[firstKey])
          ? backendErrors[firstKey][0]
          : backendErrors[firstKey];
        setError(`${firstKey.charAt(0).toUpperCase() + firstKey.slice(1)}: ${firstMessage}`);
      } else {
        setError("Failed to process your booking. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // RENDER: Skeleton Loader
  // -----------------------------------------------------
  if (servicesLoading) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Tighter Skeleton Header */}
          <header className="pt-4 pb-3 px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex flex-col items-center">
            <div className="h-6 bg-gray-800 rounded w-64 sm:w-80 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-800 rounded w-48 sm:w-64 animate-pulse"></div>
          </header>
          <main className="p-3 sm:p-4 lg:p-6">
            <div className="max-w-3xl mx-auto w-full pb-4">
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4 sm:p-5 animate-pulse">
                <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-14 sm:h-16 bg-gray-700/50 rounded-xl w-full"></div>
                  <div className="h-14 sm:h-16 bg-gray-700/50 rounded-xl w-full"></div>
                  <div className="h-14 sm:h-16 bg-gray-700/50 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <footer className="flex-shrink-0 p-3 lg:px-6 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto w-full flex justify-between">
            <div className="h-10 bg-gray-800 rounded-lg w-20 sm:w-28 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded-lg w-20 sm:w-28 animate-pulse"></div>
          </div>
        </footer>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="h-[100dvh] w-full bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-red-900/30 p-6 rounded-xl text-center">
          <p>{servicesError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 rounded">Retry</button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // RENDER: Main Application
  // -----------------------------------------------------
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Tighter Header Padding */}
        <header className="pt-4 pb-3 px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <h1 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center tracking-wide">
            DDEEP CLEANING SERVICES
          </h1>
          <p className="text-gray-400 text-center text-[11px] sm:text-xs mt-1">Step-by-step booking with instant pricing</p>
          {error && (
            <div className="mt-3 bg-red-500/10 border border-red-500/50 text-red-200 px-3 py-1.5 rounded-lg text-center shadow-lg animate-fade-in">
              <p className="font-semibold text-xs sm:text-sm">{error}</p>
            </div>
          )}
        </header>
        
        {/* Tighter Main Layout Padding */}
        <main className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-3xl mx-auto w-full pb-2">
            <WizardSteps
              step={step} service={service} setService={setService}
              selectedAreas={selectedAreas} setSelectedAreas={setSelectedAreas}
              quantities={quantities} setQuantities={setQuantities}
              carpets={carpets} setCarpets={setCarpets}
              appliances={appliances} setAppliances={setAppliances}
              details={details} setDetails={setDetails}
              discountCode={discountCode} setDiscountCode={setDiscountCode}
              totalQuote={finalTotal} setCanProceed={setCanProceed}
              handleSubmit={handleSubmit}
              blockedDates={blockedDates} partiallyBlockedSlots={partiallyBlockedSlots}
              cleaningServices={cleaningServices}
              areasServices={areasServices}
              carpetsServices={carpetsServices}
              appliancesServices={appliancesServices}
              allAreas={allAreas}
              loading={loading}
            />
          </div>
        </main>
      </div>
      
      {/* Tighter Footer Padding */}
      <footer className="flex-shrink-0 p-3 lg:px-6 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto w-full">
          <WizardNavigation step={step} stepsOrder={stepsOrder} canProceed={canProceed} details={details} goNext={goNext} goPrev={goPrev} resetAll={resetAll} loading={loading} />
        </div>
      </footer>
      <BookingSuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}// src/pages/BookingWizard.jsx
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quote_id");

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

  // Build a map from area name to service ID
  const areaNameToId = useMemo(() => {
    const map = {};
    allAreas.forEach(area => {
      map[area.name] = area.id;
    });
    return map;
  }, [allAreas]);

  // Step flow
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

  // Scroll to top on step change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  // ✅ CORRECTED handleSubmit – includes variation IDs regardless of selectedAreas
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

    const getId = (name) => areaNameToId[name];

    // Process sized areas – directly use variation quantities
    SIZED_AREAS.forEach(area => {
      const sizes = ["Small", "Medium", "Large"];
      sizes.forEach(size => {
        const variationName = `${area}_${size}`;
        const varId = getId(variationName);
        if (varId && (quantities[varId] || 0) > 0) {
          sizedAreas[varId] = quantities[varId];
        }
      });
    });

    // Process normal areas (non‑sized)
    const normalQuantities = {};
    normalAreas.forEach(area => {
      const areaId = getId(area);
      if (areaId && (quantities[areaId] || 0) > 0) {
        normalQuantities[areaId] = quantities[areaId];
      } else {
        // Fallback – should not happen
        normalQuantities[area] = quantities[area] ?? 1;
      }
    });

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
        items_breakdown: breakdown,
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
        setSessionId(regenerateSessionId());
      }
    } catch (err) {
      console.error("Booking Error:", err);
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        const firstKey = Object.keys(backendErrors)[0];
        const firstMessage = Array.isArray(backendErrors[firstKey])
          ? backendErrors[firstKey][0]
          : backendErrors[firstKey];
        setError(`${firstKey.charAt(0).toUpperCase() + firstKey.slice(1)}: ${firstMessage}`);
      } else {
        setError("Failed to process your booking. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // RENDER: Skeleton Loader
  // -----------------------------------------------------
  if (servicesLoading) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Tighter Skeleton Header */}
          <header className="pt-4 pb-3 px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex flex-col items-center">
            <div className="h-6 bg-gray-800 rounded w-64 sm:w-80 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-800 rounded w-48 sm:w-64 animate-pulse"></div>
          </header>
          <main className="p-3 sm:p-4 lg:p-6">
            <div className="max-w-3xl mx-auto w-full pb-4">
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4 sm:p-5 animate-pulse">
                <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-14 sm:h-16 bg-gray-700/50 rounded-xl w-full"></div>
                  <div className="h-14 sm:h-16 bg-gray-700/50 rounded-xl w-full"></div>
                  <div className="h-14 sm:h-16 bg-gray-700/50 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <footer className="flex-shrink-0 p-3 lg:px-6 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto w-full flex justify-between">
            <div className="h-10 bg-gray-800 rounded-lg w-20 sm:w-28 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded-lg w-20 sm:w-28 animate-pulse"></div>
          </div>
        </footer>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="h-[100dvh] w-full bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-red-900/30 p-6 rounded-xl text-center">
          <p>{servicesError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 rounded">Retry</button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // RENDER: Main Application
  // -----------------------------------------------------
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Tighter Header Padding */}
        <header className="pt-4 pb-3 px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <h1 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center tracking-wide">
            DDEEP CLEANING SERVICES
          </h1>
          <p className="text-gray-400 text-center text-[11px] sm:text-xs mt-1">Step-by-step booking with instant pricing</p>
          {error && (
            <div className="mt-3 bg-red-500/10 border border-red-500/50 text-red-200 px-3 py-1.5 rounded-lg text-center shadow-lg animate-fade-in">
              <p className="font-semibold text-xs sm:text-sm">{error}</p>
            </div>
          )}
        </header>
        
        {/* Tighter Main Layout Padding */}
        <main className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-3xl mx-auto w-full pb-2">
            <WizardSteps
              step={step} service={service} setService={setService}
              selectedAreas={selectedAreas} setSelectedAreas={setSelectedAreas}
              quantities={quantities} setQuantities={setQuantities}
              carpets={carpets} setCarpets={setCarpets}
              appliances={appliances} setAppliances={setAppliances}
              details={details} setDetails={setDetails}
              discountCode={discountCode} setDiscountCode={setDiscountCode}
              totalQuote={finalTotal} setCanProceed={setCanProceed}
              handleSubmit={handleSubmit}
              blockedDates={blockedDates} partiallyBlockedSlots={partiallyBlockedSlots}
              cleaningServices={cleaningServices}
              areasServices={areasServices}
              carpetsServices={carpetsServices}
              appliancesServices={appliancesServices}
              allAreas={allAreas}
              loading={loading}
            />
          </div>
        </main>
      </div>
      
      {/* Tighter Footer Padding */}
      <footer className="flex-shrink-0 p-3 lg:px-6 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto w-full">
          <WizardNavigation step={step} stepsOrder={stepsOrder} canProceed={canProceed} details={details} goNext={goNext} goPrev={goPrev} resetAll={resetAll} loading={loading} />
        </div>
      </footer>
      <BookingSuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
