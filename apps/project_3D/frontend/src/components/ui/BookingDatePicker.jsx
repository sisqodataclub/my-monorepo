// src/components/ui/BookingDatePicker.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Convert strings to Date objects
const parseDates = (dates) => dates.map((d) => new Date(d));

const BookingDatePicker = ({
  value = "",
  onChange,
  required = true,
  holidays = [],
}) => {
  const today = new Date();

  // Fixed unavailable dates
  const blockedDates = parseDates([
    ...holidays,
    "2026-01-10",
    "2026-01-11",
    "2026-01-15",
  ]);

  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="flex flex-col mb-4">
      <label className="text-white font-medium mb-2">
        Booking Date
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => onChange({ booking_date: date.toISOString().split("T")[0] })}
        minDate={today}
        excludeDates={blockedDates} // ⬅ blocked dates completely disabled
        placeholderText="Select a booking date"
        className="bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 w-full"
        required={required}
      />

      
    </div>
  );
};

export default BookingDatePicker;
