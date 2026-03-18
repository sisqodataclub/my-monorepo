"use client";

import React from "react";
import { PageTitle } from "../components/PageTitle";

interface FAQItem {
  question: string;
  answer: string;
}

interface HomeFAQProps {
  faqs: FAQItem[];
}

export const HomeFAQ: React.FC<HomeFAQProps> = ({ faqs }) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 space-y-8">
      <PageTitle title="Frequently Asked Questions" />
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-green-50 dark:bg-gray-900/30 rounded-lg p-4 shadow-sm"
          >
            <h3 className="font-semibold text-green-900 dark:text-green-200">
              {faq.question}
            </h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
};
