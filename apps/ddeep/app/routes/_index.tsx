// app/routes/_index.tsx
import type { MetaFunction } from "react-router";

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

  return [
    { title: "Deep Cleaning Manchester & Liverpool | D DEEP Cleaning Services" },
    {
      name: "description",
      content: "Professional cleaning in Manchester & Liverpool. Specialists in Deep Cleaning, End of Tenancy, Regular Domestic, Office, After Builders, Hospitality, Student Accommodation, and CQC Healthcare Cleaning."
    },
    { property: "og:title", content: "D DEEP Cleaning | Commercial & Residential Cleaning Experts" },
    {
      property: "og:description",
      content: "Complete cleaning solutions across the North West: From domestic deep cleans and carpet stain removal to clinical healthcare and office maintenance."
    },
    {
      name: "keywords",
      content: "Deep Cleaning Manchester, End of Tenancy Cleaning Liverpool, Regular Cleaners Manchester, After Builders Cleaning, Office Cleaning Liverpool, Restaurant Cleaning, Student Accommodation Turnaround, Clinical Cleaning CQC, Carpet Cleaning Manchester, Appliance Cleaning, Move out cleaning, HMO cleaning North West"
    },
    { name: "robots", content: "index, follow" },
    { "script:ld+json": businessSchema }
  ];
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
import FixedCTA2 from "../components/mobilenav"; // Kept if you use it globally

// Client Components
// Instead of importing from a "ui" folder:
import StoryCard from "../components/home/StoryCard";
import ScrollProgress from "../components/home/ScrollProgress";






// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  return गुलाबी (
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
