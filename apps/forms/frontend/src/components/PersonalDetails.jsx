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
  autoComplete,
  placeholder,
  pattern,
  maxLength,
  className = "",
}) => {
  const inputId = `field-${name}`;

  // Unified styling for inputs, selects, and textareas
  const baseInputStyles =
    "bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-full placeholder-gray-500";

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label htmlFor={inputId} className="text-white font-medium mb-2 text-sm tracking-wide">
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
          className={baseInputStyles}
        >
          <option value="" disabled>Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          rows="3"
          className={`${baseInputStyles} resize-none`}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          pattern={pattern}
          maxLength={maxLength}
          className={baseInputStyles}
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
    let { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <GlassLayout title="Personal & Booking Details">

      {/* 1. Date & Time Section */}
      <div className="mb-8 space-y-4 border-b border-gray-700/50 pb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">1. When do you need us?</h3>
        <BookingDatePicker
          required
          value={details.booking_date || ""}
          holidays={blockedDates}
          onChange={(data) =>
            setDetails((prev) => ({ ...prev, ...data }))
          }
        />
        <TimeSlotSelector
          required
          value={details.timeslot || ""}
          onChange={(slot) =>
            setDetails((prev) => ({ ...prev, timeslot: slot }))
          }
        />
      </div>

      {/* 2. Contact Section (Grid Layout) */}
      <div className="mb-8 border-b border-gray-700/50 pb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">2. Your Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InputField
            label="Full Name"
            name="name"
            autoComplete="name"
            placeholder="e.g. John Doe"
            value={details.name || ""}
            onChange={handleChange}
            required
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="e.g. name@example.com"
            value={details.email || ""}
            onChange={handleChange}
            required
          />

          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 07700 900000"
            value={details.phone || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* 3. Payment Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-4">3. Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InputField
            label="Payment Method"
            name="payment_method"
            type="select"
            value={details.payment_method || ""}
            onChange={handleChange}
            required
            options={[
              { value: "cash", label: "Cash on the day" },
              { value: "bank_transfer", label: "Bank Transfer" },
            ]}
          />
        </div>
      </div>

    </GlassLayout>
  );
};

export default PersonalDetails;
