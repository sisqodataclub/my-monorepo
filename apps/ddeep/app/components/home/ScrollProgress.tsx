// app/components/ui/ScrollProgress.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 120, 
    damping: 35, 
    restDelta: 0.001 
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-2 bg-blue-500 rounded-full origin-left shadow-lg z-50"
      style={{ scaleX }}
    />
  );
}
