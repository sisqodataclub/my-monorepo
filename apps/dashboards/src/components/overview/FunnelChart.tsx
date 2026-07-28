import React from 'react';
import { cn } from '@/lib/utils'; // if you have a utility for classnames, otherwise use clsx

export interface FunnelStage {
  label: string;          // e.g. "IMPRESSIONS"
  volume: number;         // absolute number (e.g. 100000)
  color?: string;         // optional custom color (Tailwind class)
}

interface FunnelChartProps {
  stages: FunnelStage[];
  className?: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ stages, className }) => {
  if (stages.length < 2) return null;

  // Find the maximum volume to scale bar widths
  const maxVolume = Math.max(...stages.map(s => s.volume));

  // Compute drop-off and efficiency for each stage (except first)
  const enrichedStages = stages.map((stage, index) => {
    const prevVolume = index > 0 ? stages[index - 1].volume : undefined;
    const dropOff = prevVolume !== undefined ? ((prevVolume - stage.volume) / prevVolume) * 100 : 0;
    const efficiency = prevVolume !== undefined ? (stage.volume / prevVolume) * 100 : 0;
    return {
      ...stage,
      dropOff,
      efficiency,
      widthPercent: (stage.volume / maxVolume) * 100,
    };
  });

  // Predefined colors if none provided
  const defaultColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']; // blue scale

  return (
    <div className={cn('w-full space-y-6', className)}>
      {enrichedStages.map((stage, idx) => {
        const barColor = stage.color || defaultColors[idx % defaultColors.length];
        const isFirst = idx === 0;
        const isLast = idx === enrichedStages.length - 1;

        return (
          <div key={stage.label} className="relative flex items-center gap-4">
            {/* Left side: label and volume */}
            <div className="w-32 flex-shrink-0 text-right">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {stage.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stage.volume.toLocaleString()}
              </div>
            </div>

            {/* Bar container with arrow connector */}
            <div className="flex-1 min-w-0">
              <div className="relative flex items-center">
                {/* The bar itself */}
                <div
                  className="h-10 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.max(stage.widthPercent, 5)}%`, // minimum width for visibility
                    backgroundColor: barColor,
                  }}
                />

                {/* Drop-off and efficiency badges */}
                <div className="ml-3 flex flex-col text-xs leading-tight">
                  {!isFirst && (
                    <span className="text-red-500 font-medium">
                      Drop-off: {stage.dropOff.toFixed(1)}%
                    </span>
                  )}
                  {!isFirst && (
                    <span className="text-green-600 font-medium">
                      {stage.efficiency.toFixed(1)}% conversion
                    </span>
                  )}
                </div>
              </div>

              {/* Optional arrow between stages – show below the bar for clarity */}
              {!isLast && (
                <div className="mt-1 ml-0 text-gray-400 text-xs flex items-center gap-1">
                  <span>▼</span>
                  <span>Drop-off: {enrichedStages[idx+1].dropOff.toFixed(1)}%</span>
                  <span className="mx-1">•</span>
                  <span>Efficiency: {enrichedStages[idx+1].efficiency.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
