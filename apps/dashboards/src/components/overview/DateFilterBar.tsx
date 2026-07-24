// src/components/overview/DateFilterBar.tsx
interface DateFilterBarProps {
  preset: string;
  onPresetChange: (preset: string) => void;
  granularity: 'hour' | 'day' | 'week' | 'month';
  onGranularityChange: (g: 'hour' | 'day' | 'week' | 'month') => void;
  isComparing: boolean;
  onCompareToggle: (val: boolean) => void;
  compareType: 'prev_period' | 'prev_year';
  onCompareTypeChange: (type: 'prev_period' | 'prev_year') => void;
  customStartDate: string;
  customEndDate: string;
  onCustomDateChange: (start: string, end: string) => void;
}

export default function DateFilterBar({
  preset,
  onPresetChange,
  granularity,
  onGranularityChange,
  isComparing,
  onCompareToggle,
  compareType,
  onCompareTypeChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}: DateFilterBarProps) {
  const presets = ['24h', '7D', '30D', 'This Year', 'Custom'];

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onPresetChange(p)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              preset === p
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {preset === 'Custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
          <span className="text-slate-400">→</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <select
          value={granularity}
          onChange={(e) => onGranularityChange(e.target.value as any)}
          className="border rounded-lg px-3 py-1.5 text-sm bg-white"
        >
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <button
          onClick={() => onCompareToggle(!isComparing)}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            isComparing
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Compare
        </button>

        {isComparing && (
          <select
            value={compareType}
            onChange={(e) => onCompareTypeChange(e.target.value as any)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-white"
          >
            <option value="prev_period">Previous Period</option>
            <option value="prev_year">Previous Year</option>
          </select>
        )}
      </div>
    </div>
  );
}
