"use client";

import { motion } from "framer-motion";
import { Link } from "react-router"; 
import { 
  FaPhone, 
  FaEnvelope, 
  FaWhatsapp, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaMagic, 
  FaSmileBeam, 
  FaArrowRight 
} from "react-icons/fa";

// ===== CONTACT CONSTANTS =====
const CONTACT_EMAIL = "clean@ddeepcleaningservices.com";
const CONTACT_PHONE = "07459416262";
const CONTACT_WHATSAPP = "447459416262";

// ===== STEPS =====
const steps = [
  { title: "Request Quote", desc: "Fill our 30-second form.", icon: FaClipboardList },
  { title: "Schedule It", desc: "Pick a time that works.", icon: FaCalendarAlt },
  { title: "We Clean", desc: "Our experts work magic.", icon: FaMagic },
  { title: "You Relax", desc: "Enjoy your pristine space.", icon: FaSmileBeam },
];

export default function HomeCTA() {

  // SEO: HowTo Schema for the 4-step process
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Book a Professional Clean",
    "description": "Four simple steps to booking a deep clean for your home or office.",
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "itemListElement": [{
        "@type": "HowToDirection",
        "text": step.desc
      }]
    }))
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section id="contact" className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden bg-white snap-start pt-24 pb-24 lg:py-0">
      
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/50 to-teal-50/30 pointer-events-none" aria-hidden="true" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center h-full justify-evenly">

        <header className="text-center shrink-0 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-green-950 tracking-tight mb-4"
          >
            Ready for a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
              Spotless Future?
            </span>
          </motion.h2>
          <motion.p className="text-slate-500 text-sm md:text-lg max-w-xl mx-auto">
            Book your expert cleaners in Manchester and the North West.
          </motion.p>
        </header>

        

        {/* ACTION BAR */}
        {/* ACTION BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-[2rem] p-4 md:p-6 shadow-2xl shadow-green-900/10 flex flex-col gap-6">
            
            {/* 4 EQUAL CONTACT OPTIONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              
              {/* 1. Instant Quote */}
              <a 
                href="https://api.ddeepcleaningservices.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/50 border border-green-100 hover:bg-green-100 transition-colors group" 
                aria-label="Get an instant quote"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <FaClipboardList aria-hidden="true" />
                </div>
                <div className="text-left overflow-visible">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-1">Book Online</p>
                  <p className="text-sm font-bold text-green-950 leading-tight">Instant Quote</p>
                </div>
              </a>

              {/* 2. Phone */}
              <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/50 border border-green-100 hover:bg-green-100 transition-colors group" aria-label="Call us">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <FaPhone aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-1">Call Us</p>
                  <p className="text-sm font-bold text-green-950 whitespace-nowrap">{CONTACT_PHONE}</p>
                </div>
              </a>

              {/* 3. Email */}
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/50 border border-green-100 hover:bg-green-100 transition-colors group" aria-label="Email us">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <FaEnvelope aria-hidden="true" />
                </div>
                <div className="text-left overflow-visible">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-1">Email Us</p>
                  <p className="text-[11px] md:text-sm font-bold text-green-950 break-all leading-tight">
                    {CONTACT_EMAIL}
                  </p>
                </div>
              </a>

              {/* 4. WhatsApp */}
              <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`} className="flex items-center gap-4 p-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white transition-colors group shadow-md shadow-green-900/10" aria-label="Chat on WhatsApp">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0">
                  <FaWhatsapp className="text-xl" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-green-100 uppercase tracking-wider leading-none mb-1">WhatsApp</p>
                  <p className="text-sm font-bold">Live Chat</p>
                </div>
              </a>
              
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-widest pt-2 border-t border-slate-100">
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" /> Free Cancellation</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" /> Fully Insured</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" /> Instant Quote</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
