// src/data/funnelData.ts
import { FunnelStage } from '../components/overview/FunnelChart';

export const funnelStages: FunnelStage[] = [
  {
    label: 'IMPRESSIONS',
    volume: 100_000,
    breakdown: [
      { label: 'Google Ads', value: 40_000, color: '#4285F4' },
      { label: 'Organic Search', value: 30_000, color: '#34A853' },
      { label: 'Meta Social', value: 20_000, color: '#1877F2' },
      { label: 'Email Marketing', value: 10_000, color: '#EA4335' },
    ],
  },
  {
    label: 'TRAFFIC / CLICKS',
    volume: 5_000,
    breakdown: [
      { label: 'Google Clicks', value: 2_500, color: '#4285F4' },
      { label: 'Meta Clicks', value: 1_500, color: '#1877F2' },
      { label: 'Direct / Other', value: 1_000, color: '#FBBC04' },
    ],
  },
  {
    label: 'LEADS',
    volume: 400,
    breakdown: [
      { label: 'Quote Forms', value: 250, color: '#8B5CF6' },
      { label: 'Phone Calls (Twilio)', value: 100, color: '#EC4899' },
      { label: 'Email Sign-ups', value: 50, color: '#14B8A6' },
    ],
  },
  {
    label: 'CONVERSIONS',
    volume: 80,
    breakdown: [
      { label: 'Stripe Checkout', value: 60, color: '#635BFF' },
      { label: 'Signed Contracts', value: 20, color: '#F59E0B' },
    ],
  },
];
