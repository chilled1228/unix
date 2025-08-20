import { TimestampConverter } from "@/components/TimestampConverter";
import { BatchConverter } from "@/components/BatchConverter";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timestamp Converter - Universal Time Format Converter Online",
  description: "Universal timestamp converter supporting Unix, ISO 8601, and human-readable formats. Convert between different time formats instantly with timezone support.",
  keywords: [
    "timestamp converter",
    "time converter",
    "date converter",
    "unix timestamp converter",
    "iso 8601 converter",
    "time format converter"
  ],
  alternates: {
    canonical: "/timestamp-converter/",
  },
  openGraph: {
    title: "Timestamp Converter - Universal Time Format Converter Online",
    description: "Universal timestamp converter supporting Unix, ISO 8601, and human-readable formats. Convert between different time formats instantly.",
    url: "https://unix-timestamp-converter.com/timestamp-converter/",
  },
};

export default function TimestampConverterPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary-900 mb-6">
            Universal Timestamp Converter
          </h1>
          <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
            Convert between different timestamp formats including Unix time, ISO 8601, 
            and human-readable dates. Support for all major timezones.
          </p>
        </div>
      </section>
      
      <TimestampConverter />
      <BatchConverter />
      
      {/* Supported Formats */}
      <section className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-12 text-center">
            Supported Timestamp Formats
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Unix Timestamp</h3>
              <div className="space-y-3">
                <div className="bg-brand-secondary-50 p-3 rounded font-mono text-sm">
                  1640995200
                </div>
                <p className="text-brand-secondary-600 text-sm">
                  Seconds since January 1, 1970 UTC. Most common format in programming.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Unix Milliseconds</h3>
              <div className="space-y-3">
                <div className="bg-brand-secondary-50 p-3 rounded font-mono text-sm">
                  1640995200000
                </div>
                <p className="text-brand-secondary-600 text-sm">
                  Milliseconds since epoch. Used by JavaScript Date.now() and many APIs.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">ISO 8601</h3>
              <div className="space-y-3">
                <div className="bg-brand-secondary-50 p-3 rounded font-mono text-sm">
                  2022-01-01T00:00:00Z
                </div>
                <p className="text-brand-secondary-600 text-sm">
                  International standard for date and time representation.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">RFC 2822</h3>
              <div className="space-y-3">
                <div className="bg-brand-secondary-50 p-3 rounded font-mono text-sm">
                  Sat, 01 Jan 2022 00:00:00 GMT
                </div>
                <p className="text-brand-secondary-600 text-sm">
                  Email and HTTP header timestamp format.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Human Readable</h3>
              <div className="space-y-3">
                <div className="bg-brand-secondary-50 p-3 rounded font-mono text-sm">
                  January 1, 2022 12:00:00 AM
                </div>
                <p className="text-brand-secondary-600 text-sm">
                  User-friendly format with customizable date and time patterns.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Custom Formats</h3>
              <div className="space-y-3">
                <div className="bg-brand-secondary-50 p-3 rounded font-mono text-sm">
                  01/01/2022 00:00:00
                </div>
                <p className="text-brand-secondary-600 text-sm">
                  Define your own date format patterns for specific requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Features />
      
      {/* Internal Links */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 text-center">
            Specialized Converters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="/unix-time-to-date/" 
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Unix to Date</h3>
              <p className="text-brand-secondary-600 text-sm">Specialized Unix timestamp to date conversion.</p>
            </a>
            <a 
              href="/epoch-converter/" 
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Epoch Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Convert epoch time with advanced options.</p>
            </a>
            <a 
              href="/unix-converter-api/" 
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">API Access</h3>
              <p className="text-brand-secondary-600 text-sm">Programmatic timestamp conversion API.</p>
            </a>
          </div>
        </div>
      </section>
      
      <FeatureCTA
        currentPage="universal"
        title="Specialized Conversion Tools"
        description="Need more specific functionality? Check out our specialized converters and tools."
      />

      <FAQ />
    </>
  );
}
