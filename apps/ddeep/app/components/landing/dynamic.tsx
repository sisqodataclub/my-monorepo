// app/components/landing/dynamic.tsx
"use client";

import { Link } from "react-router";
import type { ServiceData } from "./servicesContent";
import type { CityContent } from "./cityContent";
import { useContactModal } from "../../context/ContactModalContext";

/* ================= HOME SECTIONS ================= */
import HomeProcess from "../home/HomeProcess";
import HomeAreas from "../home/HomeAreas";
import HomeReviews from "../home/HomeReviews";
import HomeGallery from "../home/HomeGallery"; // ✅ 1. Imported HomeGallery
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
  isAboveFold?: boolean;
}

function StoryCard({ children, bgImage, className = "", isAboveFold = false }: StoryCardProps) {
  return (
    <section className={`relative w-full min-h-[80vh] flex flex-col items-center justify-center py-20 lg:py-32 overflow-hidden ${className}`}>
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt=""
            loading={isAboveFold ? undefined : "lazy"}
            className="w-full h-full object-cover"
          />
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
function ServiceHero({ data }: { data: ServiceData & { cityName?: string; pageContent?: CityContent | null } }) {
  const { openModal } = useContactModal();
  const badges = [
    { icon: <FaShieldAlt />, text: "Fully Insured" },
    { icon: <FaLeaf />, text: "Eco-Friendly" },
    { icon: <FaCertificate />, text: "Vetted Pros" },
  ];

  // Use specific city name if available (hyper-local page), otherwise fall back to multi-city list
  const locationText = data.cityName
    ? `in ${data.cityName}`
    : data.cities?.length
    ? `in ${data.cities.slice(0, 3).join(", ")} & North West`
    : "";

  // Unique per-page H1 comes from cityContent when present.
  // On hyper-local pages the route already appends " in {city}" to heroTitle,
  // so only append locationText on generic (non-city) pages to avoid duplication.
  const heading =
    data.pageContent?.h1 ??
    (data.cityName ? data.heroTitle : `${data.heroTitle} ${locationText}`);

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {badges.map((b, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase">
            <span className="text-green-400">{b.icon}</span> {b.text}
          </div>
        ))}
      </div>

      {/* H1 now includes dynamic location (or the unique per-city H1) */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-md">
        {heading}
        <span className="block text-green-400 text-xl md:text-3xl mt-4 font-bold uppercase tracking-[0.2em]">
          Professional Service
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-100 max-w-2xl mb-4 font-medium">
        {data.pageContent?.intro ?? data.heroSubtitle}
      </p>

      {/* City availability line - only render on generic pages, hide on hyper-local pages */}
      {!data.cityName && data.cities && data.cities.length > 0 && (
        <p className="text-slate-300 text-sm mb-6">
          Available in {data.cities.join(", ")}
        </p>
      )}
