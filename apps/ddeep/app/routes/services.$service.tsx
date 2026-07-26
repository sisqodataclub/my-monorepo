// app/routes/services.$service.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import DynamicServicePage from "../components/landing/dynamic";
import { getSeoMeta } from "../utils/seo";

// ------------------------------------------------------------------
// 1. DATA LOADER
// ------------------------------------------------------------------
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.service;

  if (!slug || !servicesContent[slug]) {
    throw new Response("Service Not Found", { status: 404 });
  }

  return {
    slug,
    serviceData: servicesContent[slug],
  };
};

// ------------------------------------------------------------------
// 2. DYNAMIC SEO & SCHEMA INJECTION
// ------------------------------------------------------------------
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Service Not Found | D DEEP Cleaning" }];
  }

  const { slug, serviceData } = data;

  // Use the cities defined inside the service content (fallback to empty array)
  const cities = serviceData.cities || [];

  // A. Dynamic FAQ Schema (only if the service has FAQs)
  const faqSchema = serviceData.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: serviceData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  // B. Enhanced Service Schema with areaServed from the service data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceData.heroTitle,
    description: serviceData.heroSubtitle,
    provider: {
      "@type": "LocalBusiness",
      name: "D DEEP Cleaning Services",
      url: "https://www.ddeepcleaningservices.com",
      telephone: "07459416262",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Greater Manchester",
        addressCountry: "GB",
      },
      priceRange: "From £50",
    },
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
  };

  const schemas = [serviceSchema, faqSchema].filter(Boolean);

  // C. Build dynamic keywords: "Deep Cleaning Manchester, Deep Cleaning Liverpool, …"
  const serviceName = serviceData.heroTitle; // e.g. "Deep Cleaning Services"
  const keywords = cities
    .map((city) => `${serviceName} ${city}`)
    .join(", ");

  // D. Improved meta title and description
  const title = `${serviceData.heroTitle} Manchester & North West | 5★ D DEEP`;
  const firstCities = cities.slice(0, 3).join(", ");
  const description = `Professional ${serviceData.heroTitle.toLowerCase()} in ${firstCities} and across the North West. ${serviceData.heroSubtitle} Fully insured, vetted cleaners. Book your free quote in 60 seconds.`;

  return getSeoMeta({
    title,
    description,
    url: `https://www.ddeepcleaningservices.com/services/${slug}/`,
    image: "https://www.ddeepcleaningservices.com/logo.png",
    keywords,
    schema: schemas,
  });
};

// ------------------------------------------------------------------
// 3. PAGE COMPONENT
// ------------------------------------------------------------------
export default function ServiceRoute() {
  const { serviceData } = useLoaderData<typeof loader>();
  return <DynamicServicePage data={serviceData} />;
}
