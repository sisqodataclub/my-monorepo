import type { Booking } from '../mockData';
import { recentBookings } from '../mockData';

export default function RecentBookingsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              {['ID', 'Customer', 'Service', 'Date', 'Amount', 'Status'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {recentBookings.map((booking: Booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">£{booking.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 
                    booking.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {booking.status}
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
