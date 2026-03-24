export interface KPI {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ServiceData {
  name: string;
  value: number;
  color: string;
}

export interface RetentionData {
  month: string;
  new: number;
  returning: number;
  churned: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface Booking {
  id: number;
  customer: string;
  service: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Mock data
export const kpiData: KPI[] = [
  { title: 'Total Revenue', value: '$124,580', change: '+12.5%', trend: 'up' },
  { title: 'Total Bookings', value: '342', change: '+8.2%', trend: 'up' },
  { title: 'Average Order Value', value: '$364', change: '+3.1%', trend: 'up' },
  { title: 'Quote Conversion Rate', value: '24.7%', change: '+2.3%', trend: 'up' },
];

export const revenueData: RevenueDataPoint[] = [
  { date: 'Jan', revenue: 4000 },
  { date: 'Feb', revenue: 5200 },
  { date: 'Mar', revenue: 4800 },
  { date: 'Apr', revenue: 6100 },
  { date: 'May', revenue: 5800 },
  { date: 'Jun', revenue: 7200 },
  { date: 'Jul', revenue: 6800 },
  { date: 'Aug', revenue: 8100 },
  { date: 'Sep', revenue: 7900 },
  { date: 'Oct', revenue: 9200 },
  { date: 'Nov', revenue: 8800 },
  { date: 'Dec', revenue: 10500 },
];

export const revenueTrend: RevenueDataPoint[] = [
  { date: 'Jan', revenue: 4000 },
  { date: 'Feb', revenue: 5200 },
  { date: 'Mar', revenue: 4800 },
  { date: 'Apr', revenue: 6100 },
  { date: 'May', revenue: 5800 },
  { date: 'Jun', revenue: 7200 },
];

export const funnelData: FunnelStage[] = [
  { stage: 'Visitors', count: 10000, percentage: 100 },
  { stage: 'Leads', count: 2500, percentage: 25 },
  { stage: 'Quotes', count: 1200, percentage: 12 },
  { stage: 'Bookings', count: 342, percentage: 3.42 },
];

export const serviceData: ServiceData[] = [
  { name: 'Web Development', value: 35, color: '#8884d8' },
  { name: 'Mobile App', value: 25, color: '#82ca9d' },
  { name: 'UI/UX Design', value: 20, color: '#ffc658' },
  { name: 'Consulting', value: 15, color: '#ff8042' },
  { name: 'Maintenance', value: 5, color: '#0088fe' },
];

export const servicePopularity: ServiceData[] = [
  { name: 'Web Development', value: 35, color: '#8884d8' },
  { name: 'Mobile App', value: 25, color: '#82ca9d' },
  { name: 'UI/UX Design', value: 20, color: '#ffc658' },
  { name: 'Consulting', value: 15, color: '#ff8042' },
  { name: 'Maintenance', value: 5, color: '#0088fe' },
];

export const retentionData: RetentionData[] = [
  { month: 'Jan', new: 120, returning: 80, churned: 15 },
  { month: 'Feb', new: 140, returning: 85, churned: 18 },
  { month: 'Mar', new: 130, returning: 90, churned: 12 },
  { month: 'Apr', new: 160, returning: 95, churned: 20 },
  { month: 'May', new: 150, returning: 100, churned: 16 },
  { month: 'Jun', new: 180, returning: 110, churned: 22 },
];

export const contactMessages: ContactMessage[] = [
  { id: 1, name: 'John Smith', email: 'john@example.com', message: 'Interested in web development services', date: '2024-03-20', status: 'new' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', message: 'Need mobile app consultation', date: '2024-03-19', status: 'read' },
  { id: 3, name: 'Mike Brown', email: 'mike@business.com', message: 'Request for UI/UX design quote', date: '2024-03-18', status: 'replied' },
];

export const recentBookings: Booking[] = [
  { id: 1, customer: 'John Smith', service: 'Web Development', date: '2024-03-20', amount: 5000, status: 'confirmed' },
  { id: 2, customer: 'Sarah Johnson', service: 'Mobile App', date: '2024-03-19', amount: 8000, status: 'pending' },
  { id: 3, customer: 'Mike Brown', service: 'UI/UX Design', date: '2024-03-18', amount: 3000, status: 'confirmed' },
];
