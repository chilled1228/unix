"use client";

import { Clock, Globe, Copy, Smartphone, Zap, Building2 } from "lucide-react";
import { CityData } from '@/data/cities';

interface CityFeaturesProps {
  cityData: CityData;
}

export function CityFeatures({ cityData }: CityFeaturesProps) {
  const features = [
    {
      icon: Clock,
      title: `${cityData.name} Time Conversion`,
      description: `Instantly convert Unix timestamps to ${cityData.name} local time (${cityData.timezone}) with precise accuracy.`
    },
    {
      icon: Globe,
      title: `${cityData.timezone} Support`,
      description: `Full support for ${cityData.name}'s timezone including daylight saving time transitions and UTC offset (${cityData.utcOffset}).`
    },
    {
      icon: Building2,
      title: `${cityData.name} Business Hours`,
      description: `Optimized for ${cityData.name} business operations with examples for typical working hours (${cityData.businessHours.start} - ${cityData.businessHours.end}).`
    },
    {
      icon: Copy,
      title: "One-click Copy",
      description: `Copy converted ${cityData.name} timestamps to clipboard instantly for use in your applications and systems.`
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: `Access the ${cityData.name} timestamp converter on any device with our responsive, mobile-friendly interface.`
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: `Live timestamp updates showing current ${cityData.name} time with automatic refresh every second.`
    }
  ];

  return (
    <section className="py-16 px-4 bg-brand-secondary-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
            Why Use Our {cityData.name} Timestamp Converter?
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
            Specifically designed for {cityData.name}, {cityData.country} with local timezone support, 
            business hour examples, and {cityData.language} localization.
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

        {/* City-specific benefits */}
        <div className="mt-12 bg-brand-primary-50 p-8 rounded-xl border border-brand-primary-200">
          <h3 className="text-2xl font-bold text-brand-secondary-900 mb-6 text-center">
            Perfect for {cityData.name} Professionals
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-brand-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">💼</span>
              </div>
              <h4 className="font-semibold text-brand-secondary-900 mb-1">Business</h4>
              <p className="text-sm text-brand-secondary-600">
                {cityData.name} business hours and meeting scheduling
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">💻</span>
              </div>
              <h4 className="font-semibold text-brand-secondary-900 mb-1">Development</h4>
              <p className="text-sm text-brand-secondary-600">
                API integration and {cityData.name} server timestamps
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <h4 className="font-semibold text-brand-secondary-900 mb-1">Analytics</h4>
              <p className="text-sm text-brand-secondary-600">
                {cityData.name} data analysis and reporting
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">🌐</span>
              </div>
              <h4 className="font-semibold text-brand-secondary-900 mb-1">Global Teams</h4>
              <p className="text-sm text-brand-secondary-600">
                Coordinate with {cityData.name} team members
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
