"use client";

import { Clock, MapPin, Users, Globe } from 'lucide-react';
import { CityData } from '@/data/cities';

interface CityHeroProps {
  cityData: CityData;
}

export function CityHero({ cityData }: CityHeroProps) {
  return (
    <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-primary-600 p-4 rounded-full shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-brand-secondary-900 mb-4">
          Unix Timestamp Converter for {cityData.name}
        </h1>
        
        <p className="text-lg md:text-xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
          Convert Unix timestamps to {cityData.name} local time ({cityData.timezone}). 
          {cityData.description}
        </p>

        {/* City Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-brand-primary-200">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-brand-primary-600" />
            </div>
            <div className="text-sm text-brand-secondary-600">Location</div>
            <div className="font-semibold text-brand-secondary-900">{cityData.country}</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-brand-primary-200">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-brand-primary-600" />
            </div>
            <div className="text-sm text-brand-secondary-600">Timezone</div>
            <div className="font-semibold text-brand-secondary-900">{cityData.utcOffset}</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-brand-primary-200">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-brand-primary-600" />
            </div>
            <div className="text-sm text-brand-secondary-600">Population</div>
            <div className="font-semibold text-brand-secondary-900">{cityData.population}</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-brand-primary-200">
            <div className="flex items-center justify-center mb-2">
              <Globe className="w-5 h-5 text-brand-primary-600" />
            </div>
            <div className="text-sm text-brand-secondary-600">Business Hours</div>
            <div className="font-semibold text-brand-secondary-900">
              {cityData.businessHours.start} - {cityData.businessHours.end}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 text-sm text-brand-secondary-500">
          <span className="bg-white/50 px-3 py-1 rounded-full">
            ✓ {cityData.name} local time conversion
          </span>
          <span className="bg-white/50 px-3 py-1 rounded-full">
            ✓ {cityData.timezone} timezone support
          </span>
          <span className="bg-white/50 px-3 py-1 rounded-full">
            ✓ Business hours examples
          </span>
          <span className="bg-white/50 px-3 py-1 rounded-full">
            ✓ Real-time conversion
          </span>
        </div>
      </div>
    </section>
  );
}
