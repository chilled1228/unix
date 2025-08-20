"use client";

import { Clock, Globe, Copy, Smartphone, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Real-time Conversion",
    description: "Convert timestamps instantly as you type with live updates and validation."
  },
  {
    icon: Globe,
    title: "Multiple Timezones",
    description: "Support for all major timezones including UTC, EST, PST, GMT, and more."
  },
  {
    icon: Copy,
    title: "One-click Copy",
    description: "Copy converted results to clipboard with a single click for easy sharing."
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive design that works perfectly on all devices and screen sizes."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with instant conversions and minimal loading times."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All conversions happen locally in your browser. No data is sent to servers."
  }
];

export function Features() {
  return (
    <section className="py-16 px-4 bg-brand-secondary-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
            Why Choose Our Unix Timestamp Converter?
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
            Built with modern web technologies for the best user experience.
            Fast, reliable, and completely free to use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-brand-secondary-200 hover:shadow-md hover:border-brand-primary-300 transition-all duration-200"
              >
                <div className="bg-brand-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-brand-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-brand-secondary-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
