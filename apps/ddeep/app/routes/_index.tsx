// app/routes/_index.tsx
import type { MetaFunction } from "react-router";
import { getSeoMeta } from "../utils/seo";

// ==========================================
// 1. SERVER-RENDERED SEO (schemas moved to component)
// ==========================================
export const meta: MetaFunction = () => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "D DEEP Cleaning Services",
    "image": "https://www.ddeepcleaningservices.com/favicon.svg", // ✅ Fixed 404 by using SVG
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
      "reviewCount": "90"
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
      { "@type": "City", "name": "Oldham" },
      { "@type": "City", "name": "Rochdale" },
      { "@type": "City", "name": "Bury" },
      { "@type": "City", "name": "Wigan" },
      { "@type": "City", "name": "Trafford" },
      { "@type": "City", "name": "Tameside" }
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
        "acceptedAnswer": { "@type": "Answer", "text": "Our local cleaning teams cover Manchester, Liverpool, Salford, Warrington, Bolton, Stockport, Oldham, Rochdale, Bury, Wigan, Trafford, Tameside and the wider North West region." }
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

  // Full keywords – every service × every city (including new towns)
  const fullKeywords = [
    "Deep Cleaning Manchester", "Deep Cleaning Liverpool", "Deep Cleaning Salford", "Deep Cleaning Oldham", "Deep Cleaning Bolton", "Deep Cleaning Stockport", "Deep Cleaning Warrington",
    "Deep Cleaning Rochdale", "Deep Cleaning Bury", "Deep Cleaning Wigan", "Deep Cleaning Trafford", "Deep Cleaning Tameside",
    "Regular Cleaning Manchester", "Regular Cleaning Liverpool", "Regular Cleaning Salford", "Regular Cleaning Oldham", "Regular Cleaning Bolton", "Regular Cleaning Stockport", "Regular Cleaning Warrington",
    "Regular Cleaning Rochdale", "Regular Cleaning Bury", "Regular Cleaning Wigan", "Regular Cleaning Trafford", "Regular Cleaning Tameside",
    "End of Tenancy Cleaning Manchester", "End of Tenancy Cleaning Liverpool", "End of Tenancy Cleaning Salford", "End of Tenancy Cleaning Oldham", "End of Tenancy Cleaning Bolton", "End of Tenancy Cleaning Stockport", "End of Tenancy Cleaning Warrington",
    "End of Tenancy Cleaning Rochdale", "End of Tenancy Cleaning Bury", "End of Tenancy Cleaning Wigan", "End of Tenancy Cleaning Trafford", "End of Tenancy Cleaning Tameside",
    "Office Cleaning Manchester", "Office Cleaning Liverpool", "Office Cleaning Salford", "Office Cleaning Oldham", "Office Cleaning Bolton", "Office Cleaning Stockport", "Office Cleaning Warrington",
    "Office Cleaning Rochdale", "Office Cleaning Bury", "Office Cleaning Wigan", "Office Cleaning Trafford", "Office Cleaning Tameside",
    "After Builders Cleaning Manchester", "After Builders Cleaning Liverpool", "After Builders Cleaning Salford", "After Builders Cleaning Oldham", "After Builders Cleaning Bolton", "After Builders Cleaning Stockport", "After Builders Cleaning Warrington",
    "After Builders Cleaning Rochdale", "After Builders Cleaning Bury", "After Builders Cleaning Wigan", "After Builders Cleaning Trafford", "After Builders Cleaning Tameside",
    "Carpet Cleaning Manchester", "Carpet Cleaning Liverpool", "Carpet Cleaning Salford", "Carpet Cleaning Oldham", "Carpet Cleaning Bolton", "Carpet Cleaning Stockport", "Carpet Cleaning Warrington",
    "Carpet Cleaning Rochdale", "Carpet Cleaning Bury", "Carpet Cleaning Wigan", "Carpet Cleaning Trafford", "Carpet Cleaning Tameside",
    "Oven Cleaning Manchester", "Oven Cleaning Liverpool", "Oven Cleaning Salford", "Oven Cleaning Oldham", "Oven Cleaning Bolton", "Oven Cleaning Stockport", "Oven Cleaning Warrington",
    "Oven Cleaning Rochdale", "Oven Cleaning Bury", "Oven Cleaning Wigan", "Oven Cleaning Trafford", "Oven Cleaning Tameside",
    "Fridge Cleaning Manchester", "Fridge Cleaning Liverpool", "Fridge Cleaning Salford", "Fridge Cleaning Oldham", "Fridge Cleaning Bolton", "Fridge Cleaning Stockport", "Fridge Cleaning Warrington",
    "Fridge Cleaning Rochdale", "Fridge Cleaning Bury", "Fridge Cleaning Wigan", "Fridge Cleaning Trafford", "Fridge Cleaning Tameside",
    "Kitchen Cleaning Manchester", "Kitchen Cleaning Liverpool", "Kitchen Cleaning Salford", "Kitchen Cleaning Oldham", "Kitchen Cleaning Bolton", "Kitchen Cleaning Stockport", "Kitchen Cleaning Warrington",
    "Kitchen Cleaning Rochdale", "Kitchen Cleaning Bury", "Kitchen Cleaning Wigan", "Kitchen Cleaning Trafford", "Kitchen Cleaning Tameside",
    "Living Room Cleaning Manchester", "Living Room Cleaning Liverpool", "Living Room Cleaning Salford", "Living Room Cleaning Oldham", "Living Room Cleaning Bolton", "Living Room Cleaning Stockport", "Living Room Cleaning Warrington",
    "Living Room Cleaning Rochdale", "Living Room Cleaning Bury", "Living Room Cleaning Wigan", "Living Room Cleaning Trafford", "Living Room Cleaning Tameside",
    "Bedroom Cleaning Manchester", "Bedroom Cleaning Liverpool", "Bedroom Cleaning Salford", "Bedroom Cleaning Oldham", "Bedroom Cleaning Bolton", "Bedroom Cleaning Stockport", "Bedroom Cleaning Warrington",
    "Bedroom Cleaning Rochdale", "Bedroom Cleaning Bury", "Bedroom Cleaning Wigan", "Bedroom Cleaning Trafford", "Bedroom Cleaning Tameside",
    "Restaurant Cleaning Manchester", "Bar Cleaning Manchester", "Hospitality Cleaning Liverpool",
    "House Cleaning Manchester", "Domestic Cleaners Manchester", "Regular Cleaners Liverpool",
    "Move Out Cleaning Manchester", "Move In Cleaning Manchester", "Student Accommodation Cleaning Manchester"
  ].join(", ");

  // Return SEO tags WITHOUT the schemas – they are in the component
  return getSeoMeta({
    title: "Instant Quote | 5★ | Deep Cleaning, Regular Cleaning, End of Tenancy | Manchester & Liverpool",
    description: "Expert deep cleaning, regular domestic, end of tenancy, office, carpet, oven, after builders & more in Manchester, Liverpool, Salford, Oldham, Bolton, Stockport, Warrington, Rochdale, Bury, Wigan, Trafford & Tameside. Fully insured, vetted teams. Get your free quote in 60 seconds.",
    url: "https://www.ddeepcleaningservices.com/",
    image: "https://www.ddeepcleaningservices.com/favicon.svg", // ✅ Fixed 404 by using SVG
    keywords: fullKeywords
    // schema omitted intentionally
  });
};

