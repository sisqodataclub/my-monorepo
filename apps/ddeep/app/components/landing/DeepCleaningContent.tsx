"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHome, FaBriefcase, FaShieldAlt, FaCertificate, FaLeaf, FaChild } from "react-icons/fa";
import HeroImage from "../../assets/bg.jpg";

// Badge component
interface BadgeProps {
  icon: React.ReactNode;
  text: string;
}
function Badge({ icon, text }: BadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-green-600/80 text-white font-semibold px-4 py-2 rounded-full shadow-md text-sm sm:text-base">
      {icon}
      {text}
    </div>
  );
}

export default function DeepCleaningContent() {
  // Floating glow variants
  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      transition: { duration: 8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
    },
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="relative min-h-screen flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HeroImage})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Floating Glow Effects */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="absolute -top-24 left-1/3 w-[450px] h-[450px] rounded-full bg-green-400/20 blur-3xl"
        />
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-400/20 blur-3xl"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center lg:text-left">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="block text-green-400">
              Professional Deep Cleaning Services You Can Trust
            </span>
          </motion.h1>

          <p className="mt-6 max-w-3xl text-lg md:text-xl text-white/90 leading-relaxed">
            Specialist deep cleaning for homes and businesses across Manchester & Lancashire. We
            tackle built-up dirt, hidden grime, and overlooked areas — delivering spotless results
            with fully insured professionals and eco-friendly products.
          </p>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Badge icon={<FaHome />} text="5,000+ Properties Deep Cleaned" />
            <Badge icon={<FaBriefcase />} text="Commercial & Office Specialists" />
            <Badge icon={<FaShieldAlt />} text="Fully Insured & Vetted Team" />
            <Badge icon={<FaCertificate />} text="Trained Professional Cleaners" />
            <Badge icon={<FaLeaf />} text="Eco-Friendly, Safe Products" />
            <Badge icon={<FaChild />} text="Safe for Children & Pets" />
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition"
            >
              Get a Free, No-Obligation Quote
            </Link>

            <Link
              to="/services"
              className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition"
            >
              View Our Cleaning Services
            </Link>
          </div>

          {/* Micro-trust line */}
          <p className="mt-4 text-sm text-white/80 max-w-xl">
            ✔ Flexible bookings • ✔ Fast response times • ✔ Satisfaction guaranteed
          </p>
        </div>
      </div>

      {/* ================= DEEP CLEANING CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        {/* Intro */}
        <p className="mx-auto max-w-3xl text-center text-lg md:text-xl leading-relaxed text-slate-700">
          Our professional deep cleaning service is designed for properties that need more than a
          standard clean. Whether you're preparing for an{" "}
          <span className="font-semibold text-green-700">end of tenancy</span>, completing a{" "}
          <span className="font-semibold text-green-700">renovation</span>, or booking a{" "}
          <span className="font-semibold text-green-700">one-off intensive clean</span>, we deliver
          exceptional results with precision, care, and attention to detail.
        </p>

        {/* Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-green-800">
              Comprehensive Room-by-Room Cleaning
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Deep cleaning of kitchens, bathrooms, bedrooms, and living areas — including
              hard-to-reach spots, built-up grease, and hidden grime often missed during routine
              cleans.
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-green-800">
              Commercial & Office Deep Cleans
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Create a healthier, more professional working environment. Ideal for offices, retail
              spaces, and commercial premises requiring hygienic, detail-focused cleaning.
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-green-800">
              Post-Construction & Renovation Cleaning
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Removal of fine dust, paint splashes, residue, and building debris. We leave newly
              renovated spaces clean, safe, and ready for immediate use.
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-green-800">Eco-Friendly Cleaning Products</h3>
            <p className="text-slate-700 leading-relaxed">
              We use high-quality, non-toxic cleaning products that are safe for children, pets,
              and the environment — without compromising on results.
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md sm:col-span-2">
            <h3 className="mb-2 text-lg font-semibold text-green-800">Trusted & Fully Insured Cleaners</h3>
            <p className="text-slate-700 leading-relaxed">
              Our trained professionals are fully vetted, insured, and experienced in delivering
              high-standard deep cleaning services you can rely on.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
