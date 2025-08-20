"use client";

import { Clock, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-secondary-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-primary-600 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Unix Timestamp Converter</span>
            </div>
            <p className="text-brand-secondary-400 mb-4 max-w-md">
              The most reliable and user-friendly Unix timestamp converter tool.
              Convert timestamps to dates and vice versa with support for multiple
              timezones and formats.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@unix-timestamp-converter.com"
                className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors">
                  Timestamp Converter
                </a>
              </li>
              <li>
                <a href="/cities" className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors">
                  European Cities
                </a>
              </li>
              <li>
                <a href="#examples" className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#faq" className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Unix_time"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                >
                  About Unix Time
                </a>
              </li>
              <li>
                <a
                  href="https://www.epochconverter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                >
                  Epoch Converter
                </a>
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                >
                  JavaScript Date
                </a>
              </li>
              <li>
                <a
                  href="https://www.iso.org/iso-8601-date-and-time-format.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary-400 hover:text-brand-primary-400 transition-colors"
                >
                  ISO 8601 Format
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-brand-secondary-400 text-sm">
            © {currentYear} Unix Timestamp Converter. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-brand-secondary-400 hover:text-brand-primary-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-brand-secondary-400 hover:text-brand-primary-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="text-brand-secondary-400 hover:text-brand-primary-400 text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
