"use client";

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-brand-secondary-50 border-b border-brand-secondary-200 py-3 px-4">
      <div className="max-w-6xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-brand-secondary-400 mx-2" />
              )}
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="flex items-center text-brand-secondary-600 hover:text-brand-primary-600 transition-colors"
                >
                  <Home className="w-4 h-4 mr-1" />
                  {item.label}
                </Link>
              ) : index === items.length - 1 ? (
                <span className="text-brand-secondary-900 font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-brand-secondary-600 hover:text-brand-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
