import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FunnelStage } from '../mockData';

interface BookingFunnelChartProps {
  data: FunnelStage[];
}

export default function BookingFunnelChart({ data }: BookingFunnelChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Booking Funnel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Count" />
          <Bar dataKey="percentage" fill="#82ca9d" name="Percentage" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
