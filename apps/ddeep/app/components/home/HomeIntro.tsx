import { motion } from "framer-motion";
import { FaRegClock, FaRegCheckCircle, FaArrowRight } from "react-icons/fa";
import IntroImageBright from  "../../assets/home-busy-cleaner.jpg"; 

export default function HomeIntro() {
  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Slower, smoother blob animation for background
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, 0],
      transition: { duration: 15, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" }
    }
  };

  return (
    // 'h-screen' ensures it takes exactly one viewport height. 
    // 'snap-start' is added in case you are using CSS scroll snapping.
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white snap-start">
      
      {/* ===== BACKGROUND ===== */}
      {/* Subtle gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-green-100/30 pointer-events-none" />
      
      {/* Animated Blobs (positioned to not interfere with text reading) */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="absolute top-10 left-10 w-[50vh] h-[50vh] bg-green-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 pointer-events-none"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute bottom-10 right-10 w-[60vh] h-[60vh] bg-teal-100/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 pointer-events-none"
      />

      {/* ===== CONTENT CONTAINER ===== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full max-h-[90vh]">
          
          {/* ===== LEFT: IMAGE (Dynamic Height to fit Viewport) ===== */}
          <motion.div 
            className="hidden lg:flex relative h-full max-h-[80vh] items-center justify-center order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
             {/* The Image Container */}
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/10">
              <img 
                src={IntroImageBright} 
                alt="Cleaner in bright room" 
                className="w-full h-full object-cover" 
              />
              {/* Internal Sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Decorative Offset Box behind */}
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-green-100/50 rounded-[2.5rem] -z-10 border border-green-200" />
          </motion.div>


          {/* ===== RIGHT: COMPACT TEXT CONTENT ===== */}
          <motion.div 
            className="flex flex-col justify-center order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-green-400"></span>
              <span className="text-green-600 font-bold tracking-widest text-xs uppercase">The New Standard</span>
            </motion.div>

            {/* Headline - Responsive sizing to ensure fit */}
            <motion.h2 variants={itemVariants} className="text-4xl lg:text-6xl font-extrabold text-green-950 leading-[1.1] mb-6">
              Life moves fast. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                Cleaning shouldn't.
              </span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-base lg:text-lg text-slate-600 leading-relaxed mb-8 font-medium max-w-lg">
              When cleaning becomes a burden, it impacts your clarity. We restore the balance, giving you back your most valuable asset: <strong>Time.</strong>
            </motion.p>

            {/* Feature Cards - Compact Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-2 gap-4 mb-8">
              {/* Card 1 */}
              <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md border border-green-100 p-4 rounded-2xl shadow-sm hover:bg-white transition-colors">
                <FaRegClock className="text-green-600 w-5 h-5 mb-2" />
                <h4 className="text-green-950 font-bold text-sm lg:text-base">Reclaim Weekends</h4>
                <p className="text-slate-500 text-xs mt-1">No more Sunday scrubbing.</p>
              </motion.div>

               {/* Card 2 */}
               <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md border border-green-100 p-4 rounded-2xl shadow-sm hover:bg-white transition-colors">
                <FaRegCheckCircle className="text-green-600 w-5 h-5 mb-2" />
                <h4 className="text-green-950 font-bold text-sm lg:text-base">Consistent Quality</h4>
                <p className="text-slate-500 text-xs mt-1">Trained experts only.</p>
              </motion.div>
            </motion.div>

            

          </motion.div>

        </div>
      </div>
    </section>
  );
}