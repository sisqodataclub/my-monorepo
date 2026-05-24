// src/components/AreaSelection.jsx
import React, { useEffect } from "react";
import GlassLayout from "./ui/GlassLayout";

const AreaSelection = ({ selectedAreas, setSelectedAreas, setCanProceed, areasServices }) => {
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

  return (
    <GlassLayout
      title="Select Areas to Clean"
      subtitle="Choose the rooms or areas you want us to clean. Multiple selections allowed."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {areasServices.map((area) => {
          const active = selectedAreas.includes(area.id);
          return (
            <label
              key={area.id}
              className={`relative cursor-pointer select-none p-4 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800/70 text-gray-200 hover:bg-gray-700"
              }`}
            >
              <span className="text-base sm:text-lg font-medium leading-snug">{area.name}</span>
              <input
                type="checkbox"
                checked={active}
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
