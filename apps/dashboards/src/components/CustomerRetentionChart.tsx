import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { retentionData } from '../mockData';

export default function CustomerRetentionChart() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Customer Retention</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={retentionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="new" stackId="a" fill="#8884d8" />
          <Bar dataKey="returning" stackId="a" fill="#82ca9d" />
          <Bar dataKey="churned" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
