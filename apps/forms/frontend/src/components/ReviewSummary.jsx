import { useMemo } from 'react';

export default function ReviewSummary({ quote, loading, error }) {
  const summary = useMemo(() => {
    if (!quote) return null;
    return {
      total: quote.total ?? quote.amount ?? 0,
      currency: quote.currency ?? 'GBP',
      items: quote.items ?? quote.lineItems ?? [],
    };
  }, [quote]);

  if (loading) {
    return (
      <div className="review-summary review-summary--loading" aria-busy="true">
        <p>Calculating your quote…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-summary review-summary--error" role="alert">
        <p>We couldn't load your quote summary. Please try again.</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="review-summary">
      <h2>Review</h2>
      {summary.items.length > 0 && (
        <ul className="review-summary__items">
          {summary.items.map((item, i) => (
            <li key={i} className="review-summary__item">
              <span className="review-summary__label">{item.label ?? item.name}</span>
              <span className="review-summary__value">
                {summary.currency} {Number(item.amount ?? item.price ?? 0).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="review-summary__total">
        <span>Total</span>
        <strong>
          {summary.currency} {Number(summary.total).toFixed(2)}
        </strong>
      </div>
    </div>
  );
}
