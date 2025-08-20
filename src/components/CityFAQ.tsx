"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CityData } from '@/data/cities';

interface CityFAQProps {
  cityData: CityData;
}

export function CityFAQ({ cityData }: CityFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: `How do I convert Unix timestamps to ${cityData.name} time?`,
      answer: `Simply enter your Unix timestamp in the converter above. It will automatically convert to ${cityData.name} local time (${cityData.timezone}) accounting for daylight saving time changes. The result shows the exact time in ${cityData.name}, ${cityData.country}.`
    },
    {
      question: `What timezone does ${cityData.name} use?`,
      answer: `${cityData.name} uses the ${cityData.timezone} timezone with UTC offset of ${cityData.utcOffset}. This includes automatic handling of daylight saving time transitions throughout the year.`
    },
    {
      question: `What are typical business hours in ${cityData.name}?`,
      answer: `Standard business hours in ${cityData.name} are typically ${cityData.businessHours.start} to ${cityData.businessHours.end} local time. Our converter includes examples for these common business timestamps to help with scheduling and coordination.`
    },
    {
      question: `How accurate is the ${cityData.name} timestamp conversion?`,
      answer: `Our ${cityData.name} timestamp converter is mathematically precise and uses the official ${cityData.timezone} timezone database. It automatically handles daylight saving time transitions and provides accurate conversions for any date and time.`
    },
    {
      question: `Can I use this for ${cityData.name} business applications?`,
      answer: `Yes! This tool is perfect for ${cityData.name} business operations, including scheduling meetings, coordinating with local teams, analyzing ${cityData.name}-based data, and integrating with ${cityData.country} business systems.`
    },
    {
      question: `What date format does ${cityData.name} typically use?`,
      answer: `${cityData.name} commonly uses the ${cityData.localTimeFormat} date format. Our converter displays timestamps in this local format to match ${cityData.country} conventions and business practices.`
    },
    {
      question: `Is this ${cityData.name} timestamp converter free?`,
      answer: `Yes, our ${cityData.name} Unix timestamp converter is completely free to use with no limitations. There are no ads, registration requirements, or premium features. It's designed to help ${cityData.name} professionals and developers.`
    },
    {
      question: `Can I convert ${cityData.name} time back to Unix timestamps?`,
      answer: `Absolutely! You can enter any ${cityData.name} date and time, and our converter will generate the corresponding Unix timestamp. This is useful for API calls, database queries, and system integration with ${cityData.name}-based operations.`
    },
    {
      question: `Does this work for ${cityData.name} daylight saving time?`,
      answer: `Yes, our converter automatically handles daylight saving time transitions for ${cityData.name}. It uses the official ${cityData.timezone} timezone database to ensure accurate conversions throughout the year, including DST changes.`
    },
    {
      question: `How do I coordinate meetings with ${cityData.name} teams?`,
      answer: `Use our converter to translate meeting times between Unix timestamps and ${cityData.name} local time. This helps coordinate with ${cityData.name} team members, schedule international calls, and plan ${cityData.country} business activities.`
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-brand-secondary-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
            {cityData.name} Timestamp Converter FAQ
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
            Common questions about Unix timestamp conversion for {cityData.name}, {cityData.country} 
            and working with {cityData.timezone} timezone.
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

        {/* Additional City Info */}
        <div className="mt-12 bg-brand-primary-50 p-6 rounded-xl border border-brand-primary-200">
          <h3 className="text-xl font-bold text-brand-secondary-900 mb-4 text-center">
            Quick {cityData.name} Reference
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-brand-secondary-900">Population</div>
              <div className="text-brand-secondary-600">{cityData.population}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-brand-secondary-900">UTC Offset</div>
              <div className="text-brand-secondary-600">{cityData.utcOffset}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-brand-secondary-900">Currency</div>
              <div className="text-brand-secondary-600">{cityData.currency}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
