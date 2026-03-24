// filepath: /src/components/CleaningSelector.jsx
import React from "react";
import { motion } from "framer-motion";
import GlassLayout from "./ui/GlassLayout";

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

      <span className="w-6 text-center text-lg font-semibold">
        {value}
      </span>

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
  const updateValue = (key, newValue) => {
    setValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const renderRow = (item) => {
    const value = values[item.id] || 0;
    const active = value > 0;

    const glowOpacity = Math.min(0.05 + value * 0.05, 0.35);
    const glowBlur = 6 + value * 4;

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

        <Counter
          value={value}
          onChange={(v) => updateValue(item.id, v)}
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
  };

  return (
    <GlassLayout
      title="Carpet & Upholstery Cleaning"
      subtitle="Leave blank if not applicable. Select quantities where required."
    >
      <div className="flex flex-col gap-6">
        {/* Carpets & Rugs */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
            Carpets
          </h3>
          <div className="flex flex-col gap-2">
            {CARPET_OPTIONS.map(renderRow)}
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2 text-white">
            Rugs
          </h3>
          <div className="flex flex-col gap-2">
            {RUG_OPTIONS.map(renderRow)}
          </div>
        </div>

        {/* Upholstery */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
            Sofas
          </h3>
          <div className="flex flex-col gap-2">
            {SOFA_TYPES.map(renderRow)}
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2 text-white">
            Mattresses
          </h3>
          <div className="flex flex-col gap-2">
            {MATTRESS_TYPES.map(renderRow)}
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2 text-white">
            Chairs
          </h3>
          <div className="flex flex-col gap-2">
            {CHAIR_OPTIONS.map(renderRow)}
          </div>
        </div>
      </div>
    </GlassLayout>
  );
};

export default CleaningSelector;

// ---------------------------------------------------
// CONSTANTS
// ---------------------------------------------------
const CARPET_OPTIONS = [
  { id: "carpet_bedroom", label: "Bedroom Carpets" },
  { id: "carpet_living", label: "Living Room Carpets" },
  { id: "carpet_dining", label: "Dining Room Carpets" },
  { id: "carpet_hallway", label: "Hallway Carpets" },
  { id: "carpet_landing", label: "Landing Carpets" },
  { id: "carpet_stairs", label: "Staircases" },
];

const RUG_OPTIONS = [
  { id: "rug_small", label: "Rug – Small" },
  { id: "rug_medium", label: "Rug – Medium" },
  { id: "rug_large", label: "Rug – Large" },
];

const SOFA_TYPES = [
  { id: "sofa_single", label: "One-seater Sofa" },
  { id: "sofa_double", label: "Two-seater Sofa" },
  { id: "sofa_triple", label: "Three-seater Sofa" },
  { id: "sofa_lshape", label: "L-Shaped 4 Seater Sofa" },
];

const MATTRESS_TYPES = [
  { id: "mattress_single", label: "Single Mattress" },
  { id: "mattress_double", label: "Double Mattress" },
  { id: "mattress_king", label: "King Size Mattress" },
  { id: "mattress_superking", label: "Super King Mattress" },
];

const CHAIR_OPTIONS = [
  { id: "dining_chairs", label: "Dining Chairs" },
  { id: "office_chairs", label: "Office Chairs" },
];
