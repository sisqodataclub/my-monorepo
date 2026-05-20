// src/hooks/useQuoteCalculator.js
import { useState, useEffect } from "react";
import { calculateQuoteFromApi } from "../lib/api";

export default function useQuoteCalculator({
  selectedAreas = [],
  quantities = {},
  carpets = {},
  appliances = {},
  details = {},
  discountCode = null,
}) {
  const [quote, setQuote] = useState({
    subtotal: 0,
    fees: 0,
    discount: 0,
    finalTotal: 0,
    breakdown: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchSecureQuote = async () => {
      setQuote((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // 1. Build the items array ONLY from quantities, carpets, and appliances.
        //    All area selections (including normal areas) are already stored in `quantities`
        //    with their default quantity = 1, so we don't need `selectedAreas` at all.
        const items = [];

        const processDict = (dict) => {
          Object.entries(dict).forEach(([id, qty]) => {
            if (qty > 0) {
              const parsedId = parseInt(id, 10);
              if (!isNaN(parsedId)) {
                items.push({ service_id: parsedId, quantity: qty });
              }
            }
          });
        };

        processDict(quantities);
        processDict(carpets);
        processDict(appliances);

        // ✅ Removed the selectedAreas loop – it was causing duplicates.

        if (items.length === 0) {
          setQuote({
            subtotal: 0, fees: 0, discount: 0, finalTotal: 0,
            breakdown: [], loading: false, error: null,
          });
          return;
        }

        // 2. Format payload for Django calculate_quote endpoint
        const payload = {
          items: items,
          furnished_status: details?.furnished_status || null,
          biohazard: details?.biohazard || null,
          discount_code: discountCode || null,
        };

        const data = await calculateQuoteFromApi(payload);

        setQuote({
          subtotal: data.subtotal || 0,
          fees: data.fees || 0,
          discount: data.discount || 0,
          finalTotal: data.total || 0,
          breakdown: data.breakdown || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Failed to calculate quote securely:", error);
        setQuote((prev) => ({ ...prev, loading: false, error: error.message }));
      }
    };

    const timeoutId = setTimeout(fetchSecureQuote, 300);
    return () => clearTimeout(timeoutId);
  }, [
    // ✅ Removed selectedAreas from dependencies – it no longer affects the calculation.
    JSON.stringify(quantities),
    JSON.stringify(carpets),
    JSON.stringify(appliances),
    JSON.stringify(details),
    discountCode,
  ]);

  return quote;
}
