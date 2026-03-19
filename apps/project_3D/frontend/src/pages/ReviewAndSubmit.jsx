import React, { useState } from "react";
import api from "../api";
import useAutoSnapshot, { getSessionId } from "../hooks/useAutoSnapshot";

// -------------------------------------------------------------------
// ✅ SESSION ID FROM BROWSER PER TAB (sessionStorage)
// -------------------------------------------------------------------
const SESSION_ID = getSessionId();

const ReviewAndSubmit = ({ selectedAreas, quantities, details }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // -------------------------------------------------------------------
  // 🟦 CREATE SNAPSHOT OBJECT
  // -------------------------------------------------------------------
  const snapshotData = () => ({
    session_id: SESSION_ID,
    selected_areas: selectedAreas,
    quantities: quantities,
    details: details,
  });

  // -------------------------------------------------------------------
  // 🟦 USE AUTO SNAPSHOT HOOK
  // Automatically saves snapshot after 60s or on tab close
  // -------------------------------------------------------------------
  useAutoSnapshot(SESSION_ID, snapshotData());

  // -------------------------------------------------------------------
  // 🟦 SUBMIT FINAL BOOKING
  // -------------------------------------------------------------------
  const handleSubmit = () => {
    const booking = {
      session_id: SESSION_ID,
      name: details.name,
      email: details.email,
      phone: details.phone,
      furnished_status: details.furnished_status,
      parking: details.parking,
      selected_areas: selectedAreas,
      quantities: quantities,
    };

    setLoading(true);

    api
      .post("/api/bookings/", booking)
      .then((res) => {
        if (res.status === 201) {
          showToast("Booking submitted successfully!", "success");
        } else {
          showToast("Something went wrong.", "error");
        }
      })
      .catch(() => showToast("Submission failed.", "error"))
      .finally(() => setLoading(false));
  };

  // -------------------------------------------------------------------
  // 🟦 UI
  // -------------------------------------------------------------------
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Review Your Booking</h2>

      <h3 className="font-semibold mt-4">Selected Areas</h3>
      <ul>
        {selectedAreas.map((area) => (
          <li key={area}>
            {area} — {quantities[area] || 1} rooms
          </li>
        ))}
      </ul>

      <h3 className="font-semibold mt-4">Personal & Property Details</h3>
      <p><strong>Name:</strong> {details.name}</p>
      <p><strong>Email:</strong> {details.email}</p>
      <p><strong>Phone:</strong> {details.phone}</p>
      <p><strong>Furnished:</strong> {details.furnished_status}</p>
      <p><strong>Parking:</strong> {details.parking}</p>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Booking"}
      </button>

      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ReviewAndSubmit;
