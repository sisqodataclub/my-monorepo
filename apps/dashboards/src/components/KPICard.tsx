import type { KPI } from '../mockData';

interface KPICardProps {
  kpi: KPI;
}

export default function KPICard({ kpi }: KPICardProps) {
  const trendColor = kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendIcon = kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→';
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{kpi.title}</h3>
          <p className="text-3xl font-bold mt-2">{kpi.value}</p>
        </div>
        <div className={`text-lg font-semibold ${trendColor}`}>
          {trendIcon} {kpi.change}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-gray-400 text-sm">vs previous period</span>
      </div>
    </div>
  );
}
