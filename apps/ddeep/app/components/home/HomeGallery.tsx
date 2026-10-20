// app/components/home/HomeGallery.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { galleryImages, type GalleryImage } from "../../utils/galleryImages";

interface HomeGalleryProps {
  filterCategory?: string;
  hideHeader?: boolean;
}

export default function HomeGallery({ filterCategory, hideHeader = false }: HomeGalleryProps) {
  // 🚀 UPDATED: Track active index instead of just the image object
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  let displayedImages = galleryImages;
  if (filterCategory) {
    displayedImages = displayedImages.filter(img => img.category === filterCategory);
  }

  // 🚀 Escape-key closes the lightbox while it is open
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  if (displayedImages.length === 0) return null;

  const activeImage = activeIndex !== null ? displayedImages[activeIndex] : null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 🚀 Modal navigation handlers with wrap-around support
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null) {
      setActiveIndex(activeIndex === 0 ? displayedImages.length - 1 : activeIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null) {
      setActiveIndex(activeIndex === displayedImages.length - 1 ? 0 : activeIndex + 1);
    }
  };

  return (
    <section id="gallery" className="relative w-full py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10">
          {!hideHeader && (
            <div className="text-left mb-4 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-black text-green-950 tracking-tight mb-2">
                {filterCategory ? `${filterCategory} ` : "Recent Work & "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                  {filterCategory ? "Results" : "Transformations"}
                </span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base">
                Swipe across to view our latest cleaning results.
              </p>
            </div>
          )}

          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full bg-green-50 hover:bg-green-100 text-green-700 flex items-center justify-center transition-colors"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full bg-green-50 hover:bg-green-100 text-green-700 flex items-center justify-center transition-colors"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Mobile Swipe Indicator Text */}
        <div className="flex md:hidden items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-600 mb-4 bg-green-50 px-3 py-1.5 rounded-full w-fit">
          <span>👈 Swipe to see more</span>
        </div>

        {/* Sideway Scrolling Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2 px-1 focus:outline-none [-webkit-overflow-scrolling:touch]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayedImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className="min-w-[88%] sm:min-w-[45%] lg:min-w-[32%] snap-start group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-md aspect-[4/3] shrink-0"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading={idx < 2 ? "eager" : "lazy"}
                fetchPriority={idx < 2 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 text-left">
                <div className="flex justify-end">
                  <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-sm shadow-sm">
                    <FaExpand />
                  </span>
                </div>
                <div>
                  {img.category && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-green-400 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                      {img.category}
                    </span>
                  )}
                  {img.title && (
                    <h3 className="text-white font-bold text-lg leading-snug drop-shadow-sm">
                      {img.title}
                    </h3>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-slate-200 flex items-center justify-center shadow-lg transition-colors z-10"
            >
              <FaTimes />
            </button>

            {/* Prev / Next */}
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-colors z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-colors z-10"
            >
              <FaChevronRight />
            </button>

            {/* Image */}
            <motion.img
              key={activeImage.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            {(activeImage.title || activeImage.category) && (
              <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                {activeImage.category && (
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-green-400 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                    {activeImage.category}
                  </span>
                )}
                {activeImage.title && (
                  <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-sm">
                    {activeImage.title}
                  </h3>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
