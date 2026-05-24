// src/components/booking/WizardNavigation.jsx

export default function WizardNavigation({
    step,
    stepsOrder = [],        // 🛡️ safety default
    canProceed = true,      // 🛡️ safety default
    details = {},           // 🛡️ safety default
    goNext,
    goPrev,
    resetAll,
  }) {
    // 🛡️ Guard against undefined stepsOrder
    if (!Array.isArray(stepsOrder) || stepsOrder.length === 0) {
      return null;
    }

    const stepIndex = stepsOrder.indexOf(step);

    const isLast = stepIndex === stepsOrder.length - 1;
    const isSecondLast = stepIndex === stepsOrder.length - 2;

    // 🛡️ Safe access to details fields
    const disabled =
      (step === 2 && !canProceed) ||
      (step === 6 && !details?.furnished_status) ||
      (step === 8 &&
        (!details?.name ||
          !details?.email ||
          /* ✅ Removed !details?.phone so it's no longer mandatory */
          !details?.payment_method));

    return (
      <div className="mt-6 flex justify-between gap-4">
        {/* ⬅ Previous */}
        {stepIndex > 0 && (
          <button
            onClick={goPrev}
            className="bg-blue-600 px-4 py-2 rounded-lg text-white"
          >
            ⬅ Previous
          </button>
        )}

        {/* ⟳ Reset */}
        <button
          onClick={resetAll}
          className="bg-yellow-500 px-4 py-2 rounded-lg text-white"
        >
          ⟳ Reset
        </button>

        {/* ➡ Next / Book (hide on first + last step) */}
        {stepIndex > 0 && !isLast && (
          <button
            onClick={goNext}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg text-white transition ${
              disabled
                ? "bg-gray-500 cursor-not-allowed"
                : isSecondLast
                ? "bg-green-600 hover:bg-green-500"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSecondLast ? "Email Quote ✔" : "Next ➡"}
          </button>
        )}
      </div>
    );
  }
