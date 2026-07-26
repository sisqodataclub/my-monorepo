// app/routes/_index.tsx
import type { MetaFunction } from "react-router";
import { getSeoMeta } from "../utils/seo";

// ==========================================
// 1. SERVER-RENDERED SEO & SCHEMA
// ==========================================
export const meta: MetaFunction = () => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "D DEEP Cleaning Services",
    "image": "https://www.ddeepcleaningservices.com/logo.png",
    "@id": "https://www.ddeepcleaningservices.com",
    "url": "https://www.ddeepcleaningservices.com",
    "telephone": "07459416262",
    "priceRange": "From £50",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "82"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Manchester",
      "addressRegion": "Greater Manchester",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 53.4808,
      "longitude": -2.2426
    },
    "areaServed": [
      { "@type": "City", "name": "Manchester" },
      { "@type": "City", "name": "Liverpool" },
      { "@type": "City", "name": "Salford" },
      { "@type": "City", "name": "Warrington" },
      { "@type": "City", "name": "Bolton" },
      { "@type": "City", "name": "Stockport" },
      { "@type": "City", "name": "Oldham" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Professional Cleaning Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Regular Domestic Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "End of Tenancy Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Office Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Restaurant & Bar Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "After Builders Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carpet Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fridge Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Oven Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kitchen Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Living Room Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bedroom Cleaning" } }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What areas do your professional cleaners cover?",
        "acceptedAnswer": { "@type": "Answer", "text": "Our local cleaning teams cover Manchester, Liverpool, Salford, Warrington, Bolton, Stockport, Oldham, and the wider North West region." }
      },
      {
        "@type": "Question",
        "name": "What is included in an end of tenancy clean?",
        "acceptedAnswer": { "@type": "Answer", "text": "Our comprehensive end of tenancy cleaning is designed to help secure your deposit. It includes a top-to-bottom deep clean of all rooms, inside cupboards, skirting boards, window frames, and full appliance cleaning (including ovens and fridge-freezers)." }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a deep clean and a regular domestic clean?",
        "acceptedAnswer": { "@type": "Answer", "text": "A regular domestic clean keeps your home fresh on a weekly or fortnightly basis. A deep clean is a much more intensive, one-off service that tackles hard-to-reach areas, heavy grime, and scale buildup—perfect for spring cleaning or moving into a new home." }
      },
      {
        "@type": "Question",
        "name": "Do you bring your own cleaning supplies and equipment?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, our vetted cleaners arrive fully equipped with industry-grade vacuums, mops, and premium cleaning products to handle everything from standard housekeeping to heavy-duty after builders cleaning." }
      },
      {
        "@type": "Question",
        "name": "How do I get a quote and book my clean?",
        "acceptedAnswer": { "@type": "Answer", "text": "Simply click 'Get Free Quote', choose your required service, and fill out our 30-second form. You'll get an instant price and can reserve a timeslot that fits your schedule." }
      },
      {
        "@type": "Question",
        "name": "Are your domestic and commercial cleaners insured?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, 100%. Whether you are booking a house clean or a commercial office clean, all our staff are strictly vetted, DBS checked, and fully insured for your peace of mind." }
      }
    ]
  };

  // Full keywords – every service × every city
  const fullKeywords = [
    "Deep Cleaning Manchester", "Deep Cleaning Liverpool", "Deep Cleaning Salford", "Deep Cleaning Oldham", "Deep Cleaning Bolton", "Deep Cleaning Stockport", "Deep Cleaning Warrington",
    "Regular Cleaning Manchester", "Regular Cleaning Liverpool", "Regular Cleaning Salford", "Regular Cleaning Oldham", "Regular Cleaning Bolton", "Regular Cleaning Stockport", "Regular Cleaning Warrington",
    "End of Tenancy Cleaning Manchester", "End of Tenancy Cleaning Liverpool", "End of Tenancy Cleaning Salford", "End of Tenancy Cleaning Oldham", "End of Tenancy Cleaning Bolton", "End of Tenancy Cleaning Stockport", "End of Tenancy Cleaning Warrington",
    "Office Cleaning Manchester", "Office Cleaning Liverpool", "Office Cleaning Salford", "Office Cleaning Oldham", "Office Cleaning Bolton", "Office Cleaning Stockport", "Office Cleaning Warrington",
    "After Builders Cleaning Manchester", "After Builders Cleaning Liverpool", "After Builders Cleaning Salford", "After Builders Cleaning Oldham", "After Builders Cleaning Bolton", "After Builders Cleaning Stockport", "After Builders Cleaning Warrington",
    "Carpet Cleaning Manchester", "Carpet Cleaning Liverpool", "Carpet Cleaning Salford", "Carpet Cleaning Oldham", "Carpet Cleaning Bolton", "Carpet Cleaning Stockport", "Carpet Cleaning Warrington",
    "Oven Cleaning Manchester", "Oven Cleaning Liverpool", "Oven Cleaning Salford", "Oven Cleaning Oldham", "Oven Cleaning Bolton", "Oven Cleaning Stockport", "Oven Cleaning Warrington",
    "Fridge Cleaning Manchester", "Fridge Cleaning Liverpool", "Fridge Cleaning Salford", "Fridge Cleaning Oldham", "Fridge Cleaning Bolton", "Fridge Cleaning Stockport", "Fridge Cleaning Warrington",
    "Kitchen Cleaning Manchester", "Kitchen Cleaning Liverpool", "Kitchen Cleaning Salford", "Kitchen Cleaning Oldham", "Kitchen Cleaning Bolton", "Kitchen Cleaning Stockport", "Kitchen Cleaning Warrington",
    "Living Room Cleaning Manchester", "Living Room Cleaning Liverpool", "Living Room Cleaning Salford", "Living Room Cleaning Oldham", "Living Room Cleaning Bolton", "Living Room Cleaning Stockport", "Living Room Cleaning Warrington",
    "Bedroom Cleaning Manchester", "Bedroom Cleaning Liverpool", "Bedroom Cleaning Salford", "Bedroom Cleaning Oldham", "Bedroom Cleaning Bolton", "Bedroom Cleaning Stockport", "Bedroom Cleaning Warrington",
    "Restaurant Cleaning Manchester", "Bar Cleaning Manchester", "Hospitality Cleaning Liverpool",
    "House Cleaning Manchester", "Domestic Cleaners Manchester", "Regular Cleaners Liverpool",
    "Move Out Cleaning Manchester", "Move In Cleaning Manchester", "Student Accommodation Cleaning Manchester"
  ].join(", ");

  return getSeoMeta({
    title: "Instant Quote | Deep Cleaning, Regular Cleaning, End of Tenancy | Manchester & Liverpool | 5★ D DEEP",
    description: "5★ rated deep, domestic & commercial cleaners across Manchester and Liverpool. Fully insured and vetted teams. Get your instant free quote in 60 seconds.",
    url: "https://www.ddeepcleaningservices.com/",
    image: "https://www.ddeepcleaningservices.com/logo.png",
    keywords: fullKeywords,
    schema: [businessSchema, faqSchema] // Passed cleanly to the updated seo.ts
  });
};