// ==========================================
// 2. IMPORTS
// ==========================================
import HomeHero from "../components/home/HomeHero";
import HomeReviews from "../components/home/HomeReviews";
import HomeServices from "../components/home/HomeServices";
import HomeProcess from "../components/home/HomeProcess";
import HomeAreas from "../components/home/HomeAreas";
import HomeCTA from "../components/home/HomeCTA";
import { HomeFAQ } from "../components/HomeFAQ";
import StoryCard from "../components/home/StoryCard";
import ScrollProgress from "../components/home/ScrollProgress";

// FAQ data for rendering (must match the schema)
const homepageFaqs = [
  { question: "What areas do your professional cleaners cover?", answer: "Our local cleaning teams cover Manchester, Liverpool, Salford, Warrington, Bolton, Stockport, Oldham, Rochdale, Bury, Wigan, Trafford, Tameside and the wider North West region." },
  { question: "What is included in an end of tenancy clean?", answer: "Our comprehensive end of tenancy cleaning is designed to help secure your deposit. It includes a top-to-bottom deep clean of all rooms, inside cupboards, skirting boards, window frames, and full appliance cleaning (including ovens and fridge-freezers)." },
  { question: "What is the difference between a deep clean and a regular domestic clean?", answer: "A regular domestic clean keeps your home fresh on a weekly or fortnightly basis. A deep clean is a much more intensive, one-off service that tackles hard-to-reach areas, heavy grime, and scale buildup—perfect for spring cleaning or moving into a new home." },
  { question: "Do you bring your own cleaning supplies and equipment?", answer: "Yes, our vetted cleaners arrive fully equipped with industry-grade vacuums, mops, and premium cleaning products to handle everything from standard housekeeping to heavy-duty after builders cleaning." },
  { question: "How do I get a quote and book my clean?", answer: "Simply click 'Get Free Quote', choose your required service, and fill out our 30-second form. You'll get an instant price and can reserve a timeslot that fits your schedule." },
  { question: "Are your domestic and commercial cleaners insured?", answer: "Yes, 100%. Whether you are booking a house clean or a commercial office clean, all our staff are strictly vetted, DBS checked, and fully insured for your peace of mind." }
];

// ==========================================
// 3. MAIN PAGE COMPONENT (schemas rendered here)
// ==========================================
export default function HomePage() {
  return (
    <main className="scroll-smooth">
      {/* Structured Data – baked into static HTML, never duplicated */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "D DEEP Cleaning Services",
          "image": "https://www.ddeepcleaningservices.com/favicon.svg", // ✅ Fixed 404 by using SVG
          "@id": "https://www.ddeepcleaningservices.com",
          "url": "https://www.ddeepcleaningservices.com",
          "telephone": "07459416262",
          "priceRange": "From £50",
          "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "08:00",
            "closes": "18:00"
          }],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "90"
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
            { "@type": "City", "name": "Oldham" },
            { "@type": "City", "name": "Rochdale" },
            { "@type": "City", "name": "Bury" },
            { "@type": "City", "name": "Wigan" },
            { "@type": "City", "name": "Trafford" },
            { "@type": "City", "name": "Tameside" }
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
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What areas do your professional cleaners cover?",
              "acceptedAnswer": { "@type": "Answer", "text": "Our local cleaning teams cover Manchester, Liverpool, Salford, Warrington, Bolton, Stockport, Oldham, Rochdale, Bury, Wigan, Trafford, Tameside and the wider North West region." }
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
        }) }}
      />

      {/* Page Content */}
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
