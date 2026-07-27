// app/components/home/HomeReviews.tsx
"use client";

import { motion } from "framer-motion";
import { FaStar, FaGoogle, FaQuoteLeft, FaCheckCircle, FaStarHalfAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

// 1. STATS DATA
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
    url: "" 
  }
];

// 2. REAL REVIEWS DATA (Imported from your verified profile)
const reviews = [
  { 
    name: "Side Eye", 
    role: "Verified Customer", 
    text: "Their enquiries response was swift and right on time on the day of my booking! The gentleman that came to clean my bathroom did an amazing job! I will use them again and again. Don’t hesitate to call them!", 
    rating: 5 
  },
  { 
    name: "Barbara Walker", 
    role: "Verified Customer", 
    text: "Great price and outstanding quality. Exceptional cleaning service from start to finish!", 
    rating: 5 
  },
  { 
    name: "Silvana Pedro", 
    role: "Homeowner", 
    text: "Excellent service! The team was highly professional, careful and polite throughout. I was absolutely delighted with the service and very pleased with the final result. I would highly recommend them without hesitation!", 
    rating: 5 
  },
  { 
    name: "Cherry Blossom", 
    role: "Landlord", 
    text: "Absolutely brilliant service. After my tenants moved out, my three-floor house was in a terrible state. The team arrived and transformed the property completely.", 
    rating: 5 
  },
  { 
    name: "Smith", 
    role: "Local Guide", 
    text: "I recently hired D Deep Cleaning Services Ltd for a full deep clean and I couldn't be happier with the results. The team was thorough, efficient, and professional.", 
    rating: 5 
  },
  { 
    name: "Zak Headworth-Singh", 
    role: "Homeowner", 
    text: "Great and friendly service. Full deep steam clean - all grub and dirt gone!", 
    rating: 5 
  },
  { 
    name: "Haitham Mahdi", 
    role: "Local Guide", 
    text: "Thanks for your amazing deep cleaning. The price was so fair and the results exceeded expectations!", 
    rating: 5 
  },
];

const marqueeReviews = [...reviews, ...reviews, ...reviews];

export default function HomeReviewsCarousel() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <section id="reviews" className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-white snap-start pt-24 pb-20 lg:py-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/50 via-white to-teal-50/50 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden="true"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-evenly lg:justify-between h-full px-4 lg:px-8 gap-8 lg:gap-12">

        {/* Left Header & Stats */}
        <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 shrink-0 lg:w-5/12">
          {isMounted ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-green-950 tracking-tight leading-tight">
                5-Star Rated <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                  Cleaning Experts.
                </span>
              </h2>
              <p className="mt-3 lg:mt-6 text-sm lg:text-lg text-slate-500 max-w-md">
                Real feedback from real customers across the North West. Fully insured, trusted, and top-rated.
              </p>
            </motion.div>
          ) : (
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-green-950 tracking-tight leading-tight">
                5-Star Rated <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                  Cleaning Experts.
                </span>
              </h2>
              <p className="mt-3 lg:mt-6 text-sm lg:text-lg text-slate-500 max-w-md">
                Real feedback from real customers across the North West. Fully insured, trusted, and top-rated.
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
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
          </div>
        </div>

        {/* RIGHT SIDE: REVIEWS */}
        <div className="relative w-full lg:w-7/12 flex-grow lg:flex-grow-0 flex flex-col justify-center overflow-hidden">

          {/* 📱 MOBILE: Swipeable Horizontal Snap Carousel */}
          <div className="lg:hidden w-full">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 px-2 py-2 -mx-4 sm:mx-0">
              {reviews.map((review, i) => (
                <div key={`mobile-${i}`} className="snap-center shrink-0 w-[85%] max-w-[300px]">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-1 mt-3 text-xs text-slate-400 font-medium">
              <span>Swipe for more reviews</span>
              <span className="animate-pulse">→</span>
            </div>
          </div>

          {/* 💻 DESKTOP: Animated Marquee */}
          <div className="hidden lg:block relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" aria-hidden="true" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" aria-hidden="true" />

            {isMounted ? (
              <>
                {/* Row 1 */}
                <div className="flex mb-4">
                  <motion.div
                    className="flex gap-4 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
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
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                  >
                    {marqueeReviews.map((review, i) => (
                      <ReviewCard key={`bot-${i}`} review={review} />
                    ))}
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="flex gap-4 px-4 overflow-hidden">
                {reviews.map((review, i) => (
                  <ReviewCard key={`static-${i}`} review={review} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// ReviewCard component
function ReviewCard({ review }: { review: any }) {
  return (
    <div className="w-full lg:w-[360px] shrink-0 p-5 md:p-6 rounded-2xl md:rounded-[2rem] bg-white border border-green-100/80 shadow-md shadow-green-950/[0.03] transition-all cursor-default flex flex-col h-full justify-between">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="flex items-center gap-0.5 md:gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              {i < Math.floor(review.rating) ? <FaStar className="text-yellow-400 text-xs md:text-sm" /> : <FaStarHalfAlt className="text-yellow-400 text-xs md:text-sm" />}
            </div>
          ))}
        </div>
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
          <FaQuoteLeft className="text-green-600/70 text-xs md:text-sm" aria-hidden="true" />
        </div>
      </div>

      <blockquote className="text-slate-700 text-sm md:text-base leading-relaxed italic mb-4 md:mb-6">
        "{review.text}"
      </blockquote>

      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs md:text-sm shrink-0" aria-hidden="true">
          {review.name.charAt(0)}
        </div>
        <div>
          <cite className="not-italic text-green-950 font-bold text-xs md:text-sm flex items-center gap-1">
            {review.name} <FaCheckCircle className="text-blue-500 text-[11px]" aria-label="Verified Customer" />
          </cite>
          <p className="text-slate-400 text-[11px] md:text-xs">{review.role}</p>
        </div>
      </div>
    </div>
  );
}
