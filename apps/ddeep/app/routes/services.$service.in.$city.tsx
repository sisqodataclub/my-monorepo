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
    `Professional ${serviceData.heroTitle.toLowerCase()} in ${cityName}. ${serviceData.heroSubtitle} Fully insured, vetted cleaners. Book your free quote today.`;

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

  // Structured data (Service + optional FAQ) for this city page
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageContent?.h1 ?? `${serviceData.heroTitle} in ${cityName}`,
    description: pageContent?.intro ?? serviceData.heroSubtitle,
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

  const faqSchema = localizedData.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: localizedData.faqs.map((faq) => ({
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

      <DynamicServicePage key={cityName} data={localizedData} />
    </>
  );
}
