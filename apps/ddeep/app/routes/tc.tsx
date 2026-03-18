"use client";

import { PageTitle } from "../components/PageTitle";
import { useEffect, useState } from "react";
import { 
  FaHome, FaMoneyBill, FaCalendarAlt, FaUserCheck, 
  FaShieldAlt, FaSmile, FaLock, FaEdit, FaGavel, FaChevronUp 
} from "react-icons/fa";

export const meta = () => [
  { title: "Terms & Conditions | D Deep Cleaning Services Manchester" },
  { name: "description", content: "Our service terms, booking policies, and satisfaction guarantee for residential and commercial cleaning." }
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = [
    { id: "services", label: "Our Services", icon: <FaHome /> },
    { id: "pricing", label: "Pricing & Fees", icon: <FaMoneyBill /> },
    { id: "booking", label: "Booking & Payment", icon: <FaCalendarAlt /> },
    { id: "cancellation", label: "Cancellations", icon: <FaEdit /> },
    { id: "responsibilities", label: "Client Requirements", icon: <FaUserCheck /> },
    { id: "liability", label: "Liability & Insurance", icon: <FaShieldAlt /> },
    { id: "satisfaction", label: "Guarantee Policy", icon: <FaSmile /> },
    { id: "gdpr", label: "Data Protection", icon: <FaLock /> },
    { id: "law", label: "Governing Law", icon: <FaGavel /> },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 100; // Account for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = section.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(sec.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 mb-12">
          <div>
            <PageTitle title="Terms & Conditions" />
            <p className="text-slate-500 mt-2 font-medium">Please review our service agreement and policies.</p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Last Updated: 17 January 2026
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* STICKY NAVIGATION */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-28 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50">
              <h2 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-wider">On this page</h2>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeSection === sec.id
                        ? "bg-green-600 text-white shadow-lg shadow-green-200 translate-x-2"
                        : "text-slate-500 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <span className={`${activeSection === sec.id ? "text-white" : "text-green-600"} transition-colors`}>
                      {sec.icon}
                    </span>
                    <span className="text-sm font-bold">{sec.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <div className="lg:w-3/4">
            <div className="prose prose-slate prose-lg max-w-none">
              
              {/* Importance Notice */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl mb-12">
                <p className="text-green-900 font-bold m-0 italic">
                  "Our goal is to provide a transparent and high-quality experience. By booking any service with D Deep Cleaning Services, you acknowledge and agree to the terms outlined below."
                </p>
              </div>

              {sections.map((sec) => (
                <div key={sec.id} id={sec.id} className="mb-16 scroll-mt-28">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-xl shadow-inner shrink-0">
                      {sec.icon}
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 m-0 tracking-tight">
                      {sec.label}
                    </h2>
                  </div>

                  <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                    {/* Render Content based on ID */}
                    {sec.id === "services" && (
                      <>
                        <p>We provide professional cleaning solutions across Manchester and the North West. Our core expertise includes:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
                          {["Deep Cleaning", "End of Tenancy", "Post-Construction", "Commercial Office", "Leisure & Hospitality", "Student Housing"].map(item => (
                            <li key={item} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {item}
                            </li>
                          ))}
                        </ul>
                        <p>We reserve the right to refuse service if the property environment is deemed unsafe or poses a health risk to our staff.</p>
                      </>
                    )}

                    {sec.id === "pricing" && (
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <p className="m-0">Quotes are based on standard room sizes and average soil levels. Extra charges may apply for:</p>
                        <ul className="mt-4 space-y-2">
                          <li>Excessive waste removal or extreme hoarding conditions.</li>
                          <li>Specialist stain removal requiring niche chemicals.</li>
                          <li>Parking fees or congestion charges where applicable.</li>
                        </ul>
                      </div>
                    )}

                    {sec.id === "booking" && (
                      <p>Full payment is typically required upon completion. For large-scale commercial projects or end-of-tenancy cleans, a deposit may be requested to secure your date.</p>
                    )}

                    {sec.id === "cancellation" && (
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6">
                        <p className="m-0 font-bold text-slate-900">24-Hour Notice Policy</p>
                        <p className="mt-2 text-sm">Cancellations within 24 hours of the scheduled start time may incur a 50% service fee to cover staff scheduling losses.</p>
                      </div>
                    )}

                    {sec.id === "liability" && (
                      <p>D Deep Cleaning Services is fully insured with Public Liability insurance. We are not liable for pre-existing damage, wear and tear, or fragile items that were not disclosed prior to the clean.</p>
                    )}

                    {sec.id === "satisfaction" && (
                      <p className="bg-green-600 text-white p-6 rounded-2xl shadow-lg">
                        <strong>Our 24-Hour Guarantee:</strong> If you are not satisfied with any area we have cleaned, contact us within 24 hours. We will return to rectify the issue free of charge.
                      </p>
                    )}

                    {sec.id === "gdpr" && (
                      <p>Your privacy is paramount. We only collect data necessary for booking and service delivery. We never sell your information to third parties.</p>
                    )}

                    {sec.id === "law" && (
                      <p>These terms are governed by the laws of England and Wales. Any disputes will be handled within the jurisdiction of Manchester courts.</p>
                    )}
                  </div>

                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-green-600 transition-colors"
                  >
                    <FaChevronUp /> Return to top
                  </button>
                  
                  <div className="h-px bg-slate-100 mt-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}