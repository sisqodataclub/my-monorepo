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

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll gallery left"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-green-50 hover:border-green-300 text-green-950 flex items-center justify-center shadow-sm transition-colors"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll gallery right"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-green-50 hover:border-green-300 text-green-950 flex items-center justify-center shadow-sm transition-colors"
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
        >
          {displayedImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className="min-w-[88%] sm:min-w-[45%] lg:min-w-[32%] snap-start group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-md h-[340px] sm:h-[380px] shrink-0"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-300 bg-green-950/60 px-2 py-0.5 rounded-full">
                    {img.category}
                  </span>
                  <FaExpand className="text-white text-sm" />
                </div>
                <p className="text-white text-sm font-semibold leading-tight">{img.title}</p>
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
            onClick={() => setActiveIndex(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveIndex(null)}
              aria-label="Close lightbox"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FaTimes />
            </button>

            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 md:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FaChevronLeft />
            </button>

            <motion.img
              key={activeImage.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={activeImage.src}
              alt={activeImage.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />

            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
