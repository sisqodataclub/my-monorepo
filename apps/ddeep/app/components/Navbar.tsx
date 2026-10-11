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