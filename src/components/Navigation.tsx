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
    { name: 'Unix to Date Converter', href: '/', icon: Clock },
    { name: 'Timezone Support', href: '/', icon: Globe },
    { name: 'City-Specific Pages', href: '/cities', icon: MapPin },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-brand-primary-600 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Unix Converter</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('features')}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-primary-600 transition-colors"
                      onClick={closeDropdowns}
                    >
                      <feature.icon className="w-5 h-5 text-brand-primary-600" />
                      <span>{feature.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Cities Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('cities')}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Cities</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'cities' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'cities' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Popular Cities</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {popularCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="flex flex-col space-y-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-primary-600 rounded-md transition-colors"
                        onClick={closeDropdowns}
                      >
                        <span className="font-medium">{city.name}</span>
                        <span className="text-xs text-gray-500">{city.timezone}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pt-3 border-t border-gray-100">
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
              href="/cities"
              className="text-gray-700 hover:text-brand-primary-600 px-3 py-2 text-sm font-medium transition-colors"
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
              className="text-gray-700 hover:text-brand-primary-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Features */}
              <div>
                <div className="text-sm font-semibold text-gray-900 px-3 py-2">Features</div>
                {features.map((feature) => (
                  <Link
                    key={feature.name}
                    href={feature.href}
                    className="flex items-center space-x-3 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <feature.icon className="w-4 h-4 text-brand-primary-600" />
                    <span>{feature.name}</span>
                  </Link>
                ))}
              </div>

              {/* Cities */}
              <div>
                <div className="text-sm font-semibold text-gray-900 px-3 py-2">Popular Cities</div>
                {popularCities.slice(0, 4).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {city.name} ({city.timezone})
                  </Link>
                ))}
                <Link
                  href="/cities"
                  className="block px-6 py-2 text-sm text-brand-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View all cities →
                </Link>
              </div>

              {/* CTA */}
              <div className="px-3 pt-4 border-t border-gray-200">
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
