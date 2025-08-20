"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is a Unix timestamp?",
    answer: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC (also known as the Unix epoch). It's a standard way to represent time in computer systems and is widely used in programming, databases, and APIs."
  },
  {
    question: "What's the difference between Unix timestamp in seconds and milliseconds?",
    answer: "Unix timestamps are traditionally measured in seconds since the epoch. However, some systems (like JavaScript) use milliseconds. A timestamp with 10 digits is in seconds, while 13 digits indicates milliseconds. Our converter automatically detects and handles both formats."
  },
  {
    question: "How do I convert a Unix timestamp to a human-readable date?",
    answer: "Simply enter your Unix timestamp in the 'Unix Timestamp to Date' field above. The conversion happens automatically and shows the result in your selected timezone and date format. You can also copy the result with one click."
  },
  {
    question: "Can I convert dates from different timezones?",
    answer: "Yes! Our converter supports all major timezones. Select your desired timezone from the dropdown menu, and all conversions will be displayed in that timezone. The Unix timestamp itself is always in UTC, but the human-readable format will show the local time."
  },
  {
    question: "Is my data safe when using this converter?",
    answer: "Absolutely! All conversions happen locally in your browser using JavaScript. No data is sent to our servers or stored anywhere. Your timestamps and dates remain completely private and secure."
  },
  {
    question: "What date formats are supported?",
    answer: "We support multiple date formats including US format (MM/dd/yyyy), UK format (dd/MM/yyyy), ISO format (yyyy-MM-dd), and long format (Jan 01, 2024). You can switch between formats using the dropdown menu."
  },
  {
    question: "What's the maximum date range supported?",
    answer: "Our converter supports the full range of Unix timestamps, from the epoch (January 1, 1970) to the year 2038 problem limit (January 19, 2038) for 32-bit systems, and beyond for 64-bit systems. It also handles negative timestamps for dates before 1970."
  },
  {
    question: "Can I use this tool on mobile devices?",
    answer: "Yes! Our Unix timestamp converter is fully responsive and works perfectly on all devices including smartphones and tablets. The interface adapts to your screen size for the best user experience."
  },
  {
    question: "How accurate are the conversions?",
    answer: "Our conversions are mathematically precise and use the standard Unix timestamp calculation. We use the date-fns library, which is widely trusted in the JavaScript community for accurate date and time operations."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, our Unix timestamp converter is completely free to use with no limitations. There are no ads, no registration required, and no premium features. We believe in providing useful tools accessible to everyone."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-brand-secondary-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
            Everything you need to know about Unix timestamps and how to use our converter tool.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-brand-secondary-200 shadow-sm overflow-hidden hover:border-brand-primary-300 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-brand-secondary-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-brand-secondary-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-brand-secondary-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-brand-secondary-500 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-brand-secondary-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
