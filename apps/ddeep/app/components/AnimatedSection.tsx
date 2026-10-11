import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Entrance-reveal wrapper for home-page middle sections.
 *
 * The previous implementation relied solely on framer-motion's
 * `whileInView` observer to clear the initial `opacity: 0` state. On the
 * live build the observer could fail to fire (registered before the
 * sections were in the DOM / selector no longer matched), leaving the
 * middle of the page permanently hidden.
 *
 * Fix: keep the reveal animation, but guarantee the section becomes
 * visible even if the observer never fires:
 *   1. Respect `prefers-reduced-motion` -> render fully visible, no animation.
 *   2. Safety timeout -> clear the hidden state shortly after mount.
 *   3. CSS-only fallback class -> visible if JS never runs.
 */
export default function AnimatedSection({
  children,
  delay = 0,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  // Safety net: if the in-view observer never fires, force the section
  // visible after a short delay so the page can never stay blank.
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(t);
  }, []);

  const hidden = !prefersReducedMotion && !revealed;

  return (
    <motion.section
      className="reveal-section"
      initial={false}
      animate={hidden ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
      whileInView={
        prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => setRevealed(true)}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.section>
  );
}
