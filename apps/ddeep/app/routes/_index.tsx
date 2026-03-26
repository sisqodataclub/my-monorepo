"use client"; 

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

// ==========================================
// 1. SERVER-RENDERED SEO & SCHEMA (React Router v7)
// ==========================================
export function meta() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "D DEEP Cleaning Services",
    "image": "https://www.ddeepcleaningservices.com/logo.png", // Ensure you have a logo.png in your public folder!
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
    // Google reads the Schema directly from the document head!
    { "script:ld+json": businessSchema } 
  ];
}

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

// ==========================================
// 3. STORYCARD COMPONENT
// ==========================================
interface StoryCardProps {
  children: ReactNode;
  bgImage?: string;
}

function StoryCard({ children, bgImage }: StoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The math is still calculating, but we are not applying it to the elements below
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.5, 1]);

  return (
    <section
      ref={ref}
      // DISABLED SNAP SCROLLING: Removed 'snap-start' to allow normal scrolling
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {bgImage && (
        <motion.div
          className="absolute inset-0 bg-center bg-cover"
          // DISABLED PARALLAX: Commented out the scale transform
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {bgImage && <div className="absolute inset-0 bg-black/30" />}

      <motion.div
        className="relative max-w-6xl px-6 text-center w-full"
        // DISABLED PARALLAX & SCROLL FADE: Commented out dynamic styles
        // style={{ y, opacity }}
        
        // Note: Kept the entry animation active so the text still fades in nicely once. 
        // If you want ZERO animation, comment out these next 4 lines too.
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 35, restDelta: 0.001 });

  return (
    // DISABLED SNAP SCROLLING: Removed 'snap-y snap-mandatory'
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

      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-500 rounded-full origin-left shadow-lg z-50"
        style={{ scaleX }}
      />

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
