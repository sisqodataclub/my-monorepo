// src/components/AreaSelection.jsx
import React, { useEffect, useState } from "react";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api"; 

const AreaSelection = ({ selectedAreas, setSelectedAreas, setCanProceed }) => {
  const [areaOptions, setAreaOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const allFetchedAreas = await getServices("?category_name=areas");

        const bulletproofAreas = allFetchedAreas.filter((service) => {
          const name1 = service.category_name || "";
          const name2 = service.category_detail?.name || "";

          return (
            name1.toLowerCase().trim() === "areas" ||
            name2.toLowerCase().trim() === "areas"
          );
        });

        setAreaOptions(bulletproofAreas);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setError("Could not load areas. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // ✅ FIX: Now accepts and toggles the ID instead of the Name
  const handleToggle = (areaId) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
  };

  useEffect(() => {
    setCanProceed(selectedAreas.length > 0);
  }, [selectedAreas, setCanProceed]);

  if (loading) {
    return (
      <GlassLayout title="Select Areas" subtitle="Loading available areas...">
        <div className="text-white text-center py-8 animate-pulse">Loading...</div>
      </GlassLayout>
    );
  }

  if (error) {
    return (
      <GlassLayout title="Select Areas" subtitle="Something went wrong">
        <div className="text-red-400 text-center py-8 bg-red-900/20 rounded-lg border border-red-500/30">
          {error}
        </div>
      </GlassLayout>
    );
  }

  if (areaOptions.length === 0) {
    return (
      <GlassLayout title="Select Areas" subtitle="No areas available">
        <div className="text-yellow-400 text-center py-8">
          No areas found. Please check back later.
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
          // ✅ FIX: Check if the selectedAreas array includes this specific area.id
          const active = selectedAreas.includes(area.id);

          return (
            <label
              key={area.id}
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
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-medium leading-snug">
                  {area.name}
                </span>
                
                {area.priceFixed && (
                  <span className={`text-xs mt-0.5 ${active ? 'text-blue-200' : 'text-gray-400'}`}>
                    +£{area.priceFixed}
                  </span>
                )}
              </div>

              <input
                type="checkbox"
                checked={active}
                // ✅ FIX: Pass the ID to the toggle function
                onChange={() => handleToggle(area.id)}
                className="w-5 h-5 accent-blue-400 cursor-pointer relative z-10"
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
