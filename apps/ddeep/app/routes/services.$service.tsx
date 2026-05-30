// app/routes/services.$service.tsx
import { Navigate, useParams } from "react-router";
import type { MetaFunction } from "react-router";

// SAFE IMPORTS: Only import the default component, no data variables from the client!
import DynamicServicePage from "../components/landing/dynamic";
import { servicesContent } from "../components/landing/servicesContent";
import { getSeoMeta } from "../utils/seo";

export const meta: MetaFunction = ({ params, location }) => {
  const serviceId = params.service;
  const serviceData = serviceId ? servicesContent[serviceId] : null;

  const baseUrl = "https://www.ddeepcleaningservices.com";
  const currentUrl = `${baseUrl}${location.pathname}`;

  if (!serviceData) {
    return getSeoMeta({
      title: "Service Not Found | D Deep",
      description: "The requested cleaning service could not be found.",
      url: currentUrl
    });
  }

  // --- BUILD THE SCHEMAS ---

  // A. Local Business & Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.heroTitle,
    "description": serviceData.heroSubtitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "D Deep Cleaning",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "North West",
        "addressCountry": "UK"
      }
    },
    "areaServed": [
      { "@type": "City", "name": "Manchester" },
      { "@type": "City", "name": "Liverpool" },
      { "@type": "City", "name": "Bolton" },
      { "@type": "City", "name": "Stockport" }
    ]
  };

  // B. FAQ Schema (Automatically mapped from the service-specific data)
  const faqSchema = serviceData.faqs && serviceData.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": serviceData.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;

  // Filter out null schemas if a service happens to have no FAQs
  const schemas = [serviceSchema, faqSchema].filter(Boolean);

  return getSeoMeta({
    title: `${serviceData.heroTitle} | D Deep`,
    description: serviceData.heroSubtitle,
    url: currentUrl,
    schema: schemas
  });
};

export default function ServiceRoute() {
  const { service } = useParams<"service">();

  if (!service || !servicesContent[service]) {
    return <Navigate to="/" replace />;
  }

  return <DynamicServicePage data={servicesContent[service]} />;
}
