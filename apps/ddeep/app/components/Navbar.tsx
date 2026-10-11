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
            <ul className="flex gap-6 text-[12px] font-black uppercase tracking-widest text-slate-700">
              {links.map((link) =>
                link.href ? (
                  <li key={link.label}>
                    <Link to={link.href} className="hover:text-green-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <button onClick={link.action ?? undefined} className="hover:text-green-600 transition-colors">
                      {link.label}
                    </button>
                  </li>
                )
              )}
            </ul>
            <button
              onClick={handleContactClick}
              className="bg-green-600 text-white px-5 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-slate-900 text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[998] bg-white pt-24 px-6 lg:hidden">
          <ul className="flex flex-col gap-6 text-lg font-black uppercase tracking-widest text-slate-900">
            {links.map((link) =>
              link.href ? (
                <li key={link.label}>
                  <Link to={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label}>
                  <button onClick={link.action ?? undefined}>{link.label}</button>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Mobile bottom contact bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] bg-green-600 text-white lg:hidden">
        <div className="grid grid-cols-3 divide-x divide-white/20">
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex flex-col items-center justify-center py-3 gap-1"
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
          </a>
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 gap-1"
          >
            <FaWhatsapp className="text-lg" />
            <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
          </a>
          <button
            onClick={handleContactClick}
            className="flex flex-col items-center justify-center py-3 gap-1"
          >
            <FaEnvelope className="text-lg" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Enquire</span>
          </button>
        </div>
      </div>

      <div className="h-20 md:h-24" /> {/* Top Spacer */}
      <div className="lg:hidden h-12" /> {/* Bottom Spacer for mobile bar */}
    </>
  );
}
