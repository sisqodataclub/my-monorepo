import type { ContactMessage } from '../mockData';

interface RecentMessagesTableProps {
  messages: ContactMessage[];
}

export default function RecentMessagesTable({ messages }: RecentMessagesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              {['Contact', 'Message', 'Date', 'Status'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-500">{msg.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                  {msg.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    msg.status === 'new' ? 'bg-blue-50 text-blue-700' : 
                    msg.status === 'read' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {msg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
