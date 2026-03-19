import React from "react";
import GlassLayout from "./ui/GlassLayout";
import BookingDatePicker from "./ui/BookingDatePicker";
import TimeSlotSelector from "./ui/TimeSlotSelector";

/* ----------------------------------
   Reusable Input Field
---------------------------------- */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  required = false,
}) => (
  <div className="flex flex-col mb-4">
    <label className="text-white font-medium mb-2">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>

    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500"
      />
    )}
  </div>
);

/* ----------------------------------
   Main Component
---------------------------------- */
const PersonalDetails = ({ details, setDetails }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <GlassLayout title="Personal & Booking Details">
      {/* Booking Date */}
      <BookingDatePicker
        required
        value={details.booking_date || ""}
        holidays={["2026-01-11", "2026-01-25"]}
        onChange={(data) =>
          setDetails((prev) => ({
            ...prev,
            ...data,
          }))
        }
      />

      {/* Time Slot */}
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

      {/* Name */}
      <InputField
        label="Full Name"
        name="name"
        value={details.name || ""}
        onChange={handleChange}
        required
      />

      {/* Email */}
      <InputField
        label="Email"
        name="email"
        type="email"
        value={details.email || ""}
        onChange={handleChange}
        required
      />

      {/* Phone */}
      <InputField
        label="Phone"
        name="phone"
        type="tel"
        value={details.phone || ""}
        onChange={handleChange}
        required
      />

      {/* Payment */}
      <InputField
        label="Payment Method"
        name="payment_method"
        type="select"
        value={details.payment_method || ""}
        onChange={handleChange}
        required
        options={[
          { value: "cash", label: "Cash" },
          { value: "card", label: "Card" },
          { value: "bank_transfer", label: "Bank Transfer" },
        ]}
      />

      <p className="text-sm text-gray-400 mt-3">
        <span className="text-red-400">*</span> indicates required fields
      </p>
    </GlassLayout>
  );
};

export default PersonalDetails;
