"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  Layers, 
  Globe, 
  Code, 
  X, 
  Plus,
  ArrowUp
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    icon: Clock,
    label: "Convert Now",
    href: "#converter",
    color: "bg-brand-primary-500 hover:bg-brand-primary-600"
  },
  {
    icon: Layers,
    label: "Batch Convert",
    href: "#batch-converter",
    color: "bg-brand-success-500 hover:bg-brand-success-600"
  },
  {
    icon: Globe,
    label: "Cities",
    href: "/cities",
    color: "bg-brand-accent-500 hover:bg-brand-accent-600"
  },
  {
    icon: Code,
    label: "API",
    href: "/unix-converter-api",
    color: "bg-brand-secondary-600 hover:bg-brand-secondary-700"
  }
];

export function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActionClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Quick Actions Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 mb-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.label}
                  className="flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="hidden sm:block bg-white text-brand-secondary-900 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                  <Link
                    href={action.href}
                    onClick={handleActionClick}
                    className={`${action.color} text-white p-3 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center`}
                    title={action.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-brand-primary-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-brand-primary-700 transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isOpen ? 'rotate-45' : ''
          }`}
          title={isOpen ? "Close menu" : "Quick actions"}
          aria-label={isOpen ? "Close quick actions menu" : "Open quick actions menu"}
        >
          {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Plus className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 bg-brand-secondary-600 text-white p-3 rounded-full shadow-lg hover:bg-brand-secondary-700 transition-all duration-200 hover:scale-110 z-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
