// app/components/landing/cityContent.ts
//
// PER-CITY CONTENT MODULE
// -----------------------------------------------------------------------------
// Single source of truth for genuinely unique per-city content: local areas /
// neighbourhoods, landmarks & local references, an intro paragraph,
// FAQs, testimonials and metadata overrides. Cities without an entry here
// fall back to the generic landing copy.
//
// NOTE: This file is written in batches. Each batch appends below the
// previous one. Do not reorder.
// -----------------------------------------------------------------------------

export interface CityFaq {
  question: string;
  answer: string;
}

export interface CityTestimonial {
  quote: string;
  author: string;
  location?: string;
}

export interface CityContent {
  slug: string;
  name: string;
  region: string;
  intro: string;
  areas: string[];
  landmarks: string[];
  localReferences: string[];
  faqs: CityFaq[];
  testimonials: CityTestimonial[];
  metaTitle?: string;
  metaDescription?: string;
}

export const cityContent: Record<string, CityContent> = {
