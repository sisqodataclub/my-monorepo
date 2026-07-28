// src/data/funnelData.ts
import type { FunnelStage } from '../components/overview/FunnelChart';

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

// --- Mock Feedback Loop Insights ---
export interface FeedbackInsight {
  id: string;
  type: 'critical' | 'warning' | 'success';
  stage: string;
  title: string;
  metric: string;
  description: string;
  action: string;
  impact: string;
}

export const mockFeedbackInsights: FeedbackInsight[] = [
  {
    id: '1',
    type: 'critical',
    stage: 'Traffic → Leads',
    title: 'High Visitor Drop-Off on Mobile',
    metric: '7.5% Lead Rate (Target: >12%)',
    description:
      'Umami shows 68% mobile traffic, but form submission completion on iOS is down 40%.',
    action: 'Trigger Twilio SMS Lead Magnet',
    impact: 'Estimated +18 leads/week',
  },
  {
    id: '2',
    type: 'success',
    stage: 'Leads → Conversions',
    title: 'High Close Rate on Phone Call Leads',
    metric: '20% Conversion Rate',
    description:
      'Twilio call leads are converting 3x faster than web forms.',
    action: 'Reallocate 15% Meta Ad Budget to Call Ads',
    impact: 'Estimated +£1,200 revenue/mo',
  },
];
