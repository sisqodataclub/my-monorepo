"use client";

import { Link } from "react-router-dom";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function FixedCTA() {
  const desktopHeight = 50; // height of the desktop CTA in px

  return (
    <>
      {/* Desktop CTA (Top Bar) */}
      <div
        className="hidden md:flex fixed top-[72px] left-0 right-0 z-40 bg-green-700 text-white shadow-lg"
        style={{ height: `${desktopHeight}px` }}
      >

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <span className="font-semibold">
            Need a deep clean? Fast quotes & trusted professionals.
          </span>

          <div className="flex gap-3">
            <Link
              to="/contact"
              className="px-5 py-2 bg-white text-green-700 rounded-full font-semibold hover:bg-green-50 transition"
            >
              Get a Quote
            </Link>

            <a
              href="https://wa.me/441234567890"
              className="px-4 py-2 bg-green-900/40 rounded-full flex items-center gap-2 hover:bg-green-900/60 transition"
            >
              <FaWhatsapp /> WhatsApp
            </a>

            <a
              href="tel:+441234567890"
              className="px-4 py-2 bg-green-900/40 rounded-full flex items-center gap-2 hover:bg-green-900/60 transition"
            >
              <FaPhoneAlt /> Call
            </a>
          </div>
        </div>
      </div>

      {/* Mobile CTA (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 shadow-xl">
        <div className="grid grid-cols-3 text-sm font-semibold text-green-700">
          <a
            href="tel:+441234567890"
            className="py-3 flex flex-col items-center gap-1"
          >
            <FaPhoneAlt className="text-lg" />
            Call
          </a>

          <a
            href="https://wa.me/441234567890"
            className="py-3 flex flex-col items-center gap-1 border-x border-green-200"
          >
            <FaWhatsapp className="text-lg" />
            WhatsApp
          </a>

          <a
            href="mailto:info@ddeepcleaning.co.uk"
            className="py-3 flex flex-col items-center gap-1"
          >
            <FaEnvelope className="text-lg" />
            Email
          </a>
        </div>
      </div>

      {/* Spacer to push content below desktop CTA */}
      <div className="hidden md:block" style={{ height: `${desktopHeight}px` }} />
    </>
  );
}
