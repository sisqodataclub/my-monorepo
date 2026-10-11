// app/components/landing/cityContent.ts
//
// PER-CITY CONTENT MODULE
// -----------------------------------------------------------------------------
// Single source of truth for genuinely unique per-city content: local areas /
// neighbourhoods, landmarks & local references, an intro paragraph, per-service
// blurbs, and city-specific FAQs. Consumed by:
//   - app/routes/locations.$city.tsx            (city hub)
//   - app/routes/services.$service.in.$city.tsx (city + service)
//   - app/components/landing/dynamic.tsx        (shared renderer)
//
// Key format: city slug exactly as it appears in app/utils/locations.ts
// -----------------------------------------------------------------------------

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityContent {
  /** Display name, e.g. "Manchester". */
  name: string;
  /** 2-3 sentence intro paragraph, unique to the city. */
  intro: string;
  /** Named neighbourhoods / districts served in this city. */
  areas: string[];
  /** Local landmarks / references relevant to cleaning context. */
  landmarks: string[];
  /** Short line about local coverage / response for this city. */
  coverageNote: string;
  /** Per-service body blurb overrides, keyed by service slug. */
  serviceBlurbs: Record<string, string>;
  /** City-specific FAQs (distinct from the shared service FAQs). */
  faqs: CityFAQ[];
}

export const cityContent: Record<string, CityContent> = {
  manchester: { /* ... FULL FILE CONTENT ... */ }
}