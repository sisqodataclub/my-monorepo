import RecentMessagesTable from '../components/RecentMessagesTable';
import RecentBookingsTable from '../components/RecentBookingsTable';

export default function InquiriesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Contact Messages</h2>
          <RecentMessagesTable messages={[]} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <RecentBookingsTable />
        </div>
      </div>
    </div>
  );
}
