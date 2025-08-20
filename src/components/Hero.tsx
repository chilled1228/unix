"use client";

import { Clock, ArrowRight, Layers, Globe, Code, Zap } from "lucide-react";
import Link from "next/link";

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
          Unix Timestamp Converter - Convert Epoch Time to Date
        </h1>

        <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
          Convert Unix timestamps to human-readable dates and vice versa.
          Fast, accurate, and completely free online tool.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-secondary-500 mb-8">
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

        {/* Main CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="#converter"
            className="bg-brand-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Start Converting Now
            <ArrowRight className="w-5 h-5" />
          </a>
          <Link
            href="#batch-converter"
            className="bg-white text-brand-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-primary-50 transition-all duration-200 border-2 border-brand-primary-600 flex items-center gap-2"
          >
            <Layers className="w-5 h-5" />
            Batch Convert
          </Link>
        </div>

        {/* Quick Access Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link
            href="/cities"
            className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50 hover:bg-white/90 transition-all duration-200 group"
          >
            <Globe className="w-6 h-6 text-brand-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-semibold text-brand-secondary-900">City Converters</div>
            <div className="text-xs text-brand-secondary-600">European cities</div>
          </Link>
          <Link
            href="/unix-converter-api"
            className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50 hover:bg-white/90 transition-all duration-200 group"
          >
            <Code className="w-6 h-6 text-brand-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-semibold text-brand-secondary-900">API Access</div>
            <div className="text-xs text-brand-secondary-600">For developers</div>
          </Link>
          <a
            href="#programming-examples"
            className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50 hover:bg-white/90 transition-all duration-200 group"
          >
            <Zap className="w-6 h-6 text-brand-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-semibold text-brand-secondary-900">Code Examples</div>
            <div className="text-xs text-brand-secondary-600">Multiple languages</div>
          </a>
        </div>
      </div>
    </section>
  );
}
