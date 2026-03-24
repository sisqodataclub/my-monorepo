// src/components/AnimatedHeadline.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AnimatedHeadline() {
  return (
    <motion.h1
      className="
        text-3xl sm:text-4xl md:text-5xl 
        font-extrabold mb-16 
        text-center tracking-tight 
        drop-shadow-lg 
        text-transparent bg-clip-text 
        bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 
        select-none
      "
      initial={{ opacity: 0, y: -30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255, 192, 203, 0.8)" }}
    >
      Financial&nbsp;&amp;&nbsp;Economic News
    </motion.h1>
  );
}
