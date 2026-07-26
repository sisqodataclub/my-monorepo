import React from "react";
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
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-24">
      
      <div className="text-center mb-12">
        <PageTitle title="Frequently Asked Questions" />
        <p className="mt-4 text-slate-500 font-medium">
          Everything you need to know about our professional services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group border border-slate-100 bg-slate-50/50 hover:border-green-200 transition-all duration-300 rounded-2xl overflow-hidden open:border-green-500 open:bg-white open:shadow-md"
          >
            {/* 
              list-none and [&::-webkit-details-marker]:hidden 
              remove the default browser triangle so we can use our own icon 
            */}
            <summary className="w-full px-6 py-5 text-left flex justify-between items-center cursor-pointer focus:outline-none list-none [&::-webkit-details-marker]:hidden">
              <span className="font-bold text-lg text-slate-800 group-hover:text-green-600 transition-colors group-open:text-green-700">
                {faq.question}
              </span>
              
              <FaChevronDown className="text-sm text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-green-600" aria-hidden="true" />
            </summary>
            
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

    </section>
  );
};import React from "react";
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
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-24">
      
      <div className="text-center mb-12">
        <PageTitle title="Frequently Asked Questions" />
        <p className="mt-4 text-slate-500 font-medium">
          Everything you need to know about our professional services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group border border-slate-100 bg-slate-50/50 hover:border-green-200 transition-all duration-300 rounded-2xl overflow-hidden open:border-green-500 open:bg-white open:shadow-md"
          >
            {/* 
              list-none and [&::-webkit-details-marker]:hidden 
              remove the default browser triangle so we can use our own icon 
            */}
            <summary className="w-full px-6 py-5 text-left flex justify-between items-center cursor-pointer focus:outline-none list-none [&::-webkit-details-marker]:hidden">
              <span className="font-bold text-lg text-slate-800 group-hover:text-green-600 transition-colors group-open:text-green-700">
                {faq.question}
              </span>
              
              <FaChevronDown className="text-sm text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-green-600" aria-hidden="true" />
            </summary>
            
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

    </section>
  );
};
