"use client";

import { Link } from "react-router"; // ✅ react-router, not react-router-dom
import type { ServiceData } from "./servicesContent";
import { servicesContent } from "./servicesContent";

/* ================= HOME SECTIONS ================= */
import HomeIntro from "../home/HomeIntro";
import HomeIntro2 from "../home/HomeIntro2";
import HomeProcess from "../home/HomeProcess";
import HomeAreas from "../home/HomeAreas";
import HomeReviews from "../home/HomeReviews";
import HomeCTA from "../home/HomeCTA";
import { HomeFAQ } from "../HomeFAQ";

/* ================= ICONS ================= */
import { FaShieldAlt, FaLeaf, FaCertificate, FaCheckCircle } from "react-icons/fa";
import HeroImage from "../../assets/bg.jpg";

/* ================= STORYCARD COMPONENT ================= */
interface StoryCardProps {
  children: React.ReactNode;
  bgImage?: string;
  className?: string;
  isDark?: boolean;
}

function StoryCard({ children, bgImage, className = "" }: StoryCardProps) {
  return (
    <section className={`relative w-full min-h-[80vh] flex flex-col items-center justify-center py-20 lg:py-32 overflow-hidden ${className}`}>
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
      )}
      <div className="relative z-10 w-full max-w-7xl px-6 lg:px-8 flex flex-col items-center justify-center">
        {children}
      </div>
    </section>
  );
}

/* ================= HERO SECTION ================= */
function ServiceHero({ data }: { data: ServiceData }) {
  const badges = [
    { icon: <FaShieldAlt />, text: "Fully Insured" },
    { icon: <FaLeaf />, text: "Eco-Friendly" },
    { icon: <FaCertificate />, text: "Vetted Pros" },
  ];

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {badges.map((b, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase">
            <span className="text-green-400">{b.icon}</span> {b.text}
          </div>
        ))}
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-md">
        {data.heroTitle}
        <span className="block text-green-400 text-xl md:text-3xl mt-4 font-bold uppercase tracking-[0.2em]">
          Professional Service
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-100 max-w-2xl mb-10 font-medium">{data.heroSubtitle}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        {data.heroButtons.map((btn, i) => (
          <Link
            key={i}
            to={btn.href}
            className={`px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-95 ${
              btn.primary
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20"
            }`}
          >
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= FEATURES SECTION ================= */
function ServiceFeatures({ data }: { data: ServiceData }) {
  return (
    <div className="flex flex-col items-center text-center w-full">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">What’s Included</h2>
        <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mb-6" />
        <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto">{data.ctaPrimaryText}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {data.featureCards.map((card, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>

            <ul className="space-y-3">
              {card.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-600 text-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" /> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-16 text-green-700 font-bold bg-green-50 px-8 py-3 rounded-full border">{data.ctaSecondaryText}</p>
    </div>
  );
}

/* ================= MAIN DYNAMIC PAGE ================= */
export default function DynamicServicePage({ data }: { data: ServiceData }) {
  const faqData = [
    {
      question: "Which areas in Greater Manchester and Lancashire do you cover?",
      answer:
        "We provide professional cleaning services across the entire North West. This includes Manchester City Centre, Salford Quays, Trafford Park, Didsbury, Altrincham, Stockport, Bolton, Bury, Oldham, Rochdale, Preston, Blackburn, Burnley, Warrington, Wigan, and Chorley.",
    },
    {
      question: "Does your End of Tenancy cleaning guarantee deposit recovery?",
      answer:
        "Yes. Our End of Tenancy service follows a rigorous, agency-approved checklist designed to meet landlord requirements. A 'Cleaning Certificate' is provided upon completion.",
    },
    {
      question: "What standards do you follow for Healthcare & Clinical cleaning?",
      answer:
        "Hygiene is our priority. Our healthcare cleaning team is trained in infection control and cross-contamination prevention, meeting CQC standards.",
    },
    {
      question: "Do you offer out-of-hours cleaning for offices and hospitality venues?",
      answer:
        "Yes. Flexible scheduling including early mornings, late evenings, and weekends is available to minimize disruption.",
    },
    {
      question: "How does your Carpet Cleaning process work?",
      answer:
        "We use professional-grade hot water extraction (steam cleaning), removing deep-seated stains, allergens, and bacteria, while extending carpet life.",
    },
    {
      question: "What is included in a Post-Construction clean?",
      answer:
        "We remove fine masonry dust, paint splatters, and debris left by builders, ensuring the property is move-in ready.",
    },
    {
      question: "Are your cleaners vetted for Student Accommodation turnarounds?",
      answer:
        "Yes. All staff are fully vetted and background-checked. We ensure spotless rooms for high-volume student housing.",
    },
  ];

  return (
    <div className="w-full">
      <StoryCard bgImage={HeroImage}>
        <ServiceHero data={data} />
      </StoryCard>

      <StoryCard className="bg-slate-50">
        <ServiceFeatures data={data} />
      </StoryCard>

      <StoryCard><HomeIntro /></StoryCard>
      <StoryCard className="bg-slate-50"><HomeIntro2 /></StoryCard>
      <StoryCard><HomeProcess /></StoryCard>
      <StoryCard className="bg-slate-50"><HomeAreas /></StoryCard>
      <StoryCard><HomeReviews /></StoryCard>
      <StoryCard className="bg-green-950 text-white"><HomeCTA /></StoryCard>
      <StoryCard><HomeFAQ faqs={faqData} /></StoryCard>
    </div>
  );
}
