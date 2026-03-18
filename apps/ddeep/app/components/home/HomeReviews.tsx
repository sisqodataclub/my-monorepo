import { motion } from "framer-motion";
import { FaStar, FaGoogle, FaQuoteLeft, FaCheckCircle, FaStarHalfAlt } from "react-icons/fa";

// 1. STATS DATA
const platformStats = [
  { 
    name: "Google", 
    rating: 4.9, 
    icon: FaGoogle, 
    iconColor: "text-blue-500" 
  },
  { 
    name: "Trustpilot", 
    rating: 4.8, 
    icon: FaStar, 
    iconColor: "text-green-500" 
  }
];

// 2. REVIEWS DATA
const reviews = [
  { name: "Sarah J.", role: "Homeowner", text: "Professional and reliable. DDeep is the only company I kept for my weekly deep cleaning.", rating: 5 },
  { name: "Mark T.", role: "Office Mgr", text: "Punctual and invisible. Our office has never looked better. Highly recommend their commercial team.", rating: 5 },
  { name: "Emma W.", role: "Tenant", text: "Got my full deposit back. End-of-tenancy experts in Manchester. Stress-free experience.", rating: 5 },
  { name: "James A.", role: "Restaurateur", text: "Hygiene is critical. They understand kitchen inspection standards and clinical cleanliness.", rating: 5 },
  { name: "Chloe E.", role: "Parent", text: "Eco-friendly products were a must for my kids. They delivered a perfect house clean.", rating: 4.5 },
];

const marqueeReviews = [...reviews, ...reviews, ...reviews];

export default function HomeReviewsCarousel() {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "D DEEP Cleaning Services",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "215",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.rating }
    }))
  };

  return (
    <section id="reviews" className="relative w-full h-[100dvh] flex flex-col justify-center overflow-hidden bg-white snap-start pt-24 pb-20 lg:py-0">
      
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/50 via-white to-teal-50/50 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden="true"></div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-evenly lg:justify-between h-full px-4 lg:px-8 gap-8 lg:gap-12">
        
        {/* 1. LEFT SIDE: HEADER & STATS */}
        <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 shrink-0 lg:w-5/12">
          
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="text-center lg:text-left"
          >
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

          {/* Stats Cards */}
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {platformStats.map((stat) => (
               <div key={stat.name} className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-green-100 px-3 py-1.5 md:px-5 md:py-3 rounded-lg md:rounded-xl shadow-sm min-w-[140px] md:min-w-[180px]">
                  <div className={`text-base md:text-xl ${stat.iconColor}`} aria-hidden="true">
                     <stat.icon />
                  </div>
                  <div>
                     <div className="flex text-yellow-400 text-[10px] md:text-xs" aria-label="5 star rating">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                     </div>
                     <p className="text-green-950 font-bold text-xs md:text-base leading-none">
                        {stat.rating}/5 <span className="text-slate-400 font-normal ml-1 hidden sm:inline">{stat.name}</span>
                     </p>
                  </div>
               </div>
            ))}
          </motion.div>
        </div>

        {/* 2. RIGHT SIDE: MARQUEE SECTION */}
        <div className="relative w-full lg:w-7/12 flex-grow lg:flex-grow-0 flex flex-col justify-center overflow-hidden h-[50vh] lg:h-auto" role="region" aria-label="Customer testimonials">
          
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" aria-hidden="true" />

          {/* ROW 1 */}
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

          {/* ROW 2 */}
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
    </section>
  );
}

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