import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Calendar, BarChart2, Clock, CalendarDays } from 'lucide-react';

// Define the shape of our data, including the optional "previous period" data
interface TrafficData {
  date: string;
  views: number;
  visitors: number;
  prevViews?: number;     // Used when Compare is toggled ON
  prevVisitors?: number;  // Used when Compare is toggled ON
}

interface TrafficLineChartProps {
  data: TrafficData[];
  activePreset: string;
  activeGranularity: string;
  isComparing: boolean;
  onPresetChange: (preset: string) => void;
  onGranularityChange: (granularity: 'hour' | 'day' | 'week') => void;
  onCompareToggle: (compare: boolean) => void;
}

export default function TrafficLineChart({ 
  data, 
  activePreset, 
  activeGranularity, 
  isComparing,
  onPresetChange, 
  onGranularityChange,
  onCompareToggle
}: TrafficLineChartProps) {
  
  // Local UI State: The Metric Focus Toggles
  const [showVisitors, setShowVisitors] = useState(true);
  const [showViews, setShowViews] = useState(true);

  // Constants for our UI buttons
  const TIME_PRESETS = ['24h', '7D', '30D', 'This Year'];
  const GRANULARITIES = [
    { id: 'hour', label: 'Hourly', icon: Clock },
    { id: 'day', label: 'Daily', icon: Calendar },
    { id: 'week', label: 'Weekly', icon: CalendarDays }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      
      {/* --- TOP ROW: Title & Granularity Toggle --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-blue-600" />
          Traffic Overview
        </h2>

        {/* 1. The Granularity / Grouping Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {GRANULARITIES.map((gran) => {
            const Icon = gran.icon;
            const isActive = activeGranularity === gran.id;
            return (
              <button
                key={gran.id}
                onClick={() => onGranularityChange(gran.id as 'hour' | 'day' | 'week')}
                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {gran.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SECOND ROW: Time Pills & Controls --- */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
        
        {/* 2. Quick-Select Time Presets (Pill Menu) */}
        <div className="flex space-x-2">
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onPresetChange(preset)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                activePreset === preset 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* 3 & 4. Metric Focus Toggles & Compare Toggle */}
        <div className="flex items-center space-x-6 text-sm">
          {/* Metric Focus: Visitors */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showVisitors} 
              onChange={(e) => setShowVisitors(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            />
            <span className="font-medium text-gray-700">Visitors</span>
            <div className="w-3 h-0.5 bg-blue-500 rounded"></div>
          </label>

          {/* Metric Focus: Views */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showViews} 
              onChange={(e) => setShowViews(e.target.checked)}
              className="rounded text-green-500 focus:ring-green-400 h-4 w-4 cursor-pointer"
            />
            <span className="font-medium text-gray-700">Views</span>
            <div className="w-3 h-0.5 bg-green-500 rounded"></div>
          </label>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Compare Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isComparing ? 'bg-indigo-600' : 'bg-gray-200'}`}>
              <input 
                type="checkbox" 
                checked={isComparing}
                onChange={(e) => onCompareToggle(e.target.checked)}
                className="sr-only"
              />
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isComparing ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="font-medium text-gray-700">Compare Previous</span>
          </label>
        </div>
      </div>

      {/* --- CHART AREA --- */}
      <div className="h-96 w-full">
        {(!data || data.length === 0) ? (
           <div className="h-full flex items-center justify-center text-gray-400 font-medium">No data for this date range.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
              />
              
              {/* CURRENT PERIOD LINES */}
              {showVisitors && (
                <Line type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#3b82f6" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              )}
              {showViews && (
                <Line type="monotone" dataKey="views" name="Page Views" stroke="#10b981" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              )}

              {/* PREVIOUS PERIOD OVERLAY LINES (Dashed & Lighter) */}
              {isComparing && showVisitors && (
                <Line type="monotone" dataKey="prevVisitors" name="Prev. Visitors" stroke="#93c5fd" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
              )}
              {isComparing && showViews && (
                <Line type="monotone" dataKey="prevViews" name="Prev. Views" stroke="#6ee7b7" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
