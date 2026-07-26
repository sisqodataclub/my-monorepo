"use client";

import { motion } from "framer-motion";
import { FaStar, FaGoogle, FaQuoteLeft, FaCheckCircle, FaStarHalfAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

// 1. STATS DATA (unchanged)
const platformStats = [
  {
    name: "Google",
    rating: 4.9,
    icon: FaGoogle,
    iconColor: "text-blue-500",
    url: "https://www.google.co.uk/search?ibp=gwp;0,7&q=D+Deep+cleaning+Services+ltd&ludocid=2179265534533258076&lsig=AB86z5WxQdL0CPBNvr0iyBeYQFV4&gfe_rd=mr&pli=1#gfe_rd=mr&lpg=cid:CgIgAQ%3D%3D&pli=1"
  },
  {
    name: "Trustpilot",
    rating: 4.8,
    icon: FaStar,
    iconColor: "text-green-500",
    url: "" // add your link
  }
];

// 2. REVIEWS DATA (unchanged)
const reviews = [
  { name: "Sarah J.", role: "Homeowner", text: "Professional and reliable. DDeep is the only company I kept for my weekly deep cleaning.", rating: 5 },
  { name: "Mark T.", role: "Office Mgr", text: "Punctual and invisible. Our office has never looked better. Highly recommend their commercial team.", rating: 5 },
  { name: "Emma W.", role: "Tenant", text: "Got my full deposit back. End-of-tenancy experts in Manchester. Stress-free experience.", rating: 5 },
  { name: "James A.", role: "Restaurateur", text: "Hygiene is critical. They understand kitchen inspection standards and clinical cleanliness.", rating: 5 },
  { name: "Chloe E.", role: "Parent", text: "Eco-friendly products were a must for my kids. They delivered a perfect house clean.", rating: 4.5 },
];

const marqueeReviews = [...reviews, ...reviews, ...reviews];

export default function HomeReviewsCarousel() {
  // Track if screen is mobile (we'll use CSS, but this helps for JSX logic)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="reviews" className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-white snap-start pt-24 pb-20 lg:py-0">
      {/* Background (unchanged) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/50 via-white to-teal-50/50 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden="true"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-evenly lg:justify-between h-full px-4 lg:px-8 gap-8 lg:gap-12">
        {/* Left Header & Stats (unchanged) */}
        <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 shrink-0 lg:w-5/12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-green-950 tracking-tight leading-tight">
              5-Star Rated <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                Cleaning Experts.
              </span>
            </h2>
            <p className="hidden lg:block mt-6 text-lg text-slate-500 max-w-md">
              The North West's most trusted choice for deep cleaning, end-of-tenancy, and commercial maintenance.
            </p>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center lg:justify-start gap-3" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            {platformStats.map((stat) => {
              const isLink = Boolean(stat.url);
              const CardWrapper = isLink ? "a" : "div";
              return (
                <CardWrapper
                  key={stat.name}
                  {...(isLink ? { href: stat.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`flex items-center gap-2 bg-white/80 backdrop-blur-md border border-green-100 px-3 py-1.5 md:px-5 md:py-3 rounded-lg md:rounded-xl shadow-sm min-w-[140px] md:min-w-[180px] ${isLink ? 'hover:scale-105 hover:bg-green-50 hover:shadow-md transition-all cursor-pointer' : ''}`}
                >
                  <div className={`text-base md:text-xl ${stat.iconColor}`} aria-hidden="true"><stat.icon /></div>
                  <div>
                    <div className="flex text-yellow-400 text-[10px] md:text-xs" aria-label={`${stat.rating} star rating`}>
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <p className="text-green-950 font-bold text-xs md:text-base leading-none">
                      {stat.rating}/5 <span className="text-slate-400 font-normal ml-1 hidden sm:inline">{stat.name}</span>
                    </p>
                  </div>
                </CardWrapper>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT SIDE: REVIEWS */}
        <div className="relative w-full lg:w-7/12 flex-grow lg:flex-grow-0 flex flex-col justify-center overflow-hidden h-auto lg:h-auto">
          {/* MOBILE: Static Grid (fast, immediate) */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {reviews.map((review, i) => (
              <ReviewCard key={`mobile-${i}`} review={review} />
            ))}
          </div>

          {/* DESKTOP: Animated Marquee (smooth on large screens) */}
          <div className="hidden lg:block">
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" aria-hidden="true" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" aria-hidden="true" />

            {/* Row 1 */}
            <div className="flex mb-0 md:mb-6">
              <motion.div
                className="flex gap-4 px-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                {marqueeReviews.map((review, i) => (
                  <ReviewCard key={`top-${i}`} review={review} />
                ))}
              </motion.div>
            </div>

            {/* Row 2 */}
            <div className="hidden md:flex">
              <motion.div
                className="flex gap-4 px-4"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              >
                {marqueeReviews.map((review, i) => (
                  <ReviewCard key={`bot-${i}`} review={review} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ReviewCard component (unchanged)
function ReviewCard({ review }: { review: any }) {
  return (
    <div className="w-[260px] sm:w-[350px] shrink-0 p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-white border border-green-50 shadow-sm transition-all cursor-default flex flex-col h-full justify-between">
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <div className="flex items-center gap-0.5 md:gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              {i < Math.floor(review.rating) ? <FaStar className="text-yellow-400 text-[10px] md:text-sm" /> : <FaStarHalfAlt className="text-yellow-400 text-[10px] md:text-sm" />}
            </div>
          ))}
        </div>
        <FaQuoteLeft className="text-green-100 text-lg md:text-2xl" aria-hidden="true" />
      </div>

      <blockquote className="text-slate-600 text-xs md:text-sm lg:text-base leading-relaxed italic mb-3 md:mb-6 line-clamp-3 md:line-clamp-none">
        "{review.text}"
      </blockquote>

      <div className="flex items-center gap-2 md:gap-4 mt-auto">
        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-[10px] md:text-sm shrink-0" aria-hidden="true">
          {review.name.charAt(0)}
        </div>
        <div>
          <cite className="not-italic text-green-950 font-bold text-xs md:text-sm flex items-center gap-1">
            {review.name} <FaCheckCircle className="text-blue-400 text-[10px]" aria-label="Verified Customer" />
          </cite>
          <p className="text-slate-400 text-[10px] md:text-xs">{review.role}</p>
        </div>
      </div>
    </div>
  );
}
