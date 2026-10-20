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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  let displayedImages = galleryImages;
  if (filterCategory) {
    displayedImages = displayedImages.filter(img => img.category === filterCategory);
  }

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

        {/* Scrollable Gallery */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        >
          {displayedImages.map((img, idx) => (
            <div
              key={img.src}
              onClick={() => setActiveIndex(idx)}
              className="relative flex-shrink-0 w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden cursor-pointer group snap-start bg-slate-100"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading={idx < 2 ? "eager" : "lazy"}
                fetchPriority={idx < 2 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium">{img.alt}</p>
              </div>
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaExpand className="text-slate-700 text-xs" />
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
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <button
              onClick={handlePrev}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
            <motion.img
              key={activeImage.src}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={activeImage.src}
              alt={activeImage.alt}
              className="w-full h-full max-h-[70vh] object-contain mx-auto p-2"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
