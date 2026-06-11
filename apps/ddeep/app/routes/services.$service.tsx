// app/routes/services.$service.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";

// Import your data and component
import { servicesContent } from "../components/landing/servicesContent";
import DynamicServicePage from "../components/landing/dynamic";
import { getSeoMeta } from "../utils/seo";

// ==========================================
// 1. DATA LOADER
// ==========================================
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.service; 
  
  if (!slug || !servicesContent[slug]) {
    throw new Response("Service Not Found", { status: 404 });
  }

  return {
    slug,
    serviceData: servicesContent[slug]
  };
};

// ==========================================
// 2. DYNAMIC SEO & SCHEMA INJECTION
// ==========================================
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Service Not Found | D DEEP Cleaning" }];
  }

  const { slug, serviceData } = data;

  // A. Generate the FAQ Schema dynamically (ONLY if FAQs exist)
  const faqSchema = serviceData.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": serviceData.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // B. Generate the Service Schema with Knowledge Graph Anchors
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.heroTitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "D DEEP Cleaning Services",
      "url": "https://www.ddeepcleaningservices.com",
      "telephone": "07459416262",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Greater Manchester",
        "addressCountry": "GB"
      },
      "priceRange": "From £50"
    }
  };

  // Filter out any null schemas (like missing FAQs) before passing to utility
  const schemas = [serviceSchema, faqSchema].filter(Boolean);

  // C. Pass everything through your SEO Utility
  return getSeoMeta({
    title: `${serviceData.heroTitle} Manchester | 5★ D DEEP`,
    description: serviceData.heroSubtitle,
    url: `https://www.ddeepcleaningservices.com/services/${slug}/`,
    image: "https://www.ddeepcleaningservices.com/logo.png",
    schema: schemas
  });
};

// ==========================================
// 3. PAGE COMPONENT
// ==========================================
export default function ServiceRoute() {
  const { serviceData } = useLoaderData<typeof loader>();
  return <DynamicServicePage data={serviceData} />;
}
