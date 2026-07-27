// app/components/home/HomeGallery.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { galleryImages, type GalleryImage } from "../../utils/galleryImages";

interface HomeGalleryProps {
  filterCategory?: string;
  hideHeader?: boolean;
}

export default function HomeGallery({ filterCategory, hideHeader = false }: HomeGalleryProps) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  let displayedImages = galleryImages;
  if (filterCategory) {
    displayedImages = displayedImages.filter(img => img.category === filterCategory);
  }

  if (displayedImages.length === 0) return null;

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

          {/* Desktop Only Carousel Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full bg-slate-100 hover:bg-green-600 hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-slate-100 hover:bg-green-600 hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-sm"
              aria-label="Scroll right"
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
              onClick={() => setActiveImage(img)}
              // 🚀 FIXED: Uniform heights (h-[340px] on mobile, h-[380px] on desktop) ensuring identical card sizing
              className="min-w-[88%] sm:min-w-[45%] lg:min-w-[32%] snap-start group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-100 border border-green-100/80 shadow-md h-[340px] sm:h-[380px] shrink-0"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading={idx < 2 ? "eager" : "lazy"}
                fetchPriority={idx < 2 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-slate-200"
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
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 p-3 rounded-full transition-all hover:scale-110 z-50"
            >
              <FaTimes className="text-xl" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full overflow-hidden rounded-2xl bg-black"
            >
              <img src={activeImage.src} alt={activeImage.alt} decoding="async" className="w-full h-full max-h-[80vh] object-contain mx-auto" />
              {(activeImage.title || activeImage.category) && (
                <div className="p-4 bg-slate-900/90 text-white text-center border-t border-white/10">
                  {activeImage.category && <span className="text-xs text-green-400 uppercase font-semibold block mb-1">{activeImage.category}</span>}
                  {activeImage.title && <p className="font-bold text-base">{activeImage.title}</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
