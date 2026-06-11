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
    "priceRange": "From £50", // Clears GSC Schema Warning & adds price floor
    "aggregateRating": {      // Clears GSC Schema Warning & enables search result stars
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
      { "@type": "City", "name": "Warrington" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cleaning Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Regular Domestic Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "End of Tenancy Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Appliance & Oven Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carpet & Upholstery Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Office Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "After Builders Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hospitality & Restaurant Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Student Accommodation Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Healthcare & Clinical Cleaning" } }
      ]
    }
  };

  return getSeoMeta({
    title: "Deep & Domestic Cleaning Manchester & Liverpool | 5★ D DEEP",
    description: "Top-rated professional home & commercial cleaners. Specialists in deep cleaning, regular domestic house cleaning, and end of tenancy across Manchester & Liverpool. Fully insured & vetted. Get a free quote today!",
    url: "https://www.ddeepcleaningservices.com/", // Forces canonical URL with trailing slash
    image: "https://www.ddeepcleaningservices.com/logo.png",
    keywords: "Deep Cleaning Manchester, Domestic Cleaners Manchester, Regular Cleaning Liverpool, End of Tenancy Cleaning Manchester, After Builders Cleaning, Office Cleaning Liverpool, House Cleaning Manchester",
    schema: businessSchema
  });
};

// ==========================================
// 2. IMPORTS
// ==========================================
import HomeHero from "../components/home/HomeHero";
import HomeIntro from "../components/home/HomeIntro";
import HomeIntro2 from "../components/home/HomeIntro2";
import HomeServices from "../components/home/HomeServices";
import HomeProcess from "../components/home/HomeProcess";
import HomeAreas from "../components/home/HomeAreas";
import HomeReviews from "../components/home/HomeReviews";
import HomeCTA from "../components/home/HomeCTA";
import FixedCTA2 from "../components/mobilenav"; 

// Client Components
import StoryCard from "../components/home/StoryCard";
import ScrollProgress from "../components/home/ScrollProgress";

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  return (
    <main className="scroll-smooth">
      <StoryCard>
        <HomeHero />
      </StoryCard>

      <StoryCard>
        <HomeIntro />
      </StoryCard>

      <StoryCard>
        <HomeIntro2 />
      </StoryCard>

      <StoryCard>
        <HomeServices />
      </StoryCard>

      <StoryCard>
        <HomeProcess />
      </StoryCard>

      <StoryCard>
        <HomeAreas />
      </StoryCard>

      <StoryCard>
        <HomeReviews />
      </StoryCard>

      <StoryCard>
        <HomeCTA />
      </StoryCard>

      {/* The blue progress bar at the top */}
      <ScrollProgress />

      <style>{`
        /* DISABLED CSS SNAP SCROLLING TO MATCH INACTIVE ANIMATIONS */
        html {
          scroll-behavior: smooth;
        }
        body { margin: 0; }
      `}</style>
    </main>
  );
}
