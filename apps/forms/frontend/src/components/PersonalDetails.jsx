import React from "react";
import GlassLayout from "./ui/GlassLayout";
import BookingDatePicker from "./ui/BookingDatePicker";
import TimeSlotSelector from "./ui/TimeSlotSelector";

/* ----------------------------------
   Reusable Input Field (Upgraded)
---------------------------------- */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  required = false,
  autoComplete, // ✅ Added for UX
}) => {
  const inputId = `field-${name}`; // ✅ Unique ID for accessibility

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={inputId} className="text-white font-medium mb-2">
        {label}
        {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        >
          <option value="" disabled>Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        />
      )}
    </div>
  );
};

/* ----------------------------------
   Main Component
---------------------------------- */
const PersonalDetails = ({ details, setDetails, blockedDates = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <GlassLayout title="Personal & Booking Details">
      
      {/* Date & Time Section (Full Width) */}
      <div className="mb-6 space-y-4 border-b border-gray-700/50 pb-6">
        <BookingDatePicker
          required
          value={details.booking_date || ""}
          holidays={blockedDates} // ✅ Pass dynamically from a higher level/API
          onChange={(data) =>
            setDetails((prev) => ({
              ...prev,
              ...data,
            }))
          }
        />

        <TimeSlotSelector
          required
          value={details.timeslot || ""}
          onChange={(slot) =>
            setDetails((prev) => ({
              ...prev,
              timeslot: slot,
            }))
          }
        />
      </div>

      {/* Personal Info Section (Responsive Grid) */}
      {/* ✅ md:grid-cols-2 places inputs side-by-side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <InputField
          label="Full Name"
          name="name"
          autoComplete="name"
          value={details.name || ""}
          onChange={handleChange}
          required
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={details.email || ""}
          onChange={handleChange}
          required
        />

        <InputField
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={details.phone || ""}
          onChange={handleChange}
          required
        />

        <InputField
          label="Payment Method"
          name="payment_method"
          type="select"
          value={details.payment_method || ""}
          onChange={handleChange}
          required
          options={[
            { value: "cash", label: "Cash" },
            { value: "bank_transfer", label: "Bank Transfer" },
          ]}
        />
      </div>

      <p className="text-sm text-gray-400 mt-2">
        <span className="text-red-400">*</span> indicates required fields
      </p>
    </GlassLayout>
  );
};

export default PersonalDetails;
