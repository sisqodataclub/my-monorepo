// apps/dashboards/src/components/overview/FunnelChart.tsx
import React from 'react';

export interface FunnelStage {
  label: string;
  volume: number;
  color?: string; // optional Tailwind color class
}

interface FunnelChartProps {
  stages: FunnelStage[];
  className?: string;
}

// Simple utility to merge classes (no external dependency)
const mergeClasses = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export const FunnelChart: React.FC<FunnelChartProps> = ({ stages, className }) => {
  if (!stages || stages.length < 2) return null;

  const maxVolume = Math.max(...stages.map(s => s.volume));

  const defaultColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <div className={mergeClasses('w-full space-y-6', className)}>
      {stages.map((stage, idx) => {
        const barColor = stage.color || defaultColors[idx % defaultColors.length];
        const prevVolume = idx > 0 ? stages[idx - 1].volume : undefined;
        const dropOff = prevVolume !== undefined
          ? ((prevVolume - stage.volume) / prevVolume) * 100
          : 0;
        const efficiency = prevVolume !== undefined
          ? (stage.volume / prevVolume) * 100
          : 100;
        const widthPercent = (stage.volume / maxVolume) * 100;

        return (
          <div key={stage.label} className="relative flex items-center gap-4">
            {/* Left label */}
            <div className="w-32 flex-shrink-0 text-right">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {stage.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stage.volume.toLocaleString()}
              </div>
            </div>

            {/* Bar and badges */}
            <div className="flex-1 min-w-0">
              <div className="relative flex items-center">
                <div
                  className="h-10 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.max(widthPercent, 5)}%`,
                    backgroundColor: barColor,
                  }}
                />
                {idx > 0 && (
                  <div className="ml-3 flex flex-col text-xs leading-tight">
                    <span className="text-red-500 font-medium">
                      Drop-off: {dropOff.toFixed(1)}%
                    </span>
                    <span className="text-green-600 font-medium">
                      {efficiency.toFixed(1)}% conversion
                    </span>
                  </div>
                )}
              </div>
              {idx < stages.length - 1 && (
                <div className="mt-1 ml-0 text-gray-400 text-xs flex items-center gap-1">
                  <span>▼</span>
                  <span>Drop-off: {dropOff.toFixed(1)}%</span>
                  <span className="mx-1">•</span>
                  <span>Efficiency: {efficiency.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;
