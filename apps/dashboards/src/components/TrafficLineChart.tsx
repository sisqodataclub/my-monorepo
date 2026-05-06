import { useState } from 'react';
import { 
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Calendar, BarChart2, Clock, CalendarDays, Target, Activity } from 'lucide-react';

export interface TrafficData {
  date: string;
  views: number;
  visitors: number;
  prevViews?: number;
  prevVisitors?: number;
}

interface TrafficLineChartProps {
  data: TrafficData[];
  activePreset: string;
  activeGranularity: string;
  isComparing: boolean;
  compareType: 'prev_period' | 'prev_year';
  customStartDate: string;
  customEndDate: string;
  onPresetChange: (preset: string) => void;
  onGranularityChange: (granularity: 'hour' | 'day' | 'week' | 'month') => void;
  onCompareToggle: (compare: boolean) => void;
  onCompareTypeChange: (type: 'prev_period' | 'prev_year') => void;
  onCustomDateChange: (start: string, end: string) => void;
}

export default function TrafficLineChart({ 
  data, activePreset, activeGranularity, isComparing, compareType, customStartDate, customEndDate,
  onPresetChange, onGranularityChange, onCompareToggle, onCompareTypeChange, onCustomDateChange
}: TrafficLineChartProps) {
  
  const [showVisitors, setShowVisitors] = useState(true);
  const [showViews, setShowViews] = useState(true);
  const [goalTarget, setGoalTarget] = useState<number | ''>(500);

  const TIME_PRESETS = ['24h', '7D', '30D', 'This Year', 'Custom'];
  
  const GRANULARITIES = [
    { id: 'hour', label: 'Hourly', icon: Clock },
    { id: 'day', label: 'Daily', icon: Calendar },
    { id: 'week', label: 'Weekly', icon: CalendarDays },
    { id: 'month', label: 'Monthly', icon: BarChart2 }
  ];

  const getDaysDifference = () => {
    if (activePreset === '24h') return 1;
    if (activePreset === '7D') return 7;
    if (activePreset === '30D') return 30;
    if (activePreset === 'This Year') return 365;
    if (!customStartDate || !customEndDate) return 0;
    return (new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 3600 * 24);
  };

  const daysSelected = getDaysDifference();

  // --- Strict Granularity Rules ---
  const availableGranularities = GRANULARITIES.filter(g => {
    if (g.id === 'hour') return daysSelected <= 2; // ONLY show hourly if 2 days or less!
    if (g.id === 'week') return daysSelected > 14;  // Hide week if 14 days or less
    if (g.id === 'month') return daysSelected >= 30; // Hide month if less than 30 days
    return true; // 'day' is always an option
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 mb-8 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
      
      {/* --- TOP HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-indigo-50 p-2 rounded-lg mr-3">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Traffic Overview</h2>
          </div>
          
          <div className="flex items-center bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-1.5 transition-colors group">
            <Target className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors mr-2" />
            <span className="text-xs font-semibold text-slate-500 mr-2 uppercase tracking-wider">Goal</span>
            <input
              type="number"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              className="w-16 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="flex bg-slate-100/80 p-1.5 rounded-xl overflow-x-auto max-w-full backdrop-blur-sm">
          {availableGranularities.map((gran) => {
            const Icon = gran.icon;
            const isActive = activeGranularity === gran.id;
            return (
              <button
                key={gran.id}
                onClick={() => onGranularityChange(gran.id as 'hour' | 'day' | 'week' | 'month')}
                className={`flex items-center px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-2 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                {gran.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- FILTERS & CONTROLS --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 pb-6 border-b border-slate-100">
        
        <div className="flex flex-wrap items-center gap-2">
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onPresetChange(preset)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                activePreset === preset 
                  ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {preset}
            </button>
          ))}

          {activePreset === 'Custom' && (
            <div className="flex items-center ml-2 space-x-2 animate-in fade-in slide-in-from-left-4 duration-300">
              <input 
                type="date" 
                value={customStartDate} 
                onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <span className="text-slate-400 text-xs font-medium">to</span>
              <input 
                type="date" 
                value={customEndDate} 
                onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowVisitors(!showVisitors)}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              showVisitors ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${showVisitors ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-slate-300'}`} />
            Visitors
          </button>
          
          <button 
            onClick={() => setShowViews(!showViews)}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              showViews ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${showViews ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`} />
            Views
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={() => onCompareToggle(!isComparing)}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isComparing ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isComparing ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-slate-300'}`} />
            Compare
          </button>

          {isComparing && (
            <select 
              value={compareType}
              onChange={(e) => onCompareTypeChange(e.target.value as 'prev_period' | 'prev_year')}
              className="bg-white border border-purple-200 text-purple-700 text-xs font-semibold rounded-lg px-3 py-1.5 outline-none hover:bg-purple-50 transition-colors cursor-pointer animate-in fade-in zoom-in duration-200 shadow-sm"
            >
              <option value="prev_period">Prev Period</option>
              <option value="prev_year">Prev Year</option>
            </select>
          )}
        </div>
      </div>

      {/* --- CHART VISUALIZATION --- */}
      <div className="h-[400px] w-full relative">
        {(!data || data.length === 0) ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-500">
             <BarChart2 className="w-12 h-12 mb-3 text-slate-200" />
             <p className="font-medium text-sm">No traffic data available for this period</p>
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dx={-10} />
              
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 16px'
                }}
                itemStyle={{ fontSize: '13px', fontWeight: 600, paddingBottom: '4px' }}
                labelStyle={{ fontWeight: '800', color: '#1e293b', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              
              {goalTarget !== '' && Number(goalTarget) > 0 && (
                <ReferenceLine 
                  y={Number(goalTarget)} 
                  stroke="#f43f5e" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  label={{ position: 'top', value: 'TARGET', fill: '#f43f5e', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em' }} 
                />
              )}

              {showViews && <Area type="monotone" dataKey="views" name="Page Views" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />}
              {showVisitors && <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />}
              
              {isComparing && showViews && <Line type="monotone" dataKey="prevViews" name="Prev. Views" stroke="#34d399" strokeWidth={2} strokeDasharray="6 6" dot={false} activeDot={{ r: 4 }} />}
              {isComparing && showVisitors && <Line type="monotone" dataKey="prevVisitors" name="Prev. Visitors" stroke="#93c5fd" strokeWidth={2} strokeDasharray="6 6" dot={false} activeDot={{ r: 4 }} />}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
