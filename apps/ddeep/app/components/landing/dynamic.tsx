// app/components/landing/dynamic.tsx
"use client";

import { Link } from "react-router";
import type { ServiceData } from "./servicesContent";
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
function ServiceHero({ data }: { data: ServiceData & { cityName?: string } }) {
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

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {badges.map((b, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase">
            <span className="text-green-400">{b.icon}</span> {b.text}
          </div>
        ))}
      </div>

      {/* H1 now includes dynamic location */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-md">
        {data.heroTitle} {locationText}
        <span className="block text-green-400 text-xl md:text-3xl mt-4 font-bold uppercase tracking-[0.2em]">
          Professional Service
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-100 max-w-2xl mb-4 font-medium">{data.heroSubtitle}</p>

      {/* City availability line - only render on generic pages, hide on hyper-local pages */}
      {!data.cityName && data.cities && data.cities.length > 0 && (
        <p className="text-slate-300 text-sm mb-6">
          Available in {data.cities.join(", ")}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {data.heroButtons.map((btn, i) =>
          btn.primary ? (
            <button
              key={i}
              onClick={openModal}
              className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
            >
              {btn.label}
            </button>
          ) : (
            <button
              key={i}
              onClick={openModal}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
            >
              {btn.label}
            </button>
          )
        )}
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

      {/* Unique "Why Choose Us" Section */}
      {data.whyChooseUs && data.whyChooseUs.length > 0 && (
        <div className="mb-16 max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-sm w-full text-left">
          <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">Why Choose Our Service</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.whyChooseUs.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

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
export default function DynamicServicePage({ data }: { data: ServiceData & { cityName?: string } }) {
  return (
    <div className="w-full">
      {/* 1. Hero */}
      <StoryCard bgImage={HeroImage} isAboveFold>
        <ServiceHero data={data} />
      </StoryCard>

      {/* 2. What’s Included & Why Choose Us */}
      <StoryCard className="bg-slate-50">
        <ServiceFeatures data={data} />
      </StoryCard>

      {/* 3. ✅ Visual Gallery (Filtered dynamically by service title if desired, or showing all) */}
      <StoryCard>
        <HomeGallery filterCategory={data.title} />
      </StoryCard>

      {/* 4. Social Proof */}
      <StoryCard className="bg-slate-50">
        <HomeReviews />
      </StoryCard>

      {/* 5. Why Choose Us (Process) */}
      <StoryCard>
        <HomeProcess />
      </StoryCard>

      {/* 6. Areas Served */}
      <StoryCard className="bg-slate-50">
        <HomeAreas />
      </StoryCard>

      {/* 7. FAQ */}
      <StoryCard>
        <HomeFAQ faqs={data.faqs} />
      </StoryCard>

      {/* 8. Final Call-to-Action */}
      <StoryCard className="bg-green-950 text-white">
        <HomeCTA />
      </StoryCard>
    </div>
  );
}
