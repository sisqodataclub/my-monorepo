// filepath: /src/components/AppliancesCleaningSelector.jsx
import React from "react";
import { motion } from "framer-motion";
import GlassLayout from "./ui/GlassLayout";

const APPLIANCE_OPTIONS = [
  { id: "fridge_freezer", label: "FRIDGE / FREEZER" },
  { id: "fridge", label: "FRIDGE" },
  { id: "freezer", label: "FREEZER" },
  { id: "american_fridge", label: "AMERICAN STYLE FRIDGE (LARGE)" },
  { id: "built_in_single_oven", label: "BUILT-IN SINGLE OVEN" },
  { id: "built_in_double_oven", label: "BUILT-IN DOUBLE OVEN" },
  { id: "freestanding_single_cooker", label: "FREESTANDING SINGLE COOKER" },
  { id: "freestanding_double_cooker", label: "FREESTANDING DOUBLE COOKER" },
  { id: "range_cooker", label: "RANGE COOKER / AGA OVEN" },
  { id: "microwave", label: "MICROWAVE" },
  { id: "washing_machine", label: "WASHING MACHINE" },
  { id: "dishwasher", label: "DISHWASHER" },
  { id: "hob", label: "HOB" },
  { id: "extractor_hood", label: "HOB EXTRACTOR HOOD" },
];

const AppliancesCleaningSelector = ({ values, setValues }) => {
  const updateCount = (id, delta) => {
    setValues((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  return (
    <GlassLayout
      title="Appliances Cleaning"
      subtitle="Important: Appliances must be emptied for internal cleaning"
    >
      <div className="flex flex-col gap-4">
        {APPLIANCE_OPTIONS.map((item) => {
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
              <span className="font-medium leading-snug">
                {item.label}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCount(item.id, -1)}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-white font-bold"
                >
                  –
                </button>

                <span className="min-w-[24px] text-center text-lg font-semibold">
                  {count}
                </span>

                <button
                  onClick={() => updateCount(item.id, 1)}
                  className="px-3 py-1 bg-blue-500 rounded-lg text-white font-bold"
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
