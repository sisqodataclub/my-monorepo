import { Navigate, useParams } from "react-router"; 
import type { MetaFunction } from "react-router"; 
// Import BOTH the component and the newly exported faqData
import DynamicServicePage, { faqData } from "../components/landing/dynamic";
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

  // B. FAQ Schema (Automatically mapped from the array we imported from dynamic.tsx!)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  // 3. Return BOTH schemas using the Array feature
  return getSeoMeta({
    title: `${serviceData.heroTitle} | D Deep`,
    description: serviceData.heroSubtitle,
    url: currentUrl,
    schema: [serviceSchema, faqSchema] 
  });
};

export default function ServiceRoute() {
  const { service } = useParams<"service">(); 

  if (!service || !servicesContent[service]) {
    return <Navigate to="/" replace />; 
  }

  return <DynamicServicePage data={servicesContent[service]} />; 
}
