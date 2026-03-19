import React from "react";
import { motion } from "framer-motion";

/**
 * ✨ BoxesBackground
 * An animated isometric grid that fills its parent with a subtle interactive effect.
 * Ideal as a decorative background for profile cards, dashboards, or hero sections.
 */
export default function BoxesBackground({ className = "" }) {
  const rows = Array.from({ length: 30 });
  const cols = Array.from({ length: 20 });

  const colors = [
    "--sky-300",
    "--pink-300",
    "--green-300",
    "--yellow-300",
    "--red-300",
    "--purple-300",
    "--blue-300",
    "--indigo-300",
    "--violet-300",
  ];

  // Random colour on hover
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      style={{
        transform:
          "translate(-40%, -60%) skewX(-48deg) skewY(14deg) scale(0.68) translateZ(0)",
        zIndex: 0,
        opacity: 0.25,
      }}
    >
      {rows.map((_, rowIdx) => (
        <motion.div key={rowIdx} className="flex">
          {cols.map((_, colIdx) => (
            <motion.div
              key={colIdx}
              whileHover={{
                backgroundColor: `var(${getRandomColor()})`,
                transition: { duration: 0.1 },
              }}
              className="w-8 h-6 border border-slate-700/50 relative bg-transparent"
            >
              {/* Optional dot grid decoration */}
              {rowIdx % 2 === 0 && colIdx % 2 === 0 && (
                <svg
                  viewBox="0 0 24 24"
                  className="absolute -top-[9px] -left-[10px] h-4 w-6 stroke-slate-700/60 stroke-[1.25px]"
                >
                  <path d="M12 6v12M6 12h12" strokeLinecap="round" />
                </svg>
              )}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
