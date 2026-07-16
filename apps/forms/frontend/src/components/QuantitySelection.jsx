// src/components/QuantitySelection.jsx
import React, { useEffect } from "react";
import GlassLayout from "./ui/GlassLayout";

const SIZED_AREAS_NAMES = ["Kitchen", "Bedroom"];

const QuantitySelection = ({ selectedAreas, setSelectedAreas, quantities, setQuantities, allAreas }) => {
  const getBaseAreaId = (variationName) => {
    const baseName = variationName.split('_')[0];
    const baseArea = allAreas.find(area => area.name === baseName);
    return baseArea ? baseArea.id : null;
  };

  // ✅ Clean up stale quantities when selectedAreas changes
  useEffect(() => {
    if (allAreas.length === 0) return;

    setQuantities((prev) => {
      const updated = { ...prev };
      const validIds = new Set();

      // 1. Add valid IDs from currently selected areas
      selectedAreas.forEach((baseId) => {
        const baseArea = allAreas.find((a) => a.id === baseId);
        if (!baseArea) return;

        if (SIZED_AREAS_NAMES.includes(baseArea.name)) {
          // For sized areas, add variation IDs
          const variations = allAreas.filter(
            (a) =>
              a.name === `${baseArea.name}_Small` ||
              a.name === `${baseArea.name}_Medium` ||
              a.name === `${baseArea.name}_Large`
          );
          variations.forEach((v) => {
            validIds.add(v.id);
            if (updated[v.id] === undefined) updated[v.id] = 0;
          });
          // Base area itself is not charged, set to 0
          updated[baseId] = 0;
        } else {
          // Normal area
          validIds.add(baseId);
          if (updated[baseId] === undefined) updated[baseId] = 1;
        }
      });

      // 2. Also keep variation IDs that have a positive quantity (even if base is not selected)
      Object.keys(updated).forEach((key) => {
        const id = parseInt(key, 10);
        if (isNaN(id)) return;
        const item = allAreas.find((a) => a.id === id);
        if (item && item.name.includes('_') && (updated[id] || 0) > 0) {
          validIds.add(id);
        }
      });

      // 3. Remove any numeric keys that are no longer valid
      Object.keys(updated).forEach((key) => {
        const id = parseInt(key, 10);
        if (isNaN(id)) return; // keep non‑numeric keys (e.g., "furnished_fee")
        if (!validIds.has(id)) {
          delete updated[key];
        }
      });

      return updated;
    });
  }, [selectedAreas, allAreas, setQuantities]);

  const increment = (id) => {
    const newQty = (quantities[id] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
    const item = allAreas.find(a => a.id === id);
    if (item && item.name.includes('_') && newQty === 1) {
      const baseId = getBaseAreaId(item.name);
      if (baseId && selectedAreas.includes(baseId)) {
        setSelectedAreas(prev => prev.filter(areaId => areaId !== baseId));
      }
    }
  };

  const decrement = (id) => {
    const newQty = Math.max(0, (quantities[id] || 0) - 1);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
  };

  // ----- Build UI groups with ABSOLUTE static ordering -----
  // (unchanged – uses allAreas for sorting)
  const baseIdsToRender = new Set(selectedAreas);
  Object.keys(quantities).forEach(id => {
    const item = allAreas.find(a => a.id === parseInt(id, 10));
    if (item && item.name.includes('_')) {
      const baseName = item.name.split('_')[0];
      const baseArea = allAreas.find(a => a.name === baseName);
      if (baseArea) baseIdsToRender.add(baseArea.id);
    }
  });

  const sortedBaseIds = Array.from(baseIdsToRender).sort((a, b) => {
    const indexA = allAreas.findIndex((area) => area.id === a);
    const indexB = allAreas.findIndex((area) => area.id === b);
    return indexA - indexB;
  });

  const renderGroups = [];
  sortedBaseIds.forEach((baseId) => {
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

  if (selectedAreas.length === 0 && Object.values(quantities).every((q) => q === 0)) {
    return (
      <GlassLayout title="Room Quantities" subtitle="No areas selected">
        <div className="text-yellow-400 text-center py-8">
          Please go back and select at least one area to clean.
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout title="Room Quantities" subtitle="Adjust quantities for your selected areas.">
      <div className="flex flex-col gap-6">
        {renderGroups.map((group) => (
          <div
            key={group.title}
            className={group.isGroup ? "bg-gray-800/40 p-4 rounded-2xl border border-gray-700/50" : ""}
          >
            {group.isGroup && (
              <h3 className="text-white font-bold text-lg mb-3 px-1">{group.title} Variations</h3>
            )}
            <div className="flex flex-col gap-3">
              {group.items.map((item) => {
                const count = quantities[item.id] || 0;
                const isVariation = item.name.includes("_");
                const displayName = isVariation ? item.name.split("_")[1] : item.name;
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-800/80 border border-gray-600 p-4 rounded-xl"
                  >
                    <span className="text-white font-medium text-md sm:text-lg">{displayName}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold text-xl"
                      >
                        –
                      </button>
                      <span className="text-white font-bold text-xl min-w-[24px] text-center">{count}</span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-xl shadow-lg shadow-blue-500/30"
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
