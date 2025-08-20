'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Clock, Globe, MapPin, Menu, X } from 'lucide-react'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const closeDropdowns = () => {
    setActiveDropdown(null)
  }

  const popularCities = [
    { name: 'London', slug: 'london', timezone: 'GMT/BST' },
    { name: 'Paris', slug: 'paris', timezone: 'CET/CEST' },
    { name: 'Berlin', slug: 'berlin', timezone: 'CET/CEST' },
    { name: 'Madrid', slug: 'madrid', timezone: 'CET/CEST' },
    { name: 'Rome', slug: 'rome', timezone: 'CET/CEST' },
    { name: 'Amsterdam', slug: 'amsterdam', timezone: 'CET/CEST' },
  ]

  const features = [
    { name: 'Main Converter', href: '/#converter', icon: Clock, description: 'Real-time Unix timestamp conversion' },
    { name: 'Batch Converter', href: '/#batch-converter', icon: Clock, description: 'Convert multiple timestamps at once' },
    { name: 'Unix to Date', href: '/unix-time-to-date', icon: Clock, description: 'Specialized Unix to date conversion' },
    { name: 'Epoch Converter', href: '/epoch-converter', icon: Clock, description: 'Advanced epoch time conversion' },
    { name: 'Universal Converter', href: '/timestamp-converter', icon: Globe, description: 'Multiple format support' },
    { name: 'Developer API', href: '/unix-converter-api', icon: MapPin, description: 'Programmatic access' },
  ]

  return (
    <nav className="bg-white border-b border-brand-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-brand-primary-600 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-secondary-900">Unix Converter</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('features')}
                className="flex items-center space-x-1 text-brand-secondary-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-brand-secondary-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-brand-secondary-100">
                    <h3 className="text-sm font-semibold text-brand-secondary-900">Conversion Tools</h3>
                  </div>
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      className="flex items-start space-x-3 px-4 py-3 text-sm text-brand-secondary-700 hover:bg-brand-secondary-50 hover:text-brand-primary-600 transition-colors"
                      onClick={closeDropdowns}
                    >
                      <feature.icon className="w-5 h-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-xs text-brand-secondary-500 mt-0.5">{feature.description}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="px-4 py-3 border-t border-brand-secondary-100">
                    <Link
                      href="/#converter"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-primary-600 text-white text-sm font-medium rounded-lg hover:bg-brand-primary-700 transition-colors"
                      onClick={closeDropdowns}
                    >
                      Start Converting Now
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cities Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('cities')}
                className="flex items-center space-x-1 text-brand-secondary-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Cities</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'cities' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'cities' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-brand-secondary-200 py-4 z-50">
                  <div className="px-4 pb-3 border-b border-brand-secondary-100">
                    <h3 className="text-sm font-semibold text-brand-secondary-900 mb-2">Popular Cities</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {popularCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="flex flex-col space-y-1 px-3 py-2 text-sm text-brand-secondary-700 hover:bg-brand-secondary-50 hover:text-brand-primary-600 rounded-md transition-colors"
                        onClick={closeDropdowns}
                      >
                        <span className="font-medium">{city.name}</span>
                        <span className="text-xs text-brand-secondary-500">{city.timezone}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pt-3 border-t border-brand-secondary-100">
                    <Link
                      href="/cities"
                      className="text-sm text-brand-primary-600 hover:text-brand-primary-700 font-medium"
                      onClick={closeDropdowns}
                    >
                      View all cities →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link
              href="/blog"
              className="text-brand-secondary-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/cities"
              className="text-brand-secondary-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              All Cities
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="bg-brand-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary-700 transition-colors"
            >
              Convert Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-secondary-700 hover:text-brand-primary-600 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-brand-secondary-50 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-secondary-200 py-4">
            <div className="space-y-4">
              {/* Features */}
              <div>
                <div className="text-sm font-semibold text-brand-secondary-900 px-3 py-2">Conversion Tools</div>
                {features.slice(0, 4).map((feature) => (
                  <Link
                    key={feature.name}
                    href={feature.href}
                    className="flex items-start space-x-3 px-6 py-3 text-sm text-brand-secondary-700 hover:bg-brand-secondary-50 hover:text-brand-primary-600 min-h-[44px] touch-spacing"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <feature.icon className="w-4 h-4 text-brand-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-brand-secondary-500">{feature.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Blog */}
              <div>
                <Link
                  href="/blog"
                  className="block px-6 py-3 text-sm text-brand-secondary-700 hover:bg-brand-secondary-50 hover:text-brand-primary-600 min-h-[44px] touch-spacing font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>

              {/* Cities */}
              <div>
                <div className="text-sm font-semibold text-brand-secondary-900 px-3 py-2">Popular Cities</div>
                {popularCities.slice(0, 4).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="block px-6 py-3 text-sm text-brand-secondary-700 hover:bg-brand-secondary-50 hover:text-brand-primary-600 min-h-[44px] touch-spacing"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {city.name} ({city.timezone})
                  </Link>
                ))}
                <Link
                  href="/cities"
                  className="block px-6 py-3 text-sm text-brand-primary-600 font-medium min-h-[44px] touch-spacing"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View all cities →
                </Link>
              </div>

              {/* CTA */}
              <div className="px-3 pt-4 border-t border-brand-secondary-200">
                <Link
                  href="/"
                  className="block w-full bg-brand-primary-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Convert Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdowns}
        />
      )}
    </nav>
  )
}

export default Navigation
