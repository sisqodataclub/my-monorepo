// filepath: /src/components/ReviewSummary.jsx
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
  // ----------------------------------
  // USE SAME CALCULATOR AS BOOKINGWIZARD
  // ----------------------------------
  const { baseQuote, furnishedFee, biohazardFee, discount, finalTotal } =
    useQuoteCalculator({
      selectedAreas,
      quantities,
      carpets,
      appliances,
      details: {
        furnished_status,
        biohazard,
      },
      discountCode, // ✅ discount logic included here
    });

  // ----------------------------------
  // BUILD SAME "quantities" SHAPE SENT
  // ----------------------------------
  const mergedItems = {
    ...quantities,
    ...carpets,
    ...appliances,
  };

  // ----------------------------------
  // RENDER
  // ----------------------------------
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Review Your Booking
      </h2>

      {/* Selected Areas & Quantities */}
      <table className="w-full text-gray-200 mb-6 bg-black/60 rounded-xl overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Item</th>
            <th className="px-4 py-2 text-right">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mergedItems).map(([key, value]) =>
            value > 0 ? (
              <tr key={key} className="border-t border-gray-700">
                <td className="px-4 py-2">{key.replace(/_/g, " ")}</td>
                <td className="px-4 py-2 text-right">{value}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {/* Property Details */}
      <div className="bg-gray-900/60 p-4 rounded-xl text-gray-300 mb-6">
        <p>
          <strong>Furnished:</strong> {furnished_status || "Not specified"}
        </p>
        <p>
          <strong>Biohazard:</strong> {biohazard || "No"}
        </p>
      </div>

      {/* Quote Summary */}
      <div className="bg-black/60 p-4 rounded-xl text-white space-y-2">
        <p>Base Total: £{baseQuote.toFixed(2)}</p>

        {furnishedFee > 0 && (
          <p>+ £{furnishedFee.toFixed(2)} Furnished Property Fee</p>
        )}

        {biohazardFee > 0 && (
          <p>+ £{biohazardFee.toFixed(2)} Biohazard Fee</p>
        )}

        {discount > 0 && (
          <p className="text-green-400">− £{discount.toFixed(2)} Discount</p>
        )}

        <p className="text-xl font-bold pt-2 border-t border-gray-700">
          Final Price: £{finalTotal.toFixed(2)}
        </p>
      </div>

      {/* Discount Code Input */}
      {!hideDiscountInput && (
        <div className="mt-4">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter discount code"
            className="bg-gray-800/60 text-white px-4 py-3 rounded-lg w-full max-w-xs outline-none border border-gray-600"
          />
          {discount > 0 && (
            <p className="text-green-400 mt-2">Discount applied!</p>
          )}
        </div>
      )}
    </div>
  );
}
