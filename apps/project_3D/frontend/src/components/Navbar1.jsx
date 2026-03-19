import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { styles } from "../styles";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const filteredNavLinks = location.pathname === "/blog"
    ? navLinks.filter((nav) => nav.title === "Google" || nav.title === "Blog")
    : navLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`
      ${styles.paddingX}
      w-full fixed top-0 z-50 transition-all duration-300
      ${scrolled ? "bg-primary shadow-md" : "bg-transparent"}
    `}>
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={() => {
          setActive("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-xl shadow-md">
            F
          </div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Francis
          </h1>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex gap-10 items-center">
          {filteredNavLinks.map((nav) => (
            <li
              key={nav.id}
              className={`text-[17px] font-medium cursor-pointer transition-colors duration-200 ${
                active === nav.title ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActive(nav.title)}
            >
              {nav.external ? (
                <a href={nav.id} target="_blank" rel="noopener noreferrer">{nav.title}</a>
              ) : nav.id.startsWith("/") ? (
                <Link to={nav.id}>{nav.title}</Link>
              ) : (
                <a href={`#${nav.id}`}>{nav.title}</a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setToggle(!toggle)} className="text-white">
            {toggle ? <X size={28} /> : <Menu size={28} />}
          </button>

          <AnimatePresence>
            {toggle && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-20 right-4 w-[180px] rounded-xl p-6 bg-black/80 backdrop-blur-md z-40"
              >
                <ul className="flex flex-col gap-4">
                  {filteredNavLinks.map((nav) => (
                    <li
                      key={nav.id}
                      className={`text-[16px] font-medium cursor-pointer ${
                        active === nav.title ? "text-white" : "text-gray-400"
                      }`}
                      onClick={() => {
                        setActive(nav.title);
                        setToggle(false);
                      }}
                    >
                      {nav.external ? (
                        <a href={nav.id} target="_blank" rel="noopener noreferrer">{nav.title}</a>
                      ) : nav.id.startsWith("/") ? (
                        <Link to={nav.id}>{nav.title}</Link>
                      ) : (
                        <a href={`#${nav.id}`}>{nav.title}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
