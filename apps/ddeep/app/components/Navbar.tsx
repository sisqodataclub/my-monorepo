"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaChevronRight } from "react-icons/fa";

const CONTACT_EMAIL = "clean@ddeepcleaningservices.com";
const CONTACT_PHONE = "07459416262";
const CONTACT_WHATSAPP = "07459416262";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const links = [
    { label: "Home", action: () => handleNavClick("home") },
    { label: "Services", action: () => handleNavClick("services") },
    { label: "Contact Us", action: () => handleNavClick("contact") },
    { href: "/tc", label: "T&C", action: null },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg py-3" : "bg-white py-5"
        }`}
      >
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
              D
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-slate-900 tracking-tight">D DEEP</span>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em]">Cleaning Services</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6 text-[12px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 pr-8">
              {links.map((link) => (
                <li key={link.label}>
                  {link.action ? (
                    <button onClick={link.action} className="hover:text-green-600 transition-colors relative group">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
                    </button>
                  ) : (
                    <Link to={link.href!} className="hover:text-green-600 transition-colors relative group">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6">
              <a href={`tel:${CONTACT_PHONE}`} className="flex flex-col items-end group">
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-tighter">Call Now</span>
                <span className="text-sm font-black text-slate-900 group-hover:text-green-600 transition-colors">{CONTACT_PHONE}</span>
              </a>
              
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}`}
                className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
              >
                <FaWhatsapp size={18} />
              </a>

              <button 
                onClick={() => handleNavClick("contact")}
                className="bg-slate-900 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95"
              >
                Get Free Quote
              </button>
            </div>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5">
            <div className={`w-6 h-0.5 bg-slate-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-6 h-0.5 bg-slate-900 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-6 h-0.5 bg-slate-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </nav>

        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-2xl transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="p-6 flex flex-col gap-2">
            {links.map((link) => (
              <div key={link.label} className="border-b border-slate-50 last:border-0">
                {link.action ? (
                  <button onClick={link.action} className="flex items-center justify-between w-full py-4 text-left font-black text-slate-900 uppercase tracking-widest text-sm">
                    {link.label} <FaChevronRight className="text-green-500 text-xs" />
                  </button>
                ) : (
                  <Link to={link.href!} onClick={() => setMenuOpen(false)} className="flex items-center justify-between w-full py-4 font-black text-slate-900 uppercase tracking-widest text-sm">
                    {link.label} <FaChevronRight className="text-green-500 text-xs" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE QUICK-ACTION TAB BAR (Thinner & Bottom Docked) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1001] bg-slate-900 border-t border-white/10">
        <div className="flex items-center justify-between shadow-2xl">
          <a href={`tel:${CONTACT_PHONE}`} className="flex-1 flex flex-col items-center py-2.5 text-white active:bg-slate-800 transition-colors">
            <FaPhoneAlt className="text-green-500 mb-0.5 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest">Call</span>
          </a>
          <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}`} className="flex-1 flex flex-col items-center py-2.5 border-x border-white/5 text-white active:bg-slate-800 transition-colors">
            <FaWhatsapp className="text-green-500 mb-0.5 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex-1 flex flex-col items-center py-2.5 text-white active:bg-slate-800 transition-colors">
            <FaEnvelope className="text-green-500 mb-0.5 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest">Email</span>
          </a>
        </div>
      </div>

      {/* Spacers to prevent content overlap */}
      <div className="h-20 md:h-24" /> {/* Top Spacer */}
      <div className="lg:hidden h-12" /> {/* Bottom Spacer for mobile bar */}
    </>
  );
}