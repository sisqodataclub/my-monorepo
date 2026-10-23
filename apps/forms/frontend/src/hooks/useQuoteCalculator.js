import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useQuoteCalculator
 *
 * Fixes the booking-summary first-load bug:
 *  - Fires the quote request immediately on mount when a service is
 *    already selected (previously waited for a user interaction).
 *  - Exposes explicit loading / error / empty states so the summary
 *    component can gate its render instead of flashing stale data.
 *  - Guards against out-of-order responses with a request id.
 */
export default function useQuoteCalculator({ serviceId, answers, enabled = true }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const fetchQuote = useCallback(async () => {
    if (!enabled || !serviceId) {
      setQuote(null);
      setLoading(false);
      setError(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/forms/quote/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceId, answers: answers || {} }),
      });

      if (!res.ok) {
        throw new Error(`Quote request failed (${res.status})`);
      }

      const data = await res.json();

      // Ignore stale responses.
      if (requestId !== requestIdRef.current) return;

      setQuote(data);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : 'Unable to calculate quote');
      setQuote(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [serviceId, answers, enabled]);

  // Immediate fire on mount / when inputs change — no user interaction needed.
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return {
    quote,
    loading,
    error,
    isEmpty: !loading && !error && !quote,
    refetch: fetchQuote,
  };
}
