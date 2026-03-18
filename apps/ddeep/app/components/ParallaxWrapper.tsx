"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface ParallaxWrapperProps {
  children: ReactNode;
  speed?: number; // + = slower, - = faster
}

export default function ParallaxWrapper({ children, speed = 50 }: ParallaxWrapperProps) {
  const { scrollYProgress } = useScroll(); // normalized 0 -> 1
  const y = useTransform(scrollYProgress, [0, 1], [0, speed]); // dynamic based on page scroll

  return <motion.div style={{ y }}>{children}</motion.div>;
}