// ==========================================
// 2. IMPORTS (Eager – everything server‑rendered for SEO)
// ==========================================
import HomeHero from "../components/home/HomeHero";
import HomeReviews from "../components/home/HomeReviews";
import HomeServices from "../components/home/HomeServices";
import HomeProcess from "../components/home/HomeProcess";
import HomeAreas from "../components/home/HomeAreas";
import HomeCTA from "../components/home/HomeCTA";
import { HomeFAQ } from "../components/HomeFAQ"; // Check this path if it's in home/ or components/
import StoryCard from "../components/home/StoryCard";
import ScrollProgress from "../components/home/ScrollProgress";

// FAQ data exactly matching the schema (for rendering)
const homepageFaqs = [
  { question: "What areas do your professional cleaners cover?", answer: "Our local cleaning teams cover Manchester, Liverpool, Salford, Warrington, Bolton, Stockport, Oldham, and the wider North West region." },
  { question: "What is included in an end of tenancy clean?", answer: "Our comprehensive end of tenancy cleaning is designed to help secure your deposit. It includes a top-to-bottom deep clean of all rooms, inside cupboards, skirting boards, window frames, and full appliance cleaning (including ovens and fridge-freezers)." },
  { question: "What is the difference between a deep clean and a regular domestic clean?", answer: "A regular domestic clean keeps your home fresh on a weekly or fortnightly basis. A deep clean is a much more intensive, one-off service that tackles hard-to-reach areas, heavy grime, and scale buildup—perfect for spring cleaning or moving into a new home." },
  { question: "Do you bring your own cleaning supplies and equipment?", answer: "Yes, our vetted cleaners arrive fully equipped with industry-grade vacuums, mops, and premium cleaning products to handle everything from standard housekeeping to heavy-duty after builders cleaning." },
  { question: "How do I get a quote and book my clean?", answer: "Simply click 'Get Free Quote', choose your required service, and fill out our 30-second form. You'll get an instant price and can reserve a timeslot that fits your schedule." },
  { question: "Are your domestic and commercial cleaners insured?", answer: "Yes, 100%. Whether you are booking a house clean or a commercial office clean, all our staff are strictly vetted, DBS checked, and fully insured for your peace of mind." }
];

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  return (
    <main className="scroll-smooth">
      <HomeHero />
      <StoryCard><HomeReviews /></StoryCard>
      <StoryCard><HomeServices /></StoryCard>
      <StoryCard><HomeProcess /></StoryCard>
      <StoryCard><HomeAreas /></StoryCard>
      <StoryCard><HomeFAQ faqs={homepageFaqs} /></StoryCard>
      <StoryCard><HomeCTA /></StoryCard>
      <ScrollProgress />

      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; }
      `}</style>
    </main>
  );
}
