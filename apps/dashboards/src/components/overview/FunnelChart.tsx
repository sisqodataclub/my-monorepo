// apps/dashboards/src/components/overview/FunnelChart.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react'; // or any icon set

export interface FunnelStage {
  label: string;
  volume: number;
  color?: string;
  breakdown?: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  className?: string;
}

// Simple class merge
const mergeClasses = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export const FunnelChart: React.FC<FunnelChartProps> = ({ stages, className }) => {
  if (!stages || stages.length < 2) return null;

  const maxVolume = Math.max(...stages.map(s => s.volume));
  const defaultColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
  const defaultBreakdownColors = ['#f97316', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

  // Track expanded state per stage (index)
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) => {
    setExpandedMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Compute drop-off and efficiency for each stage
  const enrichedStages = stages.map((stage, idx) => {
    const prevVolume = idx > 0 ? stages[idx - 1].volume : undefined;
    const dropOff = prevVolume !== undefined ? ((prevVolume - stage.volume) / prevVolume) * 100 : 0;
    const efficiency = prevVolume !== undefined ? (stage.volume / prevVolume) * 100 : 100;
    const widthPercent = (stage.volume / maxVolume) * 100;
    return { ...stage, dropOff, efficiency, widthPercent };
  });

  return (
    <div className={mergeClasses('w-full space-y-6', className)}>
      {enrichedStages.map((stage, idx) => {
        const barColor = stage.color || defaultColors[idx % defaultColors.length];
        const isExpanded = expandedMap[idx] || false;
        const hasBreakdown = stage.breakdown && stage.breakdown.length > 0;

        // Compute breakdown percentages
        let breakdownData: Array<{ label: string; value: number; color: string; percent: number }> = [];
        if (hasBreakdown) {
          const totalBreakdown = stage.breakdown!.reduce((sum, b) => sum + b.value, 0);
          breakdownData = stage.breakdown!.map((b, i) => ({
            label: b.label,
            value: b.value,
            color: b.color || defaultBreakdownColors[i % defaultBreakdownColors.length],
            percent: (b.value / totalBreakdown) * 100,
          }));
        }

        return (
          <div key={stage.label} className="relative">
            {/* Main stage row */}
            <div className="flex items-center gap-4">
              {/* Left label with toggle button if breakdown exists */}
              <div className="w-32 flex-shrink-0 text-right flex items-center justify-end gap-1">
                {hasBreakdown && (
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    aria-label="Toggle breakdown"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
                <div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {stage.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stage.volume.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Bar and badges */}
              <div className="flex-1 min-w-0">
                <div className="relative flex items-center">
                  <div
                    className="h-10 rounded-md transition-all duration-300"
                    style={{
                      width: `${Math.max(stage.widthPercent, 5)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  {idx > 0 && (
                    <div className="ml-3 flex flex-col text-xs leading-tight">
                      <span className="text-red-500 font-medium">
                        Drop-off: {stage.dropOff.toFixed(1)}%
                      </span>
                      <span className="text-green-600 font-medium">
                        {stage.efficiency.toFixed(1)}% conversion
                      </span>
                    </div>
                  )}
                </div>
                {idx < stages.length - 1 && (
                  <div className="mt-1 ml-0 text-gray-400 text-xs flex items-center gap-1">
                    <span>▼</span>
                    <span>Drop-off: {stage.dropOff.toFixed(1)}%</span>
                    <span className="mx-1">•</span>
                    <span>Efficiency: {stage.efficiency.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Breakdown sub-chart (collapsible) */}
            <AnimatePresence initial={false}>
              {isExpanded && hasBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 ml-32 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                      Share composition
                    </div>
                    {/* Stacked horizontal bar */}
                    <div className="flex h-5 w-full rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {breakdownData.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            width: `${item.percent}%`,
                            backgroundColor: item.color,
                          }}
                          className="transition-all duration-300"
                          title={`${item.label}: ${item.percent.toFixed(1)}%`}
                        />
                      ))}
                    </div>
                    {/* Labels */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-600 dark:text-gray-300">
                      {breakdownData.map((item, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.label}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {item.percent.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;
