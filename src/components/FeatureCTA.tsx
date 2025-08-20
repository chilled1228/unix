"use client";

import { 
  ArrowRight, 
  Clock, 
  Layers, 
  Globe, 
  Code, 
  Zap,
  Calendar,
  Database
} from "lucide-react";
import Link from "next/link";

interface FeatureCTAProps {
  currentPage?: string;
  title?: string;
  description?: string;
}

const allFeatures = [
  {
    id: "converter",
    icon: Clock,
    title: "Main Converter",
    description: "Real-time Unix timestamp conversion",
    href: "/",
    color: "bg-blue-500"
  },
  {
    id: "batch",
    icon: Layers,
    title: "Batch Converter",
    description: "Convert multiple timestamps at once",
    href: "/#batch-converter",
    color: "bg-green-500"
  },
  {
    id: "cities",
    icon: Globe,
    title: "City Converters",
    description: "Timezone-specific conversions",
    href: "/cities",
    color: "bg-purple-500"
  },
  {
    id: "api",
    icon: Code,
    title: "Developer API",
    description: "Programmatic access",
    href: "/unix-converter-api",
    color: "bg-orange-500"
  },
  {
    id: "unix-to-date",
    icon: Calendar,
    title: "Unix to Date",
    description: "Specialized conversion tool",
    href: "/unix-time-to-date",
    color: "bg-indigo-500"
  },
  {
    id: "epoch",
    icon: Zap,
    title: "Epoch Converter",
    description: "Advanced epoch conversion",
    href: "/epoch-converter",
    color: "bg-red-500"
  },
  {
    id: "universal",
    icon: Database,
    title: "Universal Converter",
    description: "Multiple format support",
    href: "/timestamp-converter",
    color: "bg-teal-500"
  }
];

export function FeatureCTA({ 
  currentPage = "",
  title = "Explore More Conversion Tools",
  description = "Discover all the powerful features available for your timestamp conversion needs."
}: FeatureCTAProps) {
  // Filter out current page and show 3-4 related features
  const relatedFeatures = allFeatures
    .filter(feature => !currentPage.includes(feature.id))
    .slice(0, 4);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-brand-secondary-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {relatedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                href={feature.href}
                className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200 hover:shadow-xl hover:border-brand-primary-300 transition-all duration-300 group"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-brand-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-brand-secondary-600 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-brand-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Try Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-brand-secondary-200">
            <h3 className="text-xl font-bold text-brand-secondary-900 mb-4">
              Need Something Specific?
            </h3>
            <p className="text-brand-secondary-600 mb-6">
              Can't find what you're looking for? Check out our complete feature list or contact us for custom solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cities"
                className="bg-brand-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                View All Cities
              </Link>
              <Link
                href="/unix-converter-api"
                className="border-2 border-brand-primary-600 text-brand-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-600 hover:text-white transition-colors inline-flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
