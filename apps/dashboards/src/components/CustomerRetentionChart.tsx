import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { retentionData } from '../mockData';

export default function CustomerRetentionChart() {
  return (
    <div className="w-full h-full min-h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
          <Bar dataKey="new" stackId="a" fill="#60a5fa" name="New Customers" radius={[0, 0, 4, 4]} />
          <Bar dataKey="returning" stackId="a" fill="#3b82f6" name="Returning" />
          <Bar dataKey="churned" fill="#f43f5e" name="Churned" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
