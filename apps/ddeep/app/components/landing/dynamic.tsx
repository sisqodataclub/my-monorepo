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
  const heading = data.pageContent?.h1 ?? `${data.heroTitle} ${locationText}`;

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

      <div className="flex flex-col sm:flex-row gap-4">
        {data.heroButtons.map((btn, i) =>
          btn.primary ? (
            <button
              key={i}
              onClick={openModal}
              className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
            >
              {btn.text}
            </button>
          ) : (
            <button
              key={i}
              onClick={openModal}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              {btn.text}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ================= UNIQUE PER-CITY CONTENT SECTION ================= */
function CityContentSection({ content }: { content: CityContent }) {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 lg:px-8 py-16 text-left">
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
        {content.primaryKeyword.replace(/\b\w/g, (c) => c.toUpperCase())}
      </h2>
      <p className="text-slate-700 leading-relaxed mb-6">{content.serviceDetail}</p>
      <p className="text-slate-700 leading-relaxed mb-6">{content.localProof}</p>

      {content.faqs?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">FAQs</h3>
          <dl className="space-y-4">
            {content.faqs.map((f, i) => (
              <div key={i}>
                <dt className="font-semibold text-slate-900">{f.q}</dt>
                <dd className="text-slate-700">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

/* ================= MAIN DYNAMIC PAGE ================= */
export default function DynamicServicePage({
  data,
}: {
  data: ServiceData & { cityName?: string; pageContent?: CityContent | null };
}) {
  return (
    <main className="w-full">
      <StoryCard bgImage={HeroImage} isAboveFold>
        <ServiceHero data={data} />
      </StoryCard>

      {/* Unique per-city body copy — only rendered when cityContent exists. */}
      {data.pageContent && <CityContentSection content={data.pageContent} />}

      <HomeProcess />
      <HomeAreas />
      <HomeReviews />
      <HomeGallery />
      <HomeFAQ />
      <HomeCTA />
    </main>
  );
}
