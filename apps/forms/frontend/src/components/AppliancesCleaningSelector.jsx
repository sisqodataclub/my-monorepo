// filepath: /src/components/AppliancesCleaningSelector.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassLayout from "./ui/GlassLayout";

const AppliancesCleaningSelector = ({ values, setValues }) => {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the services from your Django standalone backend
  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        const response = await fetch("https://core.franciscodes.com/api/services/");
        if (!response.ok) {
          throw new Error("Failed to fetch appliances data");
        }
        
        const data = await response.json();

        // ✅ Safely extract the array whether Django paginates it (data.results) or not
        const servicesArray = Array.isArray(data) ? data : data.results || [];

        // Filter out only the services that belong to the "Appliances" category.
        // Important: Ensure the category is named "Appliances" in your Django Admin!
        const applianceServices = servicesArray.filter(
          (service) => service.category_name?.toLowerCase() === "appliances"
        );

        setAppliances(applianceServices);
      } catch (err) {
        console.error("Error fetching appliances:", err);
        setError("Could not load appliances. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliances();
  }, []);

  const updateCount = (id, delta) => {
    setValues((prev) => ({
      ...prev,
      // We use the real Django database ID (e.g., id: 14)
      [id]: Math.max(0, (prev[id] || 0) + delta), 
    }));
  };

  return (
    <GlassLayout
      title="Appliances Cleaning"
      subtitle="Important: Appliances must be emptied for internal cleaning"
    >
      {/* Loading & Error States */}
      {loading && (
        <p className="text-gray-300 text-center py-4 animate-pulse">
          Loading appliances...
        </p>
      )}
      
      {error && (
        <p className="text-red-400 text-center py-4 bg-red-900/20 rounded-lg border border-red-500/30">
          {error}
        </p>
      )}

      {!loading && !error && appliances.length === 0 && (
        <p className="text-gray-400 text-center py-4">
          No appliances found in this category.
        </p>
      )}

      {/* Appliances List */}
      <div className="flex flex-col gap-4">
        {appliances.map((item) => {
          // values[item.id] looks up the Django integer ID
          const count = values[item.id] || 0;
          const active = count > 0;

          const glowOpacity = Math.min(0.45, count * 0.1);
          const glowBlur = Math.min(24, count * 6);

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className={`relative flex items-center justify-between p-4 rounded-xl border transition-all
                ${
                  active
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                    : "bg-gray-800/60 border-gray-600 text-gray-200 hover:bg-gray-700"
                }`}
            >
              <div className="flex flex-col">
                <span className="font-medium leading-snug uppercase">
                  {item.name}
                </span>
                {/* Optional: Show the price under the name */}
                {item.price_fixed && (
                  <span className="text-xs opacity-75 mt-0.5">
                    +£{item.price_fixed}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <button
                  onClick={() => updateCount(item.id, -1)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                  aria-label={`Decrease ${item.name}`}
                >
                  –
                </button>

                <span className="min-w-[24px] text-center text-lg font-semibold">
                  {count}
                </span>

                <button
                  onClick={() => updateCount(item.id, 1)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-bold transition-colors"
                  aria-label={`Increase ${item.name}`}
                >
                  +
                </button>
              </div>

              {active && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none bg-blue-400 animate-pulse"
                  style={{
                    opacity: glowOpacity,
                    filter: `blur(${glowBlur}px)`,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassLayout>
  );
};

export default AppliancesCleaningSelector;
