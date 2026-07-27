// app/routes/services.$service.in.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
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

  return {
    slug,
    citySlug,
    cityName: formatCityName(citySlug),
    serviceData: servicesContent[slug],
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Not Found | D DEEP Cleaning" }];

  const { slug, citySlug, cityName, serviceData } = data;

  return getSeoMeta({
    title: `${serviceData.heroTitle} in ${cityName} | 5★ D DEEP`,
    description: `Professional ${serviceData.heroTitle.toLowerCase()} in ${cityName}. ${serviceData.heroSubtitle} Fully insured, vetted cleaners. Book your free quote today.`,
    url: `https://www.ddeepcleaningservices.com/services/${slug}/in/${citySlug}/`,
  });
};

export default function CityServiceRoute() {
  const { serviceData, cityName } = useLoaderData<typeof loader>();

  // Override the service data so the page becomes city‑specific
  const localizedData = {
    ...serviceData,
    heroTitle: `${serviceData.heroTitle} in ${cityName}`,
    heroSubtitle: `${serviceData.heroSubtitle} Professional local cleaners serving ${cityName}.`,
    ctaSecondaryText: `Trusted by homes and businesses across ${cityName}.`,
    cities: [],   // ← removes the generic “Available in…” line
  };

  // Structured data (Service + optional FAQ) for this city page
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

      <DynamicServicePage key={cityName} data={localizedData} />
    </>
  );
}
