import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { slideIn } from "../../utils/motion";

// ---------------------------
// PARTICLES
// ---------------------------
const FloatingParticles = ({ mousePos }) => {
  const particles = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 rounded-full bg-white/20"
        />
      ))}
    </div>
  );
};

// ---------------------------
// GRADIENT SHAPES
// ---------------------------
const GradientShapes = ({ mousePos }) => {
  const offsetX = (mousePos.x - window.innerWidth / 2) / 40;
  const offsetY = (mousePos.y - window.innerHeight / 2) / 40;

  return (
    <>
      <motion.div
        style={{ x: offsetX, y: offsetY }}
        className="absolute -top-32 -left-32 w-96 h-96
        bg-gradient-to-tr from-blue-600/30 to-purple-500/30
        rounded-full blur-3xl"
      />
      <motion.div
        style={{ x: -offsetX, y: -offsetY }}
        className="absolute -bottom-32 -right-32 w-96 h-96
        bg-gradient-to-br from-pink-500/30 to-yellow-400/30
        rounded-full blur-3xl"
      />
    </>
  );
};

// ---------------------------
// MAIN LAYOUT
// ---------------------------
const GlassLayout = ({ title, subtitle, children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6
      bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden"
    >
      <GradientShapes mousePos={mousePos} />
      <FloatingParticles mousePos={mousePos} />

      <motion.div
        variants={slideIn("up", "tween", 0.2, 1)}
        className="
          relative w-full sm:max-w-xl
          bg-transparent sm:bg-black/70
          rounded-none sm:rounded-3xl
          px-0 sm:p-8
          shadow-none sm:shadow-xl
          z-10
        "
      >
        {(title || subtitle) && (
          <div className="mb-6 sm:mb-8 text-center">
            {title && (
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-xs sm:text-base text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
};

export default GlassLayout;
