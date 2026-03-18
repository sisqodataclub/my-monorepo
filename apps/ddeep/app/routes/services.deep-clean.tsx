"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import HomeHero from "../components/home/HomeHero";
import HomeIntro from "../components/home/HomeIntro";
import HomeIntro2 from "../components/home/HomeIntro2";
import HomeProcess from "../components/home/HomeProcess";
import HomeAreas from "../components/home/HomeAreas";
import HomeReviews from "../components/home/HomeReviews";
import HomeCTA from "../components/home/HomeCTA";
import FixedCTA2 from "../components/mobilenav";
import DeepCleaningContent from "../components/landing/DeepCleaningContent";
import { HomeFAQ } from "../components/HomeFAQ";
import type { FAQItem } from "../components/HomeFAQ";
import { usePageSEO } from "../hooks/usePageSEO";

// FAQ data
const faqData: FAQItem[] = [
  {
    question: "What is included in your deep cleaning service?",
    answer:
      "Our deep cleaning includes kitchens, bathrooms, living areas, bedrooms, offices, and commercial spaces. We pay attention to detail and use eco-friendly cleaning products.",
  },
  {
    question: "Do you provide end-of-tenancy cleaning?",
    answer:
      "Yes, we specialise in end-of-tenancy and post-renovation deep cleaning to help tenants and landlords meet inspection standards.",
  },
  {
    question: "Are your cleaners insured and trained?",
    answer:
      "Absolutely. All our cleaners are trained, certified, and fully insured for peace of mind.",
  },
  {
    question: "How can I get a free quote?",
    answer:
      "You can request a free quote via our website, WhatsApp, phone, or email. We respond fast with transparent pricing.",
  },
];

/** =====================
 * StoryCard Component
 * ===================== */
interface StoryCardProps {
  children: React.ReactNode;
  bgImage?: string;
}

function StoryCard({ children, bgImage }: StoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Parallax & subtle scale
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.5, 1]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center snap-start overflow-hidden"
    >
      {bgImage && (
        <motion.div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${bgImage})`, scale }}
        />
      )}

      {bgImage && <div className="absolute inset-0 bg-black/30" />}

      <motion.div
        className="relative max-w-6xl px-6 text-center w-full"
        style={{ y, opacity }}
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

/** =====================
 * DeepClean Page
 * ===================== */
export default function DeepClean() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 35, restDelta: 0.001 });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const utm = searchParams.get("utm_campaign");

  const campaignText = utm
    ? `Special Offer for ${utm}`
    : "Need a deep clean? Fast quotes & trusted professionals.";

  const trackConversion = (type: string) => {
    console.log(`Conversion tracked: ${type}`);
  };

  // SEO
  usePageSEO({
    title: "Deep Cleaning Services in Manchester | D Deep Cleaning Services",
    description:
      "Professional deep cleaning services in Manchester & Lancashire. Fully insured cleaners for homes and businesses. Free quotes available.",
    keywords:
      "deep cleaning manchester, professional deep cleaners near me, house deep cleaning services, commercial deep cleaning, end of tenancy cleaning, post construction cleaning",
    schema: {
      "@context": "https://schema.org",
      "@type": "CleaningService",
      name: "D Deep Cleaning Services",
      areaServed: ["Manchester", "Lancashire"],
      telephone: "+441234567890",
      priceRange: "££",
    },
  });

  return (
    <main className="snap-y snap-mandatory scroll-smooth">


      {/* ================= DeepCleaningContent ================= */}
      <StoryCard>
        <DeepCleaningContent />
      </StoryCard>

      {/* ================= Intro Sections ================= */}
      <StoryCard>
        <HomeIntro />
      </StoryCard>

      <StoryCard>
        <HomeIntro2 />
      </StoryCard>

      {/* ================= Process / Areas / Reviews ================= */}
      <StoryCard>
        <HomeProcess />
      </StoryCard>

      <StoryCard>
        <HomeAreas />
      </StoryCard>

      <StoryCard>
        <HomeReviews />
      </StoryCard>

      

      {/* ================= CTA Section ================= */}
      <StoryCard>
        <HomeCTA />
      </StoryCard>

      {/* ================= FAQ ================= */}
      <StoryCard>
        <HomeFAQ faqs={faqData} />
      </StoryCard>

      {/* ================= Scroll Progress Bar ================= */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-500 rounded-full origin-left shadow-lg z-50"
        style={{ scaleX }}
      />

      {/* ================= Global Styles for Snap ================= */}
      <style>{`
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
        }

        section {
          scroll-snap-align: start;
        }
      `}</style>
    </main>
  );
}
