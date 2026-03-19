import { useEffect, useRef } from "react";
import api from "../api";

export function getSessionId() {
  let id = sessionStorage.getItem("browser_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("browser_session_id", id);
  }
  return id;
}

export default function useAutoSnapshot(sessionId, data) {
  const lastSentSnapshot = useRef(null);

  // Build snapshot for quantities (flattened)
  const buildSnapshotQuantities = () => {
    const q = data.quantities || {};
    const out = {};

    // Normal areas (non-sized)
    Object.entries(q).forEach(([name, qty]) => {
      if (!name.includes("_")) out[name] = qty;
    });

    // Sized areas flattened
    ["Kitchen", "Bedroom"].forEach(area => {
      out[`${area}_Small`] = q[`${area}_Small`] ?? 0;
      out[`${area}_Medium`] = q[`${area}_Medium`] ?? 0;
      out[`${area}_Large`] = q[`${area}_Large`] ?? 0;
    });

    // Carpets
    if (q.Carpets) {
      Object.entries(q.Carpets).forEach(([k, v]) => {
        out[k] = v;
      });
    }

    // Appliances
    if (q.Appliances) {
      Object.entries(q.Appliances).forEach(([k, v]) => {
        out[k] = v;
      });
    }

    return out;
  };

  // Build selected areas (grouped)
  const buildSelectedAreas = () => {
    const q = data.quantities || {};
    const selected = data.selected_areas || [];

    // Normal areas
    const normalAreas = {};
    selected
      .filter(area => !["Kitchen", "Bedroom"].includes(area))
      .forEach(area => {
        normalAreas[area] = q[area] ?? 1;
      });

    // Sized areas grouped correctly
    const sizedAreas = {};
    ["Kitchen", "Bedroom"].forEach(area => {
      if (selected.includes(area)) {
        sizedAreas[area] = {
          Small: q[`${area}_Small`] ?? 0,
          Medium: q[`${area}_Medium`] ?? 0,
          Large: q[`${area}_Large`] ?? 0,
        };
      }
    });

    return {
      ...normalAreas,
      ...sizedAreas,
      Carpets: q.Carpets || {},
      Appliances: q.Appliances || {},
    };
  };

  const buildSnapshotPayload = () => ({
    session_id: sessionId,
    ...data,
    selected_areas: buildSelectedAreas(),
    quantities: buildSnapshotQuantities(),
  });

  // Save snapshot locally
  useEffect(() => {
    sessionStorage.setItem(
      `snapshot_${sessionId}`,
      JSON.stringify(buildSnapshotPayload())
    );
  }, [data, sessionId]);

  const sendSnapshot = async (isSync = false) => {
    const payload = buildSnapshotPayload();
    const current = JSON.stringify(payload);

    if (current === lastSentSnapshot.current) return;
    lastSentSnapshot.current = current;

    if (isSync) {
      const blob = new Blob([current], { type: "application/json" });
      navigator.sendBeacon("/api/booking-snapshots/", blob);
      return;
    }

    try {
      await api.post("/api/booking-snapshots/", payload);
      console.log("Snapshot uploaded.");
    } catch (err) {
      console.warn("Snapshot failed:", err);
    }
  };

  // Interval send
  useEffect(() => {
    const i = setInterval(() => sendSnapshot(false), 20000);
    return () => clearInterval(i);
  }, [data]);

  // Page hide
  useEffect(() => {
    const handler = () => {
      const payload = buildSnapshotPayload();
      sessionStorage.setItem(
        `snapshot_${sessionId}`,
        JSON.stringify(payload)
      );
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/booking-snapshots/", blob);
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [data, sessionId]);
}
