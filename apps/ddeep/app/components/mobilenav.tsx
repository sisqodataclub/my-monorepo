"use client";

import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaClipboardList } from "react-icons/fa";

export default function FixedCTA2() {
  return (
    <>
      {/* Mobile CTA (Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] md:hidden">
        <div className="grid grid-cols-4 text-[11px] sm:text-xs font-semibold text-green-700">
          
          {/* Primary Action: Book */}
          <a
            href="https://api.ddeepcleaningservices.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 flex flex-col items-center justify-center gap-1 bg-green-700 text-white active:bg-green-800 transition-colors"
          >
            <FaClipboardList className="text-lg sm:text-xl" aria-hidden="true" />
            <span>Book</span>
          </a>

          {/* Secondary Action: Call */}
          <a
            href="tel:+441234567890"
            className="py-3 flex flex-col items-center justify-center gap-1 border-r border-green-200 active:bg-green-50 transition-colors"
          >
            <FaPhoneAlt className="text-lg sm:text-xl" aria-hidden="true" />
            <span>Call</span>
          </a>

          {/* Secondary Action: WhatsApp */}
          <a
            href="https://wa.me/441234567890"
            className="py-3 flex flex-col items-center justify-center gap-1 border-r border-green-200 active:bg-green-50 transition-colors"
          >
            <FaWhatsapp className="text-lg sm:text-xl" aria-hidden="true" />
            <span>Chat</span>
          </a>

          {/* Secondary Action: Email */}
          <a
            href="mailto:info@ddeepcleaning.co.uk"
            className="py-3 flex flex-col items-center justify-center gap-1 active:bg-green-50 transition-colors"
          >
            <FaEnvelope className="text-lg sm:text-xl" aria-hidden="true" />
            <span>Email</span>
          </a>

        </div>
      </div>
    </>
  );
}
