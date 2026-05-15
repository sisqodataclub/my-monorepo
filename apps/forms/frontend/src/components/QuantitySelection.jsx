// src/components/QuantitySelection.jsx
import React, { useEffect, useState } from "react";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api"; // Fetching the DB to find variations

// Tell the component which base rooms trigger the S/M/L variations
const SIZED_AREAS_NAMES = ["Kitchen", "Bedroom"];

const QuantitySelection = ({ selectedAreas, quantities, setQuantities }) => {
  const [allAreas, setAllAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all areas so we can match base IDs to variation IDs
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getServices("?category_name=areas");
        setAllAreas(data);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // 2. Initialize the secure quantities state using database IDs
  useEffect(() => {
    if (allAreas.length === 0 || selectedAreas.length === 0) return;

    setQuantities((prev) => {
      const updated = { ...prev };

      selectedAreas.forEach((baseId) => {
        const baseArea = allAreas.find((a) => a.id === baseId);
        if (!baseArea) return;

        if (SIZED_AREAS_NAMES.includes(baseArea.name)) {
          // If it's a Kitchen or Bedroom, find its S/M/L variations in the DB
          const variations = allAreas.filter(
            (a) =>
              a.name === `${baseArea.name}_Small` ||
              a.name === `${baseArea.name}_Medium` ||
              a.name === `${baseArea.name}_Large`
          );
          
          variations.forEach((v) => {
            if (updated[v.id] === undefined) updated[v.id] = 0;
          });

          // Ensure the "base" generic room isn't accidentally charged
          updated[baseId] = 0; 
        } else {
          // Normal room (like Living Room). Default to 1.
          if (updated[baseId] === undefined) updated[baseId] = 1;
        }
      });

      return updated;
    });
  }, [selectedAreas, allAreas, setQuantities]);

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const decrement = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) - 1),
    }));

  if (loading) {
    return (
      <GlassLayout title="Room Quantities" subtitle="Loading your selections...">
        <div className="text-white text-center py-8 animate-pulse">Loading...</div>
      </GlassLayout>
    );
  }

  if (selectedAreas.length === 0) {
    return (
      <GlassLayout title="Room Quantities" subtitle="No areas selected">
        <div className="text-yellow-400 text-center py-8">
          Please go back and select at least one area to clean.
        </div>
      </GlassLayout>
    );
  }

  // 3. Build the UI Groups dynamically based on the DB
  const renderGroups = [];
  selectedAreas.forEach((baseId) => {
    const baseArea = allAreas.find((a) => a.id === baseId);
    if (!baseArea) return;

    if (SIZED_AREAS_NAMES.includes(baseArea.name)) {
      const variations = allAreas.filter(
        (a) =>
          a.name === `${baseArea.name}_Small` ||
          a.name === `${baseArea.name}_Medium` ||
          a.name === `${baseArea.name}_Large`
      );
      if (variations.length > 0) {
        renderGroups.push({ title: baseArea.name, items: variations, isGroup: true });
      } else {
        renderGroups.push({ title: baseArea.name, items: [baseArea], isGroup: false });
      }
    } else {
      renderGroups.push({ title: baseArea.name, items: [baseArea], isGroup: false });
    }
  });

  return (
    <GlassLayout
      title="Room Quantities"
      subtitle="Adjust quantities for your selected areas."
    >
      <div className="flex flex-col gap-6">
        {renderGroups.map((group) => (
          <div key={group.title} className={group.isGroup ? "bg-gray-800/40 p-4 rounded-2xl border border-gray-700/50" : ""}>
            
            {/* Header for Grouped Items (Kitchen, Bedroom) */}
            {group.isGroup && (
              <h3 className="text-white font-bold text-lg mb-3 px-1">{group.title} Variations</h3>
            )}

            <div className="flex flex-col gap-3">
              {group.items.map((item) => {
                const count = quantities[item.id] || 0;
                
                // Extract just the word "Small", "Medium", or "Large" for a cleaner UI
                const isVariation = item.name.includes("_");
                const displayName = isVariation ? item.name.split("_")[1] : item.name;

                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-800/80 border border-gray-600 p-4 rounded-xl"
                  >
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-md sm:text-lg">
                        {displayName}
                      </span>
                      {item.priceFixed && (
                        <span className="text-blue-300 text-xs mt-0.5">
                          £{item.priceFixed} each
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg text-white font-bold text-xl"
                      >
                        –
                      </button>
                      <span className="text-white font-bold text-xl min-w-[24px] text-center">
                        {count}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-white font-bold text-xl shadow-lg shadow-blue-500/30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </GlassLayout>
  );
};

export default QuantitySelection;
