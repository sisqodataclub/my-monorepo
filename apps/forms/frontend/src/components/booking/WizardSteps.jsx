// src/components/booking/WizardSteps.jsx
import React, { useState } from "react";

import ServiceSelector from "../ServiceSelector";
import AreaSelection from "../AreaSelection";
import QuantitySelection from "../QuantitySelection";
import AppliancesCleaningSelector from "../AppliancesCleaningSelector";
import CleaningSelector from "../CarpetCleaningSelector";
import PropertyDetails from "../PropertyDetails";
import ReviewSummary from "../ReviewSummary";
import PersonalDetails from "../PersonalDetails";

const SIZED_AREAS = ["Kitchen", "Bedroom"];

export default function WizardSteps({
  step,
  service,
  setService,
  selectedAreas,
  setSelectedAreas,
  quantities,
  setQuantities,
  carpets,
  setCarpets,
  appliances,
  setAppliances,
  details,
  setDetails,
  discountCode,
  setDiscountCode,
  totalQuote,
  setCanProceed,
  handleSubmit,
  blockedDates, // ✅ 1. Receive blockedDates prop
  partiallyBlockedSlots, // ✅ 2. Receive partiallyBlockedSlots prop
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOnce = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    handleSubmit();
  };

  switch (step) {
    case 1:
      return <ServiceSelector value={service} setValue={setService} />;

    case 2:
      return (
        <AreaSelection
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          setCanProceed={setCanProceed}
        />
      );

    case 3:
      return (
        <QuantitySelection
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          quantities={quantities}
          setQuantities={setQuantities}
        />
      );

    case 4:
      return (
        <AppliancesCleaningSelector
          values={appliances}
          setValues={setAppliances}
        />
      );

    case 5:
      return <CleaningSelector values={carpets} setValues={setCarpets} />;

    case 6:
      return <PropertyDetails details={details} setDetails={setDetails} />;

    case 7:
      return (
        <ReviewSummary
          selectedAreas={selectedAreas}
          quantities={quantities}
          carpets={carpets}
          appliances={appliances}
          SIZED_AREAS={SIZED_AREAS}
          furnished_status={details.furnished_status}
          biohazard={details.biohazard}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
        />
      );

    case 8:
      return (
        <PersonalDetails 
          details={details} 
          setDetails={setDetails} 
          blockedDates={blockedDates} // ✅ 3. Pass data to PersonalDetails
          partiallyBlockedSlots={partiallyBlockedSlots} // ✅ 4. Pass data to PersonalDetails
        />
      );

    case 9:
      return (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Final Confirmation
          </h2>

          <ReviewSummary
            selectedAreas={selectedAreas}
            quantities={quantities}
            carpets={carpets}
            appliances={appliances}
            SIZED_AREAS={SIZED_AREAS}
            furnished_status={details.furnished_status}
            biohazard={details.biohazard}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            hideDiscountInput
          />

          <div className="mt-6">
            <button
              onClick={submitOnce}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl text-white transition ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Processing…" : "Submit Booking"}
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
