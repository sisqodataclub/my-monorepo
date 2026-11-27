// app/routes/services.$service.in.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, redirect } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";
import DynamicServicePage from "../components/landing/dynamic";
import InternalLinks from "../components/landing/InternalLinks";
import { getSeoMeta } from "../utils/seo";

// Hyper-local city-service pages are only live for these two cities.
// All other cities 301-redirect to the generic service page.
const LIVE_CITY_SERVICE_CITIES = new Set(["manchester", "stockport"]);

// Within Manchester + Stockport, only these six service combos keep a
// dedicated hyper-local page. Every other service x city combo 301-redirects
// to the generic /services/<service>/ page (same pattern as retired cities).
const LIVE_CITY_SERVICES = new Set([
  "end-of-tenancy-cleaning",
  "deep-cleaning",
  "regular-cleaning",
  "office-cleaning",
  "carpet-cleaning",
  "student-accommodation",
]);

function formatCityName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.service;
  const citySlug = params.city;

  if (!slug || !servicesContent[slug] || !citySlug) {
    throw new Response("Not Found", { status: 404 });
  }

  // Retired city-service URL -> permanent 301 to the generic service page.
  // Also covers cities that never had hyper-local pages.
  if (!LIVE_CITY_SERVICE_CITIES.has(citySlug)) {
    throw redirect(`/services/${slug}/`, { status: 301 });
  }

  // Within the two live cities, only the six kept service combos stay live.
  // Every other service x {manchester, stockport} combo 301-redirects.
  if (!LIVE_CITY_SERVICES.has(slug)) {
    throw redirect(`/services/${slug}/`, { status: 301 });
  }

  const pageContent = cityContent[citySlug] ?? null;

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

  // Per-city/service SEO overrides (e.g. Manchester deep-cleaning) take
  // precedence; every other city/service falls back to the generic template.
  const seoOverride = pageContent?.serviceSeo?.[slug];

  const title =
    seoOverride?.title ??
    `${serviceData.heroTitle} in ${cityName} | 5★ D DEEP`;
  const description =
    seoOverride?.description ??
    `Professional ${serviceData.heroTitle.toLowerCase()} in ${cityName}. ${serviceData.heroSubtitle} Fully insured, vetted cleaners. Book your free quote today.`;

  return getSeoMeta({
    title,
    description,
    keywords: seoOverride?.keywords,
    url: `https://www.ddeepcleaningservices.com/services/${slug}/in/${citySlug}/`,
  });
};

export default function CityServiceRoute() {
  const { serviceData, cityName, slug, citySlug, pageContent } = useLoaderData<typeof loader>();

  const localizedData = {
    ...serviceData,
    heroTitle: `${serviceData.heroTitle} in ${cityName}`,
    heroSubtitle: `${serviceData.heroSubtitle} Professional local cleaners serving ${cityName}.`,
    ctaSecondaryText: `Trusted by homes and businesses across ${cityName}.`,
    cities: [],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceData.heroTitle} in ${cityName}`,
    description: serviceData.heroSubtitle,
    provider: {
      "@type": "LocalBusiness",
      name: "D DEEP Cleaning Services",
      url: "https://www.ddeepcleaningservices.com",
      telephone: "07459416262",
      address: {
        "@type": "PostalAddress",
        addressRegion: "North West",
        addressCountry: "GB",
      },
      priceRange: "From £50",
    },
    areaServed: { "@type": "City", name: cityName },
  };

  const faqSchema = serviceData.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: serviceData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <DynamicServicePage data={{ ...localizedData, cityName, pageContent }} />
      <InternalLinks serviceSlug={slug} citySlug={citySlug} cityName={cityName} />
    </>
  );
}
