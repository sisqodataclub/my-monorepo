import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { servicePopularity } from '../mockData';

export default function ServicePopularityChart() {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Service Popularity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={servicePopularity}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {servicePopularity.map((_entry, _index) => (
              <Cell key={`cell-${_index}`} fill={COLORS[_index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
