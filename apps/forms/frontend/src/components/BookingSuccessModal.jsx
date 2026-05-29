// src/components/BookingSuccessModal.jsx
import React from "react";

export default function BookingSuccessModal({ show, onClose, type = "booking" }) {
  if (!show) return null;

  const isQuote = type === "quote";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-blue-500/30">
        {isQuote ? (
          <>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Quote Submitted! 📧
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Check your email – your requested quote has been submitted. We'll get back to you shortly.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Booking Confirmed! 🎉
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Your cleaning booking has been successfully submitted. You will receive a confirmation email shortly.
            </p>
          </>
        )}
        <div className="flex flex-col gap-3">
          <a
            href="https://www.ddeepcleaningservices.com/"
            className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Return to Homepage
          </a>
          <a
            href="https://api.ddeepcleaningservices.com/form"
            className="w-full text-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Make a New Booking
          </a>
          <button
            onClick={onClose}
            className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
