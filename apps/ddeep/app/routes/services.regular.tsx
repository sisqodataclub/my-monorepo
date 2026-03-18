"use client";

import DeepCleaningContent from "../components/landing/dynamic";
import {
  FaHome,
  FaBriefcase,
  FaShieldAlt,
  FaCertificate,
  FaLeaf,
  FaChild,
} from "react-icons/fa";

/* ================= DATA ================= */

const heroTexts = {
  regular: {
    heroTitle: "Reliable Regular Cleaning Services",
    heroSubtitle:
      "Keep your home or workplace consistently clean with trusted, professional cleaners on a schedule that suits you.",
    ctaPrimaryText:
      "Our regular cleaning services are designed to keep your space fresh, hygienic, and stress-free all year round.",
    ctaSecondaryText:
      "Trusted by households and businesses across the North West.",
  },
};

const badges = [
  { icon: <FaHome />, text: "Fully Insured Cleaners" },
  { icon: <FaBriefcase />, text: "Weekly & Fortnightly Plans" },
  { icon: <FaLeaf />, text: "Eco-Friendly Products" },
  { icon: <FaShieldAlt />, text: "Trusted Local Professionals" },
  { icon: <FaChild />, text: "Safe for Kids & Pets" },
  { icon: <FaCertificate />, text: "Consistent Quality Cleaning" },
];

const heroButtons = [
  { label: "Get a Free Quote", href: "/contact", primary: true },
  { label: "Speak to Our Team", href: "/contact" },
];

const regularCleaningFeatures = [
  {
    title: "Weekly & Fortnightly Cleaning",
    description:
      "Maintain a spotless home or office with reliable scheduled cleaning that fits around your lifestyle.",
  },
  {
    title: "Professional Trusted Cleaners",
    description:
      "Fully vetted, insured, and trained cleaners you can confidently welcome into your space.",
  },
  {
    title: "Custom Cleaning Checklist",
    description:
      "We tailor each clean to your priorities — from kitchens and bathrooms to bedrooms and workspaces.",
  },
  {
    title: "Eco-Friendly Products",
    description:
      "Safe, non-toxic products that protect your family, pets, and the environment.",
  },
  {
    title: "Consistent High Standards",
    description:
      "The same professional approach every visit, ensuring long-term cleanliness and peace of mind.",
  },
];

/* ================= PAGE ================= */

export default function RegularCleanPage() {
  return (
    <DeepCleaningContent
      heroTitle={heroTexts.regular.heroTitle}
      heroSubtitle={heroTexts.regular.heroSubtitle}
      ctaPrimaryText={heroTexts.regular.ctaPrimaryText}
      ctaSecondaryText={heroTexts.regular.ctaSecondaryText}
      heroButtons={heroButtons}
      badges={badges}
      featureCards={regularCleaningFeatures}
    />
  );
}
