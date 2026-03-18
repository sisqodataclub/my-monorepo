"use client";

import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function FixedCTA2() {
  return (
    <>
      {/* Mobile CTA (Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 shadow-xl md:hidden">
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
    </>
  );
}
