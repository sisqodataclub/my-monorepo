"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTitle } from "../components/PageTitle";
import { FaChevronDown } from "react-icons/fa";

export interface FAQItem {
  question: string;
  answer: string;
}

interface HomeFAQProps {
  faqs: FAQItem[];
}

export const HomeFAQ: React.FC<HomeFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <PageTitle title="Frequently Asked Questions" />
        <p className="mt-4 text-slate-500 font-medium">
          Everything you need to know about our professional services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`group border transition-all duration-300 rounded-2xl overflow-hidden ${
                isOpen 
                  ? "border-green-500 bg-white shadow-md" 
                  : "border-slate-100 bg-slate-50/50 hover:border-green-200"
              }`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center transition-colors focus:outline-none"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
              >
                <span className={`font-bold text-lg transition-colors ${
                  isOpen ? "text-green-700" : "text-slate-800 group-hover:text-green-600"
                }`}>
                  {faq.question}
                </span>
                
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`${isOpen ? "text-green-600" : "text-slate-400"}`}
                >
                  <FaChevronDown className="text-sm" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
};