// src/components/overview/FeedbackEngine.tsx
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface FeedbackInsight {
  id: string;
  type: 'critical' | 'warning' | 'success';
  stage: string;
  title: string;
  metric: string;
  description: string;
  action: string;
  impact: string;
}

interface FeedbackEngineProps {
  insights: FeedbackInsight[];
}

export default function FeedbackEngine({ insights }: FeedbackEngineProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Automated Feedback Loop Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real‑time diagnostic rules identifying funnel leaks and optimisation triggers.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
          {insights.length} Active Signal{insights.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              item.type === 'critical'
                ? 'bg-rose-50/50 border-rose-200/80 hover:border-rose-300'
                : 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.type === 'critical' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {item.stage}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {item.metric}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Expected Impact
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center justify-end">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {item.impact}
                  </span>
                </div>
                <button
                  onClick={() =>
                    alert(`[Mock] Executed: ${item.action}`)
                  }
                  className="flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  {item.action}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
