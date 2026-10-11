"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaChevronRight,
  FaClipboardList,
} from "react-icons/fa";
import { useContactModal } from "../context/ContactModalContext";

const CONTACT_EMAIL = "clean@ddeepcleaningservices.com";
const CONTACT_PHONE = "07459416262";
const CONTACT_WHATSAPP = "447459416262";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useContactModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        window.scrollTo({
          top: elementRect - bodyRect - offset,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Open modal helper – closes mobile menu first
  const handleContactClick = () => {
    setMenuOpen(false);
    openModal();
  };

  const links = [
    { label: "Home", action: () => handleNavClick("home") },
    { label: "Services", action: () => handleNavClick("services") },
    { label: "Contact Us", action: handleContactClick },
    { href: "/tc", label: "T&C", action: null },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg py-3"
            : "bg-white py-5"
        }`}
      >
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
              D
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                D DEEP
              </span>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em]">
                Cleaning Services
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6 text-[12px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 pr-8">
              {links.map((link) => (
                <li key={link.label}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      className="hover:text-green-600 transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
                    </button>
                  ) : (
                    <Link
                      to={link.href!}
                      className="hover:text-green-600 transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={handleContactClick}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-105"
            >
              <FaPhoneAlt className="text-xs" />
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-slate-900"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[998] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl p-6 pt-24 flex flex-col gap-2">
            {links.map((link) => (
              <div key={link.label}>
                {link.action ? (
                  <button
                    onClick={link.action}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors flex items-center justify-between group"
                  >
                    {link.label}
                    <FaChevronRight className="text-xs text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ) : (
                  <Link
                    to={link.href!}
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors flex items-center justify-between group"
                  >
                    {link.label}
                    <FaChevronRight className="text-xs text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                )}
              </div>
            ))}

            <button
              onClick={handleContactClick}
              className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-200"
            >
              <FaClipboardList />
              Get a Free Quote
            </button>

            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-green-600 transition-colors"
              >
                <FaPhoneAlt className="text-green-600" />
                {CONTACT_PHONE}
              </a>
              <a
                href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}`}
                className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-green-600 transition-colors"
              >
                <FaWhatsapp className="text-green-600" />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-green-600 transition-colors"
              >
                <FaEnvelope className="text-green-600" />
                Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[997] lg:hidden bg-slate-900 border-t border-white/10">
        <div className="flex">
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex-1 flex flex-col items-center py-2.5 border-r border-white/5 text-white active:bg-slate-800 transition-colors"
          >
            <FaPhoneAlt className="text-green-500 mb-0.5 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Call
            </span>
          </a>

          <a
            href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}`}
            className="flex-1 flex flex-col items-center py-2.5 border-r border-white/5 text-white active:bg-slate-800 transition-colors"
          >
            <FaWhatsapp className="text-green-500 mb-0.5 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Chat
            </span>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex-1 flex flex-col items-center py-2.5 text-white active:bg-slate-800 transition-colors"
          >
            <FaEnvelope className="text-green-500 mb-0.5 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Email
            </span>
          </a>
        </div>
      </div>

      {/* Spacers to prevent content overlap */}
      <div className="h-20 md:h-24" /> {/* Top Spacer */}
      <div className="lg:hidden h-12" /> {/* Bottom Spacer for mobile bar */}
    </>
  );
}
