// src/hooks/useQuoteCalculator.js
import { useState, useEffect, useRef } from "react";
import { calculateQuoteFromApi } from "../lib/api";

// Simple in-memory cache to prevent redundant API calls during navigation
const quoteCache = new Map();

// Helper to create a predictable string key from the payload
const getCacheKey = (payload) => JSON.stringify(payload);

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
  
  // Timer reference for debouncing
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing timer if the user makes another change quickly
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Build the items array
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

    // Map selectedAreas (if they are numeric IDs)
    selectedAreas.forEach((areaId) => {
      const parsedId = parseInt(areaId, 10);
      if (!isNaN(parsedId)) {
        items.push({ service_id: parsedId, quantity: 1 });
      }
    });

    const payload = {
      items,
      furnished_status: details?.furnished_status || null,
      biohazard: details?.biohazard || null,
      discount_code: discountCode || null,
    };

    // If no items are selected, reset and skip the API call entirely
    if (items.length === 0) {
      setQuote({
        subtotal: 0, fees: 0, discount: 0, finalTotal: 0,
        breakdown: [], loading: false, error: null,
      });
      return;
    }

    // Set loading state immediately so UI can show skeletons if needed
    setQuote((prev) => ({ ...prev, loading: true, error: null }));

    const cacheKey = getCacheKey(payload);
    const cached = quoteCache.get(cacheKey);
    
    // If we've seen this exact combination of selections before, use memory!
    if (cached) {
      setQuote({ ...cached, loading: false });
      return;
    }

    // Delay the API call by 500ms (Debounce)
    timerRef.current = setTimeout(async () => {
      try {
        const data = await calculateQuoteFromApi(payload);
        const newQuote = {
          subtotal: data.subtotal || 0,
          fees: data.fees || 0,
          discount: data.discount || 0,
          finalTotal: data.total || 0,
          breakdown: data.breakdown || [],
          loading: false,
          error: null,
        };
        
        // Save the result to our memory cache
        quoteCache.set(cacheKey, newQuote);
        setQuote(newQuote);
      } catch (error) {
        console.error("Failed to calculate quote securely:", error);
        setQuote((prev) => ({ ...prev, loading: false, error: error.message }));
      }
    }, 500); // 500ms wait period

    // Cleanup function
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    
  // Stringify dependencies to prevent infinite re-render loops on object identity checks
  }, [
    JSON.stringify(selectedAreas),
    JSON.stringify(quantities),
    JSON.stringify(carpets),
    JSON.stringify(appliances),
    JSON.stringify(details),
    discountCode,
  ]);

  return quote;
}
