// src/components/AreaSelection.jsx
import React, { useEffect, useState } from "react";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api"; // ✅ Using our newly upgraded helper!

const AreaSelection = ({ selectedAreas, setSelectedAreas, setCanProceed }) => {
  const [areaOptions, setAreaOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        // ✅ 1. Let the backend do the heavy filtering via query string
        // ✅ 2. The pagination loop in api.js will automatically grab ALL pages
        const allFetchedAreas = await getServices("?category_name=areas");
        
        // ✅ 3. Strict frontend fallback just to be bulletproof against typos/spaces
        const bulletproofAreas = allFetchedAreas.filter((service) => {
          const name1 = service.category_name || "";
          const name2 = service.category_detail?.name || "";
          
          return (
            name1.toLowerCase().trim() === "areas" ||
            name2.toLowerCase().trim() === "areas"
          );
        });

        // Store the full objects so we can display prices in the UI
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

  const handleToggle = (areaName) => {
    setSelectedAreas((prev) =>
      prev.includes(areaName)
        ? prev.filter((a) => a !== areaName)
        : [...prev, areaName]
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
          // area.name is the string (e.g. "Kitchen"), keeping it compatible with your selectedAreas state
          const active = selectedAreas.includes(area.name);
          
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
                {/* Dynamically render the price from the backend if it exists */}
                {area.priceFixed && (
                  <span className={`text-xs mt-0.5 ${active ? 'text-blue-200' : 'text-gray-400'}`}>
                    +£{area.priceFixed}
                  </span>
                )}
              </div>

              <input
                type="checkbox"
                checked={active}
                onChange={() => handleToggle(area.name)}
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
