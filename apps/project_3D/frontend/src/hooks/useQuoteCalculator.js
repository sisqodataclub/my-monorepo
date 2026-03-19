// src/hooks/useQuoteCalculator.js
import { useMemo } from "react";
import { calculateQuote } from "../utils/calculateQuote";

export default function useQuoteCalculator({
  selectedAreas = [],
  quantities = {},
  carpets = {},
  appliances = {},
  details = {},
  discountCode = null,
}) {
  /**
   * 🔐 Normalize inputs so calculateQuote NEVER crashes
   */
  const safeSelectedAreas = Array.isArray(selectedAreas)
    ? selectedAreas
    : [];

  const safeQuantities =
    quantities && typeof quantities === "object"
      ? quantities
      : {};

  const safeCarpets =
    carpets && typeof carpets === "object"
      ? carpets
      : {};

  const safeAppliances =
    appliances && typeof appliances === "object"
      ? appliances
      : {};

  /**
   * 🧮 Base quote (areas, carpets, appliances)
   */
  const baseQuote = useMemo(() => {
    return calculateQuote(
      safeSelectedAreas,
      safeQuantities,
      safeCarpets,
      safeAppliances
    );
  }, [
    safeSelectedAreas,
    safeQuantities,
    safeCarpets,
    safeAppliances,
  ]);

  /**
   * ➕ Add-ons
   */
  const furnishedFee =
    details?.furnished_status === "furnished" ? 10 : 0;

  let biohazardFee = 0;
  if (details?.biohazard === "yes-human") biohazardFee = 25;
  if (details?.biohazard === "yes-animal") biohazardFee = 15;
  if (details?.biohazard === "yes-blood") biohazardFee = 40;

  /**
   * ➖ Discounts
   */
  const discount =
    discountCode === "SAVE10" ? 10 : 0;

  /**
   * 💰 Final total
   */
  const finalTotal =
    baseQuote + furnishedFee + biohazardFee - discount;

  return {
    baseQuote,
    finalTotal,
    furnishedFee,
    biohazardFee,
    discount,
  };
}
