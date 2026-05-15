// src/components/ReviewSummary.jsx
import React from "react";
import useQuoteCalculator from "../hooks/useQuoteCalculator";

export default function ReviewSummary({
  selectedAreas,
  quantities,
  carpets,
  appliances,
  furnished_status,
  biohazard,
  discountCode,
  setDiscountCode,
  hideDiscountInput = false,
}) {
  // Pulling the new structured data from our hook
  const { subtotal, fees, discount, finalTotal, breakdown, loading, error } =
    useQuoteCalculator({
      selectedAreas,
      quantities,
      carpets,
      appliances,
      details: {
        furnished_status,
        biohazard,
      },
      discountCode,
    });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Review Your Booking
      </h2>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
          Error: {error}
        </div>
      )}

      {/* ✅ Use the clean breakdown array from Django! */}
      <table className="w-full text-gray-200 mb-6 bg-black/60 rounded-xl overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">Item</th>
            <th className="px-4 py-3 text-center">Qty</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className={`transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
          {breakdown.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-4 py-4 text-center text-gray-400">
                No items selected yet.
              </td>
            </tr>
          ) : (
            breakdown.map((line, idx) => (
              <tr key={idx} className="border-t border-gray-800/50">
                <td className="px-4 py-3">{line.name}</td>
                <td className="px-4 py-3 text-center">{line.quantity || "-"}</td>
                {/* Dynamically color negative discounts vs positive charges */}
                <td className={`px-4 py-3 text-right ${line.total < 0 ? 'text-green-400' : ''}`}>
                  {line.total < 0 ? "-" : ""}£{Math.abs(line.total).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Quote Summary */}
      <div className="bg-black/60 p-4 rounded-xl text-white space-y-2">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal:</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>

        {fees > 0 && (
          <div className="flex justify-between text-yellow-400/90">
            <span>Additional Fees:</span>
            <span>+ £{fees.toFixed(2)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount Applied:</span>
            <span>− £{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold pt-3 mt-2 border-t border-gray-700">
          <span>Final Price:</span>
          <span>£{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Discount Code Input */}
      {!hideDiscountInput && (
        <div className="mt-6">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Enter discount code"
            className="bg-gray-800/60 text-white px-4 py-3 rounded-lg w-full max-w-xs outline-none border border-gray-600 focus:border-blue-500 transition-colors"
          />
          {discount > 0 && (
            <p className="text-green-400 mt-2 text-sm font-medium">Valid discount applied!</p>
          )}
        </div>
      )}
    </div>
  );
}
