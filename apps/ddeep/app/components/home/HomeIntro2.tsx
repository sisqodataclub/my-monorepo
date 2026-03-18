import { motion } from "framer-motion";
import { FaShieldAlt, FaHandSparkles, FaUserCheck, FaStar } from "react-icons/fa";
import SolutionImage from "../../assets/home-busy-cleaner.jpg"; 

export default function HomeIntro2() {
  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Image animation (Coming from right this time)
  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Background Blob Animation (Slightly different rhythm than Intro 1)
  const blobVariants = {
    animate: {
      scale: [1, 1.15, 1],
      rotate: [0, -10, 0],
      transition: { duration: 18, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" }
    }
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white snap-start">
      
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-bl from-white via-green-50/30 to-teal-50/50 pointer-events-none" />
      
      {/* Animated Blobs (Teal/Blue shift for "Clean" vibe) */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="absolute top-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-teal-200/30 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 pointer-events-none"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 3 }}
        className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-green-200/30 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 pointer-events-none"
      />

      {/* ===== CONTENT CONTAINER ===== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full max-h-[90vh]">
          
          {/* ===== LEFT: TEXT CONTENT (Solution Pitch) ===== */}
          <motion.div 
            className="flex flex-col justify-center order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-teal-500"></span>
              <span className="text-teal-700 font-bold tracking-widest text-xs uppercase">The DDeep Difference</span>
            </motion.div>

            {/* Headline */}
            <motion.h2 variants={itemVariants} className="text-4xl lg:text-6xl font-extrabold text-green-950 leading-[1.1] mb-6">
              That's Where <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-600">
                We Come In.
              </span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-base lg:text-lg text-slate-600 leading-relaxed mb-8 font-medium">
               We don't just "clean" — we curate a healthier environment. Our Manchester-based team restores order to your chaos, leaving your space immaculately fresh without disruption.
            </motion.p>

            {/* Feature List (Glassmorphic) */}
            <motion.div variants={containerVariants} className="space-y-4">
              
              {/* List Item 1 */}
              <motion.div variants={itemVariants} className="group flex items-center gap-4 p-3 rounded-2xl bg-white/50 border border-green-100/50 hover:bg-white hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <FaShieldAlt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-green-950 font-bold text-sm">Fully Insured & Vetted</h4>
                  <p className="text-slate-500 text-xs">Peace of mind with every visit.</p>
                </div>
              </motion.div>

              {/* List Item 2 */}
              <motion.div variants={itemVariants} className="group flex items-center gap-4 p-3 rounded-2xl bg-white/50 border border-green-100/50 hover:bg-white hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <FaHandSparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-green-950 font-bold text-sm">Deep Clean Standards</h4>
                  <p className="text-slate-500 text-xs">We reach the spots others miss.</p>
                </div>
              </motion.div>

              {/* List Item 3 */}
              <motion.div variants={itemVariants} className="group flex items-center gap-4 p-3 rounded-2xl bg-white/50 border border-green-100/50 hover:bg-white hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <FaUserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-green-950 font-bold text-sm">Reliable & Punctual</h4>
                  <p className="text-slate-500 text-xs">We respect your time, every time.</p>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>


          {/* ===== RIGHT: IMAGE COMPOSITION (Solution Visual) ===== */}
          <motion.div 
            className="hidden lg:flex relative h-full max-h-[80vh] items-center justify-center order-1 lg:order-2"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Main Image Frame */}
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/10">
              <img 
                src={SolutionImage} 
                alt="Immaculate living room after cleaning" 
                className="w-full h-full object-cover transform scale-105" // Slight zoom for impact
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating "Result" Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl border border-white/50 p-4 pr-6 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="bg-yellow-400 p-2 rounded-full text-white shadow-sm">
                <FaStar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-green-950 font-bold text-sm">100% Satisfaction</p>
                <p className="text-slate-500 text-xs">Or we reclean for free.</p>
              </div>
            </motion.div>

            {/* Decorative Offset Border */}
            <div className="absolute -top-6 -right-6 w-full h-full rounded-[2.5rem] border-2 border-dashed border-teal-200 -z-10" />
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}