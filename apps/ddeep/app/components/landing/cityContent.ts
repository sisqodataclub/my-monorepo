// app/components/landing/cityContent.ts
//
// PROGRAMMATIC PAGE CONTENT UNIQUENESS CONTRACT
// -----------------------------------------------------------------------------
// Every field below MUST be non-empty and DISTINCT per page. This file is the
// single source of truth for per-page (service x city) content. The shared
// template (dynamic.tsx) renders these fields; servicesContent.tsx remains the
// SERVICE-LEVEL default only and must not be used to satisfy the uniqueness
// contract. See internal_apps/seo_engine/reports/bolton-implementation-plan.md
// (Action 5b / 5c).
//
// Key format: `${serviceSlug}:${citySlug}`  e.g. "office-cleaning:bolton"
// -----------------------------------------------------------------------------

export type CityContent = {
  /** 2-3 sentences naming the city, local sectors served, and the specific service. */
  intro: string;
  /** Service-specific detail (what is actually cleaned, method, equipment, compliance). Not generic copy. */
  serviceDetail: string;
  /** City-specific proof/landmarks/coverage (sectors present, response time, postcodes covered). */
  localProof: string;
  /** 2-3 city-specific Q&As (must not be the same three questions for every city). */
  faqs: { q: string; a: string }[];
  /** Page-level CTA copy + href. */
  cta: { label: string; href: string };
  /** Unique page title (<= 60 chars ideal, must include primaryKeyword). */
  title: string;
  /** Unique meta description (140-160 chars, must include primaryKeyword). */
  metaDescription: string;
  /** Unique H1 (must include primaryKeyword). */
  h1: string;
  /** Exactly ONE primary keyword per page. No two pages may share a primary keyword. */
  primaryKeyword: string;
  /** 3-5 supporting long-tail keywords, mapped to H2s / body copy. */
  secondaryKeywords: string[];
};

export const cityContent: Record<string, CityContent> = {
  "office-cleaning:bolton": {
    intro:
      "D DEEP provides contract office cleaning in Bolton for professional services firms, clinics, and corporate offices across the town centre and surrounding business parks. Our Bolton office cleaning teams work around your operating hours so desks, meeting rooms, and washrooms are ready before staff arrive.",
    serviceDetail:
      "Our Bolton office cleaning service covers daily touch-point disinfection of desks, keyboards, and door handles; sanitisation of communal kitchens and washrooms; consumables restocking; and periodic deep cleans of carpets and hard floors using HEPA-filter vacuums and pH-neutral, COSHH-compliant products. We operate to a documented cleaning schedule with signed-off audits.",
    localProof:
      "We clean offices across Bolton town centre, Middlebrook, and the surrounding BL1-BL7 postcode areas, with a typical response time of under 24 hours for new contract quotes. Our Bolton crews are DBS-checked and fully insured.",
    faqs: [
      {
        q: "Do you clean offices in Bolton town centre outside normal working hours?",
        a: "Yes. Most of our Bolton office cleaning contracts are delivered before 8am or after 6pm so cleaning does not disrupt your staff or visitors. We can also cover weekends for offices in the BL1-BL7 area.",
      },
      {
        q: "How much does contract office cleaning cost in Bolton?",
        a: "Bolton office cleaning contracts typically start from £50 per visit depending on floor area, frequency, and the number of washrooms and kitchens. We provide a free on-site survey and a fixed monthly price before you commit.",
      },
      {
        q: "Are your Bolton office cleaners insured and vetted?",
        a: "Every cleaner we send to Bolton offices is DBS-checked, fully insured, and trained on our documented cleaning schedule. We can provide insurance certificates and method statements on request.",
      },
    ],
    cta: { label: "Get a free Bolton office cleaning quote", href: "/#contact" },
    title: "Office Cleaning Bolton | Contract Office Cleaners | D DEEP",
    metaDescription:
      "Professional office cleaning in Bolton from D DEEP. Contract office cleaners for BL1-BL7 businesses, DBS-checked and fully insured. Free quote within 24 hours.",
    h1: "Office Cleaning in Bolton",
    primaryKeyword: "office cleaning Bolton",
    secondaryKeywords: [
      "contract office cleaning Bolton",
      "commercial office cleaners Bolton",
      "office cleaning company Bolton",
      "office cleaners BL1",
    ],
  },
};

/**
 * Resolve per-page content for a (service, city) pair.
 *
 * Returns the authored cityContent entry when present. When the entry is
 * missing, returns `null` and emits a build-time warning naming the missing
 * key so gaps are visible in build output rather than silently falling back.
 */
export function getCityContent(
  service: string,
  city: string
): CityContent | null {
  const key = `${service}:${city}`;
  const entry = cityContent[key];
  if (!entry) {
    // eslint-disable-next-line no-console
    console.warn(
      `[seo] Missing cityContent entry for "${key}" — page will fall back to service-level defaults. Add an entry to cityContent.ts to satisfy the uniqueness contract.`
    );
    return null;
  }
  return entry;
}
