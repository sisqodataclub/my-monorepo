// src/components/CarpetCleaningSelector.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api";

// ---------------------------------------------------
// COUNTER COMPONENT
// ---------------------------------------------------
const Counter = ({ value, onChange }) => {
  const minus = () => onChange(Math.max(0, value - 1));
  const plus = () => onChange(value + 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={minus}
        className="px-3 py-1 bg-gray-700 rounded text-lg font-bold text-white hover:bg-gray-600 transition"
      >
        –
      </button>
      <span className="w-6 text-center text-lg font-semibold">{value}</span>
      <button
        onClick={plus}
        className="px-3 py-1 bg-blue-500 text-white rounded text-lg font-bold hover:bg-blue-600 transition"
      >
        +
      </button>
    </div>
  );
};

// ---------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------
const CleaningSelector = ({ values, setValues }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarpetServices = async () => {
      try {
        const allFetchedCarpets = await getServices("?category_name=carpets&include_addons=true");
        const bulletproofCarpets = allFetchedCarpets.filter((service) => {
          const name1 = service.category_name || "";
          const name2 = service.category_detail?.name || "";
          return (
            name1.toLowerCase().trim() === "carpets" ||
            name2.toLowerCase().trim() === "carpets"
          );
        });
        setServices(bulletproofCarpets);
      } catch (err) {
        console.error("Error fetching carpet services:", err);
        setError("Could not load carpet cleaning options. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarpetServices();
  }, []);

  const updateValue = (serviceId, newValue) => {
    setValues((prev) => ({
      ...prev,
      [serviceId]: newValue,
    }));
  };

  if (loading) {
    return (
      <GlassLayout
        title="Carpet & Upholstery Cleaning"
        subtitle="Loading available options..."
      >
        <div className="text-white text-center py-8 animate-pulse">Loading...</div>
      </GlassLayout>
    );
  }

  if (error) {
    return (
      <GlassLayout
        title="Carpet & Upholstery Cleaning"
        subtitle="Something went wrong"
      >
        <div className="text-red-400 text-center py-8 bg-red-900/20 rounded-lg border border-red-500/30">
          {error}
        </div>
      </GlassLayout>
    );
  }

  if (services.length === 0) {
    return (
      <GlassLayout
        title="Carpet & Upholstery Cleaning"
        subtitle="No services found"
      >
        <div className="text-yellow-400 text-center py-8">
          No carpet cleaning services are currently available.
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout
      title="Carpet & Upholstery Cleaning"
      subtitle="Select quantities where required. Leave blank if not applicable."
    >
      <div className="flex flex-col gap-4">
        {services.map((service) => {
          const count = values[service.id] || 0;
          const active = count > 0;
          const glowOpacity = Math.min(0.05 + count * 0.05, 0.35);
          const glowBlur = 6 + count * 4;

          return (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className={`relative flex items-center justify-between p-4 rounded-xl border transition-all
                ${
                  active
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                    : "bg-gray-800/60 border-gray-600 text-gray-200 hover:bg-gray-700"
                }`}
            >
              <div className="flex flex-col">
                <span className="font-medium leading-snug">{service.name}</span>
                {/* ❌ All price displays have been removed */}
              </div>

              <Counter
                value={count}
                onChange={(v) => updateValue(service.id, v)}
              />

              {active && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${glowOpacity})`,
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

export default CleaningSelector;
