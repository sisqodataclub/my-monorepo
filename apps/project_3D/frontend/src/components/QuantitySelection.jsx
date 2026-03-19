import React, { useEffect } from "react";
import GlassLayout from "./ui/GlassLayout";

const SIZED_AREAS = ["Kitchen", "Bedroom"];
const SIZES = ["Small", "Medium", "Large"];

const QuantitySelection = ({ selectedAreas, quantities, setQuantities }) => {
  useEffect(() => {
    setQuantities((prev) => {
      const updated = { ...prev };

      selectedAreas.forEach((area) => {
        if (SIZED_AREAS.includes(area)) {
          SIZES.forEach((size) => {
            const key = `${area}_${size}`;
            if (updated[key] === undefined) updated[key] = 0;
          });
        } else {
          if (updated[area] === undefined) updated[area] = 1;
        }
      });

      return updated;
    });
  }, [selectedAreas, setQuantities]);

  const increment = (key) =>
    setQuantities((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));

  const decrement = (key) =>
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] ?? 0) - 1),
    }));

  return (
    <GlassLayout
      title="Room Quantities"
      subtitle="Adjust quantities for each selected area"
    >
      <div className="flex flex-col gap-4">
        {selectedAreas.map((area) =>
          SIZED_AREAS.includes(area) ? (
            <div key={area}>
              <h3 className="text-white font-semibold mb-2">{area}</h3>

              {SIZES.map((size) => {
                const key = `${area}_${size}`;
                return (
                  <div
                    key={key}
                    className="flex justify-between items-center bg-gray-800/60 border border-white/20 p-3 rounded-lg mb-2"
                  >
                    <span className="text-white">{size}</span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrement(key)}
                        className="px-3 py-1 bg-gray-700 rounded-lg text-white"
                      >
                        –
                      </button>
                      <span className="text-white font-semibold">
                        {quantities[key]}
                      </span>
                      <button
                        onClick={() => increment(key)}
                        className="px-3 py-1 bg-blue-500 rounded-lg text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              key={area}
              className="flex justify-between items-center bg-gray-800/60 border border-white/20 p-3 rounded-lg"
            >
              <span className="text-white">{area}</span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decrement(area)}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-white"
                >
                  –
                </button>
                <span className="text-white font-semibold">
                  {quantities[area]}
                </span>
                <button
                  onClick={() => increment(area)}
                  className="px-3 py-1 bg-blue-500 rounded-lg text-white"
                >
                  +
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </GlassLayout>
  );
};

export default QuantitySelection;
