// src/components/QuantitySelection.jsx
import React, { useEffect, useState } from "react";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api"; // ✅ Fetch areas to translate IDs back to Names

const QuantitySelection = ({ selectedAreas, quantities, setQuantities }) => {
  const [areasData, setAreasData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the official area details from the database
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const allFetchedAreas = await getServices("?category_name=areas");
        setAreasData(allFetchedAreas);
      } catch (err) {
        console.error("Failed to fetch area details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // 2. Safely initialize quantities using the secure IDs
  useEffect(() => {
    if (!selectedAreas || selectedAreas.length === 0) return;
    
    setQuantities((prev) => {
      const updated = { ...prev };
      selectedAreas.forEach((areaId) => {
        // If this ID hasn't been given a quantity yet, default it to 1
        if (updated[areaId] === undefined) updated[areaId] = 1;
      });
      return updated;
    });
  }, [selectedAreas, setQuantities]);

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

  // 3. Filter the database list down to ONLY the areas the user selected
  const activeAreas = areasData.filter((area) => selectedAreas.includes(area.id));

  if (activeAreas.length === 0) {
    return (
      <GlassLayout title="Room Quantities" subtitle="No areas selected">
        <div className="text-yellow-400 text-center py-8">
          Please go back and select at least one area to clean.
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout
      title="Room Quantities"
      subtitle="Adjust the quantities for each selected area."
    >
      <div className="flex flex-col gap-4">
        {activeAreas.map((area) => {
          // We now securely use area.id for logic, but area.name for the UI!
          const count = quantities[area.id] || 0;

          return (
            <div
              key={area.id}
              className="flex justify-between items-center bg-gray-800/60 border border-white/20 p-4 rounded-xl shadow-sm"
            >
              <div className="flex flex-col">
                <span className="text-white font-medium text-lg">{area.name}</span>
                {area.priceFixed && (
                  <span className="text-blue-300 text-xs mt-0.5">
                    £{area.priceFixed} each
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => decrement(area.id)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg text-white font-bold text-xl"
                >
                  –
                </button>
                <span className="text-white font-bold text-xl min-w-[24px] text-center">
                  {count}
                </span>
                <button
                  onClick={() => increment(area.id)}
                  className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-white font-bold text-xl shadow-lg shadow-blue-500/30"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </GlassLayout>
  );
};

export default QuantitySelection;
