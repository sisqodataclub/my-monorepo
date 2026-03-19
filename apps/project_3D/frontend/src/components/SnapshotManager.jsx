// src/components/SnapshotManager.jsx
import { useEffect } from "react";
import api from "../api";

const getSessionId = () => {
  let id = localStorage.getItem("booking_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("booking_session_id", id);
  }
  return id;
};

const SESSION_ID = getSessionId();

export default function SnapshotManager({ selectedAreas, quantities, details }) {
  const snapshotData = () => ({
    session_id: SESSION_ID,
    selected_areas: selectedAreas,
    quantities: quantities,
    details: details,
  });

  const saveSnapshot = async () => {
    try {
      await api.post("/api/booking-snapshots/", snapshotData(), {
        headers: { Authorization: "" },
      });
      console.log("Snapshot saved");
    } catch (err) {
      console.error("Snapshot save error:", err.response?.data || err);
    }
  };

  // save anytime form changes
  useEffect(() => {
    saveSnapshot();
  }, [selectedAreas, quantities, details]);

  // save every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveSnapshot();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // save on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      const blob = new Blob([JSON.stringify(snapshotData())], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/booking-snapshots/", blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedAreas, quantities, details]);

  return null; // this component displays nothing
}

export { SESSION_ID };
