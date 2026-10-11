// app/routes/services.$service.in.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";
import DynamicServicePage from "../components/landing/dynamic";
import { getSeoMeta } from "../utils/seo";

function formatCityName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Action 2 (P0) — shared programmatic content fix.
 *
 * The old description template hard-coded a "Professional " prefix and then
 * interpolated `heroTitle.toLowerCase()`. For services whose heroTitle already
 * begins with "Professional" (e.g. "Professional Office Cleaning") this
 * produced the duplicated-prefix bug seen across every city page:
 *   "Professional professional office cleaning in Bolton. ..."
 *
 * Fix: use the service heroTitle verbatim (it already carries the marketing
 * adjective) and drop the hard-coded prefix. This single change lifts every
 * {service} x {city} page at once.
 */
function buildDescription(
  heroTitle: string,
  heroSubtitle: string,
  cityName: string,
): string {
  const lead = `${heroTitle} in ${cityName}.`;
  const body = heroSubtitle.trim();
  const tail = `Fully insured, vetted cleaners. Book your free quote today.`;
  return [lead, body, tail].filter(Boolean).join(" ");
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.service;
  const citySlug = params.city;

  if (!slug || !servicesContent[slug] || !citySlug) {
    throw new Response("Not Found", { status: 404 });
  }

  // Per-page (service x city) unique content. Missing entries fall back to
  // service-level defaults so the route never 404s on un-authored cities.
  const pageContent = cityContent[`${slug}:${citySlug}`] ?? null;

  return {
    slug,
    citySlug,
    cityName: formatCityName(citySlug),
    serviceData: servicesContent[slug],
    pageContent,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Not Found | D DEEP Cleaning" }];

  const { slug, citySlug, cityName, serviceData, pageContent } = data;

  const title =
    pageContent?.title ?? `${serviceData.heroTitle} in ${cityName} | 5★ D DEEP`;
  const description =
    pageContent?.metaDescription ??
    buildDescription(serviceData.heroTitle, serviceData.heroSubtitle, cityName);

  // Unique keyword set per page: primary first, then supporting long-tails.
  const keywords = pageContent
    ? [pageContent.primaryKeyword, ...pageContent.secondaryKeywords].join(", ")
    : undefined;

  return getSeoMeta({
    title,
    description,
    keywords,
    url: `https://www.ddeepcleaningservices.com/services/${slug}/in/${citySlug}/`,
  });
};

export default function CityServiceRoute() {
  const { serviceData, cityName, pageContent } = useLoaderData<typeof loader>();

  // Override the service data so the page becomes city-specific. When a
  // per-city content entry exists it supplies the unique H1 / intro / proof /
  // FAQs; otherwise we fall back to the generic city-name interpolation.
  const localizedData = {
    ...serviceData,
    heroTitle: pageContent?.h1 ?? `${serviceData.heroTitle} in ${cityName}`,
    heroSubtitle: pageContent?.intro ?? `${serviceData.heroSubtitle} Professional local cleaners serving ${cityName}.`,
    ctaSecondaryText: `Trusted by homes and businesses across ${cityName}.`,
    cities: [],   // removes the generic “Available in…” line
    cityName,
    // Extra per-page fields consumed by dynamic.tsx when present.
    pageContent,
    faqs: pageContent?.faqs?.length
      ? pageContent.faqs.map((f) => ({ question: f.q, answer: f.a }))
      : serviceData.faqs,
  };

  // Structured data (Service + optional FAQ) for this city page.
  return <DynamicServicePage data={localizedData} />;
}
