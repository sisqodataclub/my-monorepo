// src/pages/BookingsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CalendarDays, AlertCircle, FileText, Search, Star, Flag, X,
  Plus, Edit, ChevronUp, ChevronDown, Mail, Send, Eye
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

import NextBookingCard from '../components/NextBookingCard';
import BookingDetailsModal from '../components/BookingDetailsModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';
const TENANT = 'DDEEP';
const AGENT_API_KEY = import.meta.env.VITE_AGENT_API_KEY || '';
const DEFAULT_ARRIVAL_ETA = 'within 30 minutes';

// Full AnalyticsBooking interface – mirrors all ServiceBooking fields
export interface AnalyticsBooking {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  service_name: string;
  provider_name: string | null;
  start_time: string;
  end_time: string;
  payment_status: 'unpaid' | 'paid_cash' | 'paid_card' | 'paid_bank';
  payment_date: string | null;
  payment_reference: string;
  status: string;
  completed_at: string | null;
  has_complaint: boolean;
  complaint_notes: string;
  complaint_resolved: boolean;
  complaint_resolved_at: string | null;
  rating: number | null;
  feedback_text: string;
  reschedule_history: any[];
  rescheduled_count: number;
  discount_applied: string;
  tax_applied: string;
  total_price: string;
  cancellation_reason: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  actual_duration_minutes: number | null;
  internal_notes: string;
  created_at: string;
  updated_at: string;
  cleaning_booking_id?: number;
  cleaning_details?: any;
  last_arrival_sent_at?: string | null;
  last_review_sent_at?: string | null;
}

interface CleaningBooking {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  total: string;
  status: string;
  created_at: string;
  property_details: any;
  selected_datetime: any;
}

interface Service {
  id: number;
  name: string;
  price: string;
}

type SortDirection = 'asc' | 'desc';

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------
export default function BookingsPage() {
  const { getToken } = useAuth();
  // (rest of file unchanged)
