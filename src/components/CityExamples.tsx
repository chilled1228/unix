"use client";

import { ArrowRight, Clock, Calendar } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { fromUnixTime } from "date-fns";
import { CityData } from '@/data/cities';

interface CityExamplesProps {
  cityData: CityData;
}

export function CityExamples({ cityData }: CityExamplesProps) {
  const examples = [
    {
      title: `${cityData.name} Business Start`,
      unix: cityData.examples.businessStart.toString(),
      description: `Typical business day start in ${cityData.name}`,
      icon: "🏢"
    },
    {
      title: `${cityData.name} Lunch Time`,
      unix: cityData.examples.lunchTime.toString(),
      description: `Common lunch hour in ${cityData.name}`,
      icon: "🍽️"
    },
    {
      title: `${cityData.name} Business End`,
      unix: cityData.examples.businessEnd.toString(),
      description: `End of business day in ${cityData.name}`,
      icon: "🏁"
    },
    {
      title: `${cityData.name} Midnight`,
      unix: cityData.examples.midnight.toString(),
      description: `Start of new day in ${cityData.name}`,
      icon: "🌙"
    }
  ];

  const useCases = [
    {
      title: `${cityData.name} Software Development`,
      description: `Debug applications and analyze logs with ${cityData.name} timestamps. Perfect for local development teams and ${cityData.timezone} server operations.`
    },
    {
      title: `${cityData.name} Business Operations`,
      description: `Schedule meetings, track business hours, and coordinate with ${cityData.name} teams using precise timestamp conversion for ${cityData.country} operations.`
    },
    {
      title: `${cityData.name} Data Analysis`,
      description: `Process time-series data, generate reports, and analyze user behavior patterns specific to ${cityData.name} and ${cityData.timezone} timezone.`
    },
    {
      title: `${cityData.name} API Integration`,
      description: `Integrate with ${cityData.name}-based APIs, webhooks, and third-party services that use Unix timestamps in ${cityData.timezone} timezone.`
    }
  ];

  const formatTimestamp = (timestamp: number) => {
    try {
      const date = fromUnixTime(timestamp);
      return formatInTimeZone(date, cityData.timezone, cityData.localTimeFormat);
    } catch (error) {
      return "Invalid timestamp";
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Examples Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
              Common {cityData.name} Timestamp Examples
            </h2>
            <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
              Real-world timestamp examples for {cityData.name}, {cityData.country} in {cityData.timezone} timezone. 
              Perfect for understanding local business hours and daily schedules.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:shadow-md hover:border-brand-primary-300 transition-all duration-200"
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{example.icon}</div>
                  <h3 className="text-lg font-semibold text-brand-secondary-900 mb-1">
                    {example.title}
                  </h3>
                  <p className="text-xs text-brand-secondary-500">
                    {example.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-xs text-brand-secondary-600 mb-1">Unix Timestamp</div>
                    <code className="bg-brand-primary-100 text-brand-primary-800 px-3 py-1 rounded text-sm font-mono block">
                      {example.unix}
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-center text-brand-secondary-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-brand-secondary-600 mb-1">{cityData.name} Time</div>
                    <div className="text-sm font-medium text-brand-secondary-900 bg-white p-2 rounded border">
                      {formatTimestamp(parseInt(example.unix))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
              {cityData.name} Timestamp Converter Use Cases
            </h2>
            <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
              How professionals in {cityData.name}, {cityData.country} use Unix timestamp conversion 
              for business operations, development, and data analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-brand-primary-50 rounded-xl border border-brand-primary-100"
              >
                <div className="bg-brand-primary-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-secondary-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-brand-secondary-600">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Information */}
        <div className="mt-16 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 p-8 rounded-xl border border-brand-primary-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-brand-secondary-900 mb-2">
              {cityData.name} Local Information
            </h3>
            <p className="text-brand-secondary-600">
              Essential details for working with {cityData.name} timestamps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border border-brand-secondary-200 text-center">
              <Clock className="w-6 h-6 text-brand-primary-600 mx-auto mb-2" />
              <div className="text-sm text-brand-secondary-600">Timezone</div>
              <div className="font-semibold text-brand-secondary-900">{cityData.timezone}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-brand-secondary-200 text-center">
              <Calendar className="w-6 h-6 text-brand-primary-600 mx-auto mb-2" />
              <div className="text-sm text-brand-secondary-600">Date Format</div>
              <div className="font-semibold text-brand-secondary-900">{cityData.localTimeFormat}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-brand-secondary-200 text-center">
              <span className="text-2xl mb-2 block">💰</span>
              <div className="text-sm text-brand-secondary-600">Currency</div>
              <div className="font-semibold text-brand-secondary-900">{cityData.currency}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-brand-secondary-200 text-center">
              <span className="text-2xl mb-2 block">🗣️</span>
              <div className="text-sm text-brand-secondary-600">Language</div>
              <div className="font-semibold text-brand-secondary-900">{cityData.language}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
