// src/components/AreaSelection.jsx
import React, { useEffect, useState } from "react";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api";

const AreaSelection = ({ selectedAreas, setSelectedAreas, setCanProceed }) => {
  const [areaOptions, setAreaOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch service names from backend
  useEffect(() => {
    const fetchAreaNames = async () => {
      try {
        const services = await getServices();
        // Extract only the names (strings) from the API payload
        const names = services.map(service => service.name);
        setAreaOptions(names);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setError("Could not load areas. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchAreaNames();
  }, []);

  const handleToggle = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  // Enable "Next" button when at least one area is selected
  useEffect(() => {
    setCanProceed(selectedAreas.length > 0);
  }, [selectedAreas, setCanProceed]);

  if (loading) {
    return (
      <GlassLayout title="Select Areas" subtitle="Loading available areas...">
        <div className="text-white text-center py-8">Loading...</div>
      </GlassLayout>
    );
  }

  if (error) {
    return (
      <GlassLayout title="Select Areas" subtitle="Something went wrong">
        <div className="text-red-400 text-center py-8">{error}</div>
      </GlassLayout>
    );
  }

  if (areaOptions.length === 0) {
    return (
      <GlassLayout title="Select Areas" subtitle="No areas available">
        <div className="text-yellow-400 text-center py-8">
          No services found. Please check back later.
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout
      title="Select Areas to Clean"
      subtitle="Choose the rooms or areas you want us to clean. Multiple selections allowed."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {areaOptions.map((area) => {
          const active = selectedAreas.includes(area);
          return (
            <label
              key={area}
              className={`
                relative cursor-pointer select-none
                p-4 rounded-2xl
                flex items-center justify-between gap-3
                transition-all duration-300
                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-800/70 text-gray-200 hover:bg-gray-700"
                }
              `}
            >
              <span className="text-base sm:text-lg font-medium leading-snug">
                {area}
              </span>

              <input
                type="checkbox"
                checked={active}
                onChange={() => handleToggle(area)}
                className="w-5 h-5 accent-blue-400 cursor-pointer"
              />

              {active && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none bg-blue-400/20 blur-xl animate-pulse" />
              )}
            </label>
          );
        })}
      </div>
    </GlassLayout>
  );
};

export default AreaSelection;
