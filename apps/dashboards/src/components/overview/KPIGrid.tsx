// src/components/overview/KPIGrid.tsx
import KPICard, { type KPI } from '../KPICard';

interface KPIGridProps {
  kpis: KPI[];
  loading?: boolean;
}

export default function KPIGrid({ kpis, loading = false }: KPIGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-white/60 animate-pulse rounded-2xl border border-slate-200/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, idx) => (
        <KPICard key={kpi.id} kpi={kpi} index={idx} />
      ))}
    </div>
  );
}
