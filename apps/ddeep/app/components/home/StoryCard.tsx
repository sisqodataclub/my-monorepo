// app/components/ui/StoryCard.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StoryCardProps {
  children: ReactNode;
  bgImage?: string;
}

export default function StoryCard({ children, bgImage }: StoryCardProps) {
  // Unused useScroll and useTransform hooks have been removed to prevent performance leaks

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {bgImage && (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {bgImage && <div className="absolute inset-0 bg-black/30" />}

      <motion.div
        className="relative max-w-6xl px-6 text-center w-full"
        // Entry animation kept active so text fades in nicely once
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
