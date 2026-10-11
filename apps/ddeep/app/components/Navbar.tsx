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
                  {link.href ? (
                    <Link to={link.href} className="hover:text-green-600 transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <button onClick={link.action || undefined} className="hover:text-green-600 transition-colors">
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-green-600 transition-colors"
            >
              <FaPhoneAlt className="text-green-600" />
              <span>{CONTACT_PHONE}</span>
            </a>
            <button
              onClick={handleContactClick}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-green-200 transition-all hover:scale-105"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-slate-900 p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-slate-900 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-slate-900 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-slate-900 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-4">
            {links.map((link) => (
              link.href ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-black uppercase tracking-wider text-slate-700 hover:text-green-600"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action || undefined}
                  className="block text-sm font-black uppercase tracking-wider text-slate-700 hover:text-green-600"
                >
                  {link.label}
                </button>
              )
            ))}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <FaPhoneAlt className="text-green-600" /> {CONTACT_PHONE}
              </a>
              <a href={`https://wa.me/${CONTACT_WHATSAPP}`} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <FaWhatsapp className="text-green-600" /> WhatsApp
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <FaEnvelope className="text-green-600" /> {CONTACT_EMAIL}
              </a>
              <button
                onClick={handleContactClick}
                className="w-full bg-green-600 text-white text-sm font-black uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FaClipboardList /> Get a Quote
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
