// app/components/Footer.tsx
import { Link } from "react-router";
import { servicesContent } from "./landing/servicesContent";
import { useContactModal } from "../context/ContactModalContext";
import { targetCities as locations } from "../utils/locations";
import { FaPhone, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export function Footer() {
  const { openModal } = useContactModal();

  const services = Object.entries(servicesContent).map(([slug, data]) => ({
    slug,
    title: data.heroTitle,
  }));

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Company Info */}
        <div>
          <h3 className="text-white text-xl font-black mb-4 tracking-wider">
            D DEEP <span className="text-green-400">CLEANING</span>
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Professional domestic and commercial cleaning services across the North West. Fully insured, vetted, and trusted by homeowners and businesses.
          </p>
          <div className="space-y-2 text-sm text-slate-300">
            <p className="flex items-center gap-2">
              <FaPhone className="text-green-400" />
              <a href="tel:07459416262" className="hover:text-green-400 transition-colors">07459 416262</a>
            </p>
            <p className="flex items-center gap-2">
              <FaWhatsapp className="text-green-400" />
              <a href="https://wa.me/447459416262" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">WhatsApp Chat</a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-green-400" />
              <a href="mailto:clean@ddeepcleaningservices.com" className="hover:text-green-400 transition-colors">clean@ddeepcleaningservices.com</a>
            </p>
          </div>
        </div>

        {/* Popular Services */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="hover:text-green-400 transition-colors"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Hubs */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Locations Covered</h4>
          <ul className="space-y-2 text-sm grid grid-cols-2 gap-x-2">
            {locations.map((citySlug: string) => {
              // Convert slug like "manchester-city-centre" back to a readable title like "Manchester City Centre"
              const cityName = citySlug
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

              return (
                <li key={citySlug}>
                  <Link
                    to={`/locations/${citySlug}/`}
                    className="hover:text-green-400 transition-colors"
                  >
                    {cityName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-green-400 transition-colors">Home</Link>
            </li>
            <li>
              <button
                onClick={openModal}
                className="hover:text-green-400 transition-colors text-left bg-transparent p-0 cursor-pointer"
              >
                Get a Quote
              </button>
            </li>
            <li>
              <Link to="/tc" className="hover:text-green-400 transition-colors">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} D DEEP Cleaning Services. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/tc" className="hover:text-slate-300 transition-colors">T&C</Link>
        </div>
      </div>
    </footer>
  );
}
