// src/components/ui/TimeSlotSelector.jsx
import React from "react";

const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

const TimeSlotSelector = ({
  value = "",
  onChange,
  required = false,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-white font-medium mb-2">
        Time Slot
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500"
      >
        <option value="">Select time slot...</option>
        {TIME_SLOTS.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelector;
