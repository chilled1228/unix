"use client";

import { ArrowRight } from "lucide-react";

const examples = [
  {
    title: "Current Time",
    unix: "1735689600",
    date: "January 1, 2025 00:00:00 UTC",
    description: "New Year 2025 timestamp"
  },
  {
    title: "Unix Epoch",
    unix: "0",
    date: "January 1, 1970 00:00:00 UTC",
    description: "The beginning of Unix time"
  },
  {
    title: "Y2K Bug",
    unix: "946684800",
    date: "January 1, 2000 00:00:00 UTC",
    description: "The famous Y2K milestone"
  },
  {
    title: "Leap Second",
    unix: "1483228800",
    date: "January 1, 2017 00:00:00 UTC",
    description: "A leap second was added"
  },
  {
    title: "Bitcoin Genesis",
    unix: "1231006505",
    date: "January 3, 2009 18:15:05 UTC",
    description: "Bitcoin's first block timestamp"
  },
  {
    title: "Future Date",
    unix: "2147483647",
    date: "January 19, 2038 03:14:07 UTC",
    description: "32-bit Unix timestamp limit"
  }
];

const useCases = [
  {
    title: "Software Development",
    description: "Debug applications, log analysis, and database queries with timestamp data."
  },
  {
    title: "System Administration",
    description: "Server logs, cron jobs, and system monitoring with precise time tracking."
  },
  {
    title: "Data Analysis",
    description: "Process time-series data, analytics, and reporting with timestamp conversion."
  },
  {
    title: "API Integration",
    description: "Work with REST APIs, webhooks, and third-party services using Unix timestamps."
  }
];

export function Examples() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Examples Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
              Common Unix Timestamp Examples
            </h2>
            <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
              Here are some well-known timestamps and their human-readable equivalents
              to help you understand Unix time better.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:shadow-md hover:border-brand-primary-300 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-brand-secondary-900 mb-3">
                  {example.title}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-secondary-600">Unix:</span>
                    <code className="bg-brand-primary-100 text-brand-primary-800 px-2 py-1 rounded text-sm font-mono">
                      {example.unix}
                    </code>
                  </div>

                  <div className="flex items-center justify-center text-brand-secondary-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-medium text-brand-secondary-900 mb-1">
                      {example.date}
                    </div>
                    <div className="text-xs text-brand-secondary-500">
                      {example.description}
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
              Common Use Cases
            </h2>
            <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
              Unix timestamps are widely used across different industries and applications.
              Here's where you might encounter them.
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
      </div>
    </section>
  );
}
