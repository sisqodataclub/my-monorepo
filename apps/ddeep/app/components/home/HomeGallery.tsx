// app/components/home/HomeGallery.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { galleryImages } from "../../utils/galleryImages";

interface HomeGalleryProps {
  filterCategory?: string;
  hideHeader?: boolean;
}

export default function HomeGallery({ filterCategory, hideHeader = false }: HomeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayedImages = filterCategory
    ? galleryImages.filter((img) => img.category === filterCategory)
    : galleryImages;

  // Keyboard navigation (Escape, Left, Right) + lock body scroll when lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null ? null : prev === 0 ? displayedImages.length - 1 : prev - 1
        );
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) =>
          prev === null ? null : prev === displayedImages.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, displayedImages.length]);

  if (displayedImages.length === 0) return null;

  const activeImage = activeIndex !== null ? displayedImages[activeIndex] : null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = Math.max(260, clientWidth * 0.7);
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex(activeIndex === 0 ? displayedImages.length - 1 : activeIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex(activeIndex === displayedImages.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <section
      id="gallery"
      className="relative w-full py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Desktop Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
          {!hideHeader && (
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full mb-2.5">
                Our Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {filterCategory ? `${filterCategory} ` : "Recent Work & "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  {filterCategory ? "Results" : "Transformations"}
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Tap any photo to inspect full-screen details.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="sm:hidden text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              Swipe to explore →
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll gallery left"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center shadow-sm transition-all duration-200"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll gallery right"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center shadow-sm transition-all duration-200"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Thumbnail Strip */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 px-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayedImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="group relative w-[220px] sm:w-[280px] lg:w-[320px] h-44 sm:h-52 lg:h-56 snap-start shrink-0 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading={idx < 3 ? "eager" : "lazy"}
                fetchPriority={idx < 2 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Subtle Persistent Bottom Gradient for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Top-Right Expand Pill */}
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-xs opacity-85 group-hover:opacity-100 group-hover:bg-emerald-600 group-hover:border-emerald-400 transition-all">
                <FaExpand />
              </span>

              {/* Bottom Metadata */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                {img.category && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-black/50 backdrop-blur-sm border border-white/10 px-2.5 py-0.5 rounded-full mb-1">
                    {img.category}
                  </span>
                )}
                {img.title && (
                  <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-1">
                    {img.title}
                  </h3>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Single Instance Outside Loop) */}
      <AnimatePresence>
        {activeImage && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.title || activeImage.alt || "Image preview"}
          >
            {/* Top Bar: Counter + Unmissable Close Button */}
            <div
              className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs sm:text-sm font-medium text-white/80 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full">
                {activeIndex + 1} / {displayedImages.length}
              </span>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Close image preview"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-950 hover:bg-emerald-50 active:scale-95 font-semibold text-sm shadow-2xl border border-white transition-all cursor-pointer"
              >
                <FaTimes className="text-base" />
                <span>Close</span>
              </button>
            </div>

            {/* Center Image Stage + Left/Right Controls */}
            <div className="relative flex-1 flex items-center justify-center my-3 min-h-0">
              {displayedImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-1 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                >
                  <FaChevronLeft />
                </button>
              )}

              <motion.img
                key={activeImage.src}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded-2xl shadow-2xl select-none"
                onClick={(e) => e.stopPropagation()}
              />

              {displayedImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-1 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div
              className="w-full max-w-3xl mx-auto text-center z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {activeImage.category && (
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  {activeImage.category}
                </span>
              )}
              {(activeImage.title || activeImage.alt) && (
                <p className="text-white text-sm sm:text-base font-medium">
                  {activeImage.title || activeImage.alt}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
