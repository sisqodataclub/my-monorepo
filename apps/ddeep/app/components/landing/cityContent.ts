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
  manchester: {
    name: "Manchester",
    intro:
      "Manchester is our home city, and we clean everything from Victorian terraces in Levenshulme to glass-fronted apartments in the Northern Quarter. City-centre concierge buildings, student halls around Fallowfield, and busy family homes in Didsbury all get the same vetted, insured D DEEP team.",
    areas: [
      "Ancoats",
      "Northern Quarter",
      "Didsbury",
      "Chorlton",
      "Fallowfield",
      "Levenshulme",
      "Withington",
      "City Centre",
      "Hulme",
      "Moss Side",
    ],
    landmarks: [
      "Manchester Piccadilly and Victoria stations",
      "the Northern Quarter's converted mills and loft apartments",
      "the Etihad and Old Trafford matchday footfall",
      "the Oxford Road student corridor",
      "the Bridgewater Canal and Castlefield warehouses",
    ],
    coverageNote:
      "Same-week slots across M1-M21, with city-centre parking and concierge access already worked out for M1-M4 apartment blocks.",
    serviceBlurbs: {
      "regular-cleaning":
        "Weekly and fortnightly cleans for Manchester homes — from Northern Quarter apartments with hard-to-reach mezzanine floors to family houses in Chorlton and Didsbury.",
      "deep-cleaning":
        "Deep cleans built for Manchester's mix of period terraces and new-build apartments: limescale on hard water in older Ancoats stock, and builder's dust in recent Northern Quarter conversions.",
      "end-of-tenancy-cleaning":
        "End-of-tenancy cleans timed around Manchester's student contract changeover in Fallowfield, Withington and Hulme, with landlord-ready checklists.",
      "office-cleaning":
        "Contract office cleaning for Manchester city-centre offices and Spinningfields workspaces, scheduled around your core hours.",
      "student-accommodation":
        "Student house and halls cleaning across the Oxford Road corridor — Fallowfield, Withington and Rusholme — with summer turnaround slots.",
      "appliances-cleaning":
        "Oven, hob and extractor cleaning for Manchester kitchens, including the heavy grease left in busy shared student houses.",
      "carpet-cleaning":
        "Carpet and upholstery cleaning for Manchester homes, from Victorian floorboards-and-rugs terraces to modern apartment carpet tiles.",
      "bars-restaurants":
        "Deep cleans for Manchester's Northern Quarter bars and Deansgate restaurants, done out of hours so you never lose a service.",
      "post-construction":
        "After-builder