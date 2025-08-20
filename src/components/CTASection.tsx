"use client";

import { 
  Clock, 
  Layers, 
  Globe, 
  Code, 
  Zap, 
  ArrowRight, 
  Copy, 
  Calendar,
  MapPin,
  Database,
  Smartphone,
  Shield
} from "lucide-react";
import Link from "next/link";

const mainFeatures = [
  {
    icon: Clock,
    title: "Instant Conversion",
    description: "Convert Unix timestamps to dates and vice versa in real-time",
    href: "#converter",
    color: "bg-blue-500",
    action: "Try Now"
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description: "Convert multiple timestamps at once for bulk operations",
    href: "#batch-converter",
    color: "bg-green-500",
    action: "Batch Convert"
  },
  {
    icon: Globe,
    title: "City Converters",
    description: "Timezone-specific converters for European cities",
    href: "/cities",
    color: "bg-purple-500",
    action: "Explore Cities"
  },
  {
    icon: Code,
    title: "Developer API",
    description: "Programmatic access for your applications",
    href: "/unix-converter-api",
    color: "bg-orange-500",
    action: "View API"
  }
];

const additionalTools = [
  {
    icon: Calendar,
    title: "Unix to Date",
    description: "Specialized Unix timestamp to date conversion",
    href: "/unix-time-to-date"
  },
  {
    icon: Zap,
    title: "Epoch Converter",
    description: "Advanced epoch time conversion with formatting",
    href: "/epoch-converter"
  },
  {
    icon: Database,
    title: "Universal Converter",
    description: "Convert between multiple timestamp formats",
    href: "/timestamp-converter"
  },
  {
    icon: MapPin,
    title: "London Time",
    description: "Convert timestamps to London timezone",
    href: "/london"
  },
  {
    icon: MapPin,
    title: "Paris Time",
    description: "Convert timestamps to Paris timezone",
    href: "/paris"
  },
  {
    icon: MapPin,
    title: "Berlin Time",
    description: "Convert timestamps to Berlin timezone",
    href: "/berlin"
  }
];

const quickFeatures = [
  { icon: Copy, text: "One-click copy to clipboard" },
  { icon: Smartphone, text: "Mobile-optimized interface" },
  { icon: Shield, text: "Privacy-first, no data stored" },
  { icon: Zap, text: "Lightning-fast conversions" }
];

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-brand-secondary-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-secondary-900 mb-6">
            Everything You Need for Timestamp Conversion
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto mb-8">
            From simple conversions to advanced batch processing and API access - 
            we've got all your Unix timestamp needs covered.
          </p>
          
          {/* Quick Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {quickFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-brand-secondary-600">
                <feature.icon className="w-5 h-5 text-brand-primary-600" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-brand-secondary-200 hover:shadow-xl hover:border-brand-primary-300 transition-all duration-300 group"
              >
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-brand-secondary-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-2 text-brand-primary-600 font-semibold hover:text-brand-primary-700 transition-colors group-hover:gap-3"
                >
                  {feature.action}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Additional Tools */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-brand-secondary-200">
          <h3 className="text-2xl font-bold text-brand-secondary-900 mb-8 text-center">
            Specialized Conversion Tools
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={index}
                  href={tool.href}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-brand-primary-50 transition-colors group"
                >
                  <div className="bg-brand-primary-100 p-2 rounded-lg group-hover:bg-brand-primary-200 transition-colors">
                    <Icon className="w-5 h-5 text-brand-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-secondary-900 mb-1">
                      {tool.title}
                    </h4>
                    <p className="text-sm text-brand-secondary-600">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Converting?
            </h3>
            <p className="text-brand-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and professionals who trust our Unix timestamp converter 
              for accurate, fast, and reliable time conversions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#converter"
                className="bg-white text-brand-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-brand-primary-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Converting Now
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/unix-converter-api"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-brand-primary-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                Explore API
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
