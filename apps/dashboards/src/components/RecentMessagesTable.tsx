import type { ContactMessage } from '../mockData';

interface RecentMessagesTableProps {
  messages: ContactMessage[];
}

export default function RecentMessagesTable({ messages }: RecentMessagesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Contact Messages</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{msg.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{msg.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{msg.message}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{msg.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${msg.status === 'new' ? 'bg-blue-100 text-blue-800' : msg.status === 'read' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
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
