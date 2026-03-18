"use client";

import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaSearchLocation, FaCheck, FaGlobeEurope } from "react-icons/fa";

const areas = [
  "Manchester City Centre", "Salford Quays", "Trafford Park", "Didsbury", 
  "Altrincham", "Stockport", "Bolton", "Bury", "Oldham", "Rochdale", 
  "Preston", "Blackburn", "Burnley", "Warrington", "Wigan", "Chorley",
  "Liverpool City Centre", "St Helens", "Bootle", "Birkenhead"
];

// ===== CONTACT CONSTANT =====
const CONTACT_PHONE = "07459416262";


// Logic to split areas for the SEO Grid
const regions = [
  {
    name: "Greater Manchester Cleaning Services",
    towns: ["Manchester City Centre", "Salford Quays", "Trafford Park", "Didsbury", "Altrincham", "Stockport", "Bolton", "Bury", "Oldham", "Rochdale"]
  },
  {
    name: "Merseyside & Lancashire Coverage",
    towns: ["Liverpool City Centre", "St Helens", "Warrington", "Wigan", "Preston", "Blackburn", "Burnley", "Chorley", "Bootle", "Birkenhead"]
  }
];

const marqueeList = [...areas, ...areas];

export default function HomeAreas() {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Cleaning Services North West",
    "serviceType": "Deep Cleaning, End of Tenancy, and Commercial Cleaning",
    "provider": {
      "@type": "LocalBusiness",
      "name": "D DEEP Cleaning Services",
      "telephone": CONTACT_PHONE
    },
    "areaServed": areas.map(city => ({
      "@type": "City",
      "name": city,
      "sameAs": `https://en.wikipedia.org/wiki/${city.replace(/\s+/g, '_')}`
    }))
  };

  return (
    <section id="areas" className="relative w-full min-h-screen flex flex-col items-center py-24 bg-white overflow-hidden">
      
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* ===== AMBIENT BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/20 to-white pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', backgroundSize: '40px 40px' }}
           aria-hidden="true">
      </div>

      {/* Radar Pulse */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" aria-hidden="true">
         <motion.div 
            animate={{ scale: [1, 2.5], opacity: [0.1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="w-[400px] h-[400px] bg-green-400 rounded-full blur-3xl opacity-20"
         />
      </div>

      {/* ===== CONTENT CONTAINER ===== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* 1. HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100/50 border border-green-200 text-green-800 text-xs font-bold tracking-widest uppercase mb-6">
            <FaGlobeEurope className="text-green-600" aria-hidden="true" /> Specialist North West Coverage
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-green-950 tracking-tight mb-6 leading-tight">
            Local Expertise. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
              Regional Reliability.
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium">
            Providing premium residential and commercial cleaning across <strong>Greater Manchester</strong>, <strong>Merseyside</strong> and <strong>Lancashire</strong>.
          </p>
        </motion.div>

        {/* 2. REGIONAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-16" role="list">
          {regions.map((region, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all text-left"
              role="listitem"
            >
              <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-green-500 rounded-full" aria-hidden="true" />
                {region.name}
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                {region.towns.map((town, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-2 group">
                    <FaCheck className="text-green-500 text-[10px]" aria-hidden="true" />
                    <span className="text-slate-600 text-sm font-semibold group-hover:text-green-700 transition-colors">{town}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. MARQUEE */}
        <div className="w-full max-w-5xl overflow-hidden mb-16 py-4 border-y border-slate-50" aria-hidden="true">
          <motion.div 
            className="flex gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {marqueeList.map((area, i) => (
              <span key={i} className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-tighter text-sm whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-green-200 rounded-full" /> {area}
              </span>
            ))}
          </motion.div>
        </div>

        {/* 5. CTA CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl"
        >
          <div className="bg-green-950 rounded-[2.5rem] p-2 shadow-2xl shadow-green-900/30">
            <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-[2.2rem] px-6 py-6 md:px-16 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              
              <div className="text-left">
                <h3 className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-tight mb-1 md:mb-2 italic">
                  Looking for cleaners near you?
                </h3>
                <p className="text-green-200/70 font-medium text-sm md:text-base">
                  We specialize in end of tenancy and commercial deep cleans throughout the North West.
                </p>
              </div>
              
              <a 
                href={`tel:+44${CONTACT_PHONE.replace(/^0/, '')}`} 
                className="group flex flex-col items-center gap-1 bg-white text-green-950 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black hover:bg-green-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                aria-label={`Call us at ${CONTACT_PHONE} to check availability in your area`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <FaPhoneAlt className="text-green-600 group-hover:rotate-12 transition-transform text-lg md:text-xl" aria-hidden="true" />
                  <span className="text-sm md:text-base lg:text-lg">Check Availability</span>
                </div>
                <span className="text-green-700 font-bold text-xs md:text-sm lg:text-base">{CONTACT_PHONE}</span>
              </a>
              
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}