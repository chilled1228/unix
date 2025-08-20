"use client";

import { Clock } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-primary-600 p-4 rounded-full shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary-900 mb-6">
          Unix Timestamp Converter
        </h1>

        <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
          Convert Unix timestamps to human-readable dates and vice versa.
          Fast, accurate, and completely free online tool.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-secondary-500">
          <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            ✓ Real-time conversion
          </span>
          <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            ✓ Multiple timezones
          </span>
          <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            ✓ Copy to clipboard
          </span>
          <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            ✓ Mobile-friendly
          </span>
        </div>
      </div>
    </section>
  );
}
