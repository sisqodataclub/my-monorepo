import { useEffect, useRef, useCallback } from 'react';

export function useQuoteCalculator({ formData, enabled = true, onQuote }) {
  const lastPayload = useRef(null);
  const inflight = useRef(false);

  const runQuote = useCallback(async (payload) => {
    if (!payload || inflight.current) return;
    inflight.current = true;
    try {
      const res = await fetch('/api/quote/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Quote request failed');
      const data = await res.json();
      onQuote?.({ status: 'success', data });
    } catch (err) {
      onQuote?.({ status: 'error', error: err });
    } finally {
      inflight.current = false;
    }
  }, [onQuote]);

  useEffect(() => {
    if (!enabled) return;
    if (!formData) return;
    const serialized = JSON.stringify(formData);
    if (serialized === lastPayload.current) return;
    lastPayload.current = serialized;
    runQuote(formData);
  }, [formData, enabled, runQuote]);

  useEffect(() => {
    if (!enabled) return;
    const refire = () => {
      if (lastPayload.current) {
        lastPayload.current = null;
        runQuote(formData);
      }
    };
    const onVis = () => { if (document.visibilityState === 'visible') refire(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', refire);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', refire);
    };
  }, [enabled, formData, runQuote]);

  return { refire: () => runQuote(formData) };
}
