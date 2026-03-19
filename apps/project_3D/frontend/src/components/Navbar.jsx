import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  // Show all links on home page, else only Blog, Google, Login/Register, Logout
  const filteredLinks = isHomePage
    ? navLinks.filter((nav) => {
        if (nav.title === "Login/Register") return !isAuthenticated;
        if (nav.title === "Logout") return isAuthenticated;
        return true;
      })
    : navLinks.filter((nav) =>
        ["Blog", "Google", "Login/Register", "Logout"].includes(nav.title)
      );

  return (
    <nav
      className={`
        ${styles.paddingX}
        w-full fixed top-0 z-50 transition-all duration-300
        ${scrolled ? "bg-primary shadow-md" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-xl shadow-md">
            F
          </div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Francis
          </h1>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex gap-10 items-center">
          {filteredLinks.map((nav) => (
            <li
              key={nav.id}
              className={`text-[17px] font-medium cursor-pointer transition-colors duration-200 ${
                active === nav.title
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActive(nav.title)}
            >
              {nav.external ? (
                <a href={nav.id} target="_blank" rel="noopener noreferrer">
                  {nav.title}
                </a>
              ) : nav.title === "Logout" ? (
                <button onClick={logout} className="text-left w-full">
                  {nav.title}
                </button>
              ) : nav.id.startsWith("/") ? (
                <Link to={nav.id}>{nav.title}</Link>
              ) : (
                <a href={`#${nav.id}`}>{nav.title}</a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center">
          <button
            className="text-white"
            onClick={() => setToggle(!toggle)}
            aria-label="Toggle menu"
          >
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
                  {filteredLinks.map((nav) => (
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
                        <a href={nav.id} target="_blank" rel="noopener noreferrer">
                          {nav.title}
                        </a>
                      ) : nav.title === "Logout" ? (
                        <button onClick={logout} className="text-left w-full">
                          {nav.title}
                        </button>
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
