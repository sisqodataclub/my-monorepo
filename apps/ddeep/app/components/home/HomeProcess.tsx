import { motion } from "framer-motion";
import { FaLeaf, FaUserCheck, FaShieldAlt, FaStar, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

const whyUsPoints = [
  {
    id: "01",
    title: "Vetted Experts",
    description: "Background-checked & fully trained professional cleaners.",
    icon: FaUserCheck,
    color: "from-blue-400 to-teal-400"
  },
  {
    id: "02",
    title: "Eco-Friendly",
    description: "Safe, non-toxic products for a healthy home environment.",
    icon: FaLeaf,
    color: "from-green-400 to-emerald-400"
  },
  {
    id: "03",
    title: "Reliability",
    description: "Punctual arrival and consistent cleaning standards.",
    icon: FaStar,
    color: "from-yellow-400 to-orange-400"
  },
  {
    id: "04",
    title: "Fully Insured",
    description: "Comprehensive public liability insurance for total peace of mind.",
    icon: FaShieldAlt,
    color: "from-teal-400 to-cyan-400"
  },
];

export default function HomeWhyUs() {
  
  // SEO Schema - Using ItemList for the unique selling points
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Why Choose D DEEP Cleaning Services",
    "description": "Our core values and service standards for residential and commercial cleaning.",
    "itemListElement": whyUsPoints.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.title,
      "description": item.description
    }))
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="why-us" className="relative w-full min-h-screen flex flex-col justify-center bg-white overflow-hidden snap-start py-20 lg:py-0">
      
      {/* ===== SEO ===== */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50/60 via-white to-white pointer-events-none" aria-hidden="true" />
      
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-green-100/30 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col h-full justify-center">
        
        {/* ===== HEADER ===== */}
        <header className="text-center mb-6 lg:mb-16 shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mb-3"
          >
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
             <span className="text-green-800 text-[10px] md:text-xs font-bold tracking-widest uppercase">The North West Choice</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-green-950 tracking-tight leading-tight"
          >
            A Higher Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
              of Clean.
            </span>
          </motion.h2>
        </header>

        {/* ===== BENTO GRID LAYOUT ===== */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8"
          role="list"
        >
          {whyUsPoints.map((item, i) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="relative group"
              role="listitem"
            >
              <div className="h-full bg-white/60 backdrop-blur-xl border border-green-100 rounded-2xl lg:rounded-[2rem] p-4 lg:p-8 flex flex-col transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-green-900/10 hover:border-green-200">
                
                <span className="absolute right-2 top-2 text-4xl lg:text-[6rem] font-bold text-green-900/5 select-none font-serif leading-none" aria-hidden="true">
                  {item.id}
                </span>

                <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-3 lg:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full bg-white rounded-[10px] lg:rounded-[14px] flex items-center justify-center">
                       <item.icon className="text-lg lg:text-2xl text-green-700" aria-hidden="true" />
                    </div>
                </div>

                <h3 className="text-sm lg:text-xl font-bold text-green-950 mb-1 lg:mb-3 group-hover:text-green-700 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-xs lg:text-sm leading-snug lg:leading-relaxed">
                  {item.description}
                </p>

                <div className={`mt-4 lg:mt-auto h-0.5 lg:h-1 w-6 lg:w-8 rounded-full bg-gradient-to-r ${item.color} opacity-40 group-hover:w-full group-hover:opacity-100 transition-all duration-500`} aria-hidden="true" />
              
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 lg:mt-16 text-center shrink-0"
        >
        </motion.div>

      </div>
    </section>
  );
}