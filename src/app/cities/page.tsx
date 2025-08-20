import { Metadata } from 'next';
import Link from 'next/link';
import { europeanCities } from '@/data/cities';
import { Breadcrumbs } from '@/components/Breadcrumbs';

import { Clock, MapPin, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'European Cities - Unix Timestamp Converter | All Supported Cities',
  description: 'Unix timestamp converter for all major European cities. Convert timestamps to local time for London, Paris, Berlin, Madrid, Rome, Amsterdam and more European cities.',
  keywords: [
    'european cities timestamp converter',
    'europe unix time converter',
    'european timezone converter',
    'london paris berlin timestamp',
    'european business hours converter'
  ],
  alternates: {
    canonical: '/cities',
  },
};

export default function CitiesPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'European Cities', href: '/cities' }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-primary-600 p-4 rounded-full shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-brand-secondary-900 mb-4">
            European Cities Timestamp Converter
          </h1>
          
          <p className="text-lg md:text-xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
            Convert Unix timestamps to local time for major European cities. 
            Each city page includes timezone-specific examples, business hours, and localized formatting.
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
              Supported European Cities
            </h2>
            <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
              Click on any city to access its dedicated timestamp converter with local timezone support, 
              business hour examples, and city-specific formatting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {europeanCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:shadow-lg hover:border-brand-primary-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-brand-secondary-900 group-hover:text-brand-primary-600 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-brand-secondary-600">{city.country}</p>
                  </div>
                  <div className="bg-brand-primary-100 p-2 rounded-lg group-hover:bg-brand-primary-200 transition-colors">
                    <Clock className="w-5 h-5 text-brand-primary-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-brand-secondary-600">
                    <MapPin className="w-4 h-4 mr-2 text-brand-primary-600" />
                    <span>{city.timezone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-brand-secondary-600">
                    <Users className="w-4 h-4 mr-2 text-brand-primary-600" />
                    <span>{city.population}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-brand-secondary-600">
                    <Clock className="w-4 h-4 mr-2 text-brand-primary-600" />
                    <span>Business: {city.businessHours.start} - {city.businessHours.end}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-secondary-200">
                  <div className="text-sm text-brand-secondary-500">
                    UTC Offset: <span className="font-medium text-brand-secondary-700">{city.utcOffset}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="inline-flex items-center text-sm font-medium text-brand-primary-600 group-hover:text-brand-primary-700">
                    Convert timestamps →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-8">
            Why Use City-Specific Converters?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-brand-secondary-200">
              <div className="bg-brand-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-brand-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-2">
                Local Timezone Support
              </h3>
              <p className="text-brand-secondary-600">
                Automatic daylight saving time handling and precise timezone conversion for each European city.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-brand-secondary-200">
              <div className="bg-brand-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-brand-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-2">
                Business Context
              </h3>
              <p className="text-brand-secondary-600">
                City-specific business hours, local formatting, and examples relevant to each European market.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-brand-secondary-200">
              <div className="bg-brand-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-brand-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-2">
                Local Optimization
              </h3>
              <p className="text-brand-secondary-600">
                Optimized for local search results and designed for professionals working in each specific city.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
