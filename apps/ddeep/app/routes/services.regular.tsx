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

export function meta() {
  return [
    { title: "Regular Cleaning Services | D Deep Cleaning" },
    {
      name: "description",
      content: "Weekly or fortnightly regular cleaning services for homes and offices across Manchester and Liverpool. Consistent, reliable cleaning on your schedule."
    },
    {
      name: "keywords",
      content: "regular cleaning, weekly cleaners, fortnightly cleaning, domestic cleaners, office cleaning schedule, trusted cleaners manchester"
    },
    { name: "robots", content: "index, follow" },
  ];
}

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
];

export default function RegularCleaning() {
  return (
    <div>
      <h1>{heroTexts.regular.heroTitle}</h1>
      <p>{heroTexts.regular.heroSubtitle}</p>
      <DeepCleaningContent />
      <div>
        {badges.map((badge, idx) => (
          <div key={idx}>
            {badge.icon}
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
