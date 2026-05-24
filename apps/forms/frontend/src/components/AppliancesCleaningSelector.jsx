// src/components/AppliancesCleaningSelector.jsx
import React from "react";
import { motion } from "framer-motion";
import GlassLayout from "./ui/GlassLayout";

const AppliancesCleaningSelector = ({ values, setValues, appliancesServices }) => {
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
        {appliancesServices.map((item) => {
          const count = values[item.id] || 0;
          const active = count > 0;
          const glowOpacity = Math.min(0.45, count * 0.1);
          const glowBlur = Math.min(24, count * 6);

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                active
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                  : "bg-gray-800/60 border-gray-600 text-gray-200 hover:bg-gray-700"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium leading-snug uppercase">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <button
                  onClick={() => updateCount(item.id, -1)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                >
                  –
                </button>
                <span className="min-w-[24px] text-center text-lg font-semibold">{count}</span>
                <button
                  onClick={() => updateCount(item.id, 1)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
              {active && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none bg-blue-400 animate-pulse"
                  style={{ opacity: glowOpacity, filter: `blur(${glowBlur}px)` }}
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
