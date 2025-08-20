"use client";

import { useState } from "react";
import { X, Clock, Layers, Globe, Code, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureBannerProps {
  variant?: 'converter' | 'batch' | 'cities' | 'api' | 'default';
  onDismiss?: () => void;
  dismissible?: boolean;
}

const bannerContent = {
  converter: {
    icon: Clock,
    title: "🚀 New Enhanced Converter",
    description: "Try our improved timestamp converter with real-time validation and multiple output formats",
    cta: "Try Enhanced Converter",
    href: "/#converter",
    bgColor: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  batch: {
    icon: Layers,
    title: "⚡ Batch Processing Available",
    description: "Convert multiple timestamps at once - perfect for data processing and bulk operations",
    cta: "Start Batch Converting",
    href: "/#batch-converter",
    bgColor: "bg-gradient-to-r from-green-500 to-green-600"
  },
  cities: {
    icon: Globe,
    title: "🌍 City-Specific Converters",
    description: "Get localized timestamp conversions for major European cities with timezone support",
    cta: "Explore Cities",
    href: "/cities",
    bgColor: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  api: {
    icon: Code,
    title: "🔧 Developer API Available",
    description: "Integrate timestamp conversion into your applications with our RESTful API",
    cta: "View API Docs",
    href: "/unix-converter-api",
    bgColor: "bg-gradient-to-r from-orange-500 to-orange-600"
  },
  default: {
    icon: Clock,
    title: "✨ Complete Timestamp Solution",
    description: "From simple conversions to batch processing and API access - we've got you covered",
    cta: "Explore All Features",
    href: "/#converter",
    bgColor: "bg-gradient-to-r from-brand-primary-500 to-brand-primary-600"
  }
};

export function FeatureBanner({ 
  variant = 'default', 
  onDismiss,
  dismissible = true 
}: FeatureBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const content = bannerContent[variant];
  const Icon = content.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`${content.bgColor} text-white py-3 px-4 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-semibold text-sm sm:text-base">
                  {content.title}
                </span>
                <span className="text-xs sm:text-sm opacity-90 line-clamp-1">
                  {content.description}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={content.href}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              {content.cta}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
            
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title="Dismiss"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
