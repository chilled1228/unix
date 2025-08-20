import { TimestampConverter } from "@/components/TimestampConverter";
import { ProgrammingExamples } from "@/components/ProgrammingExamples";
import { FAQ } from "@/components/FAQ";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Time to Date Converter - Convert Unix Timestamps Online",
  description: "Convert Unix time to human-readable dates instantly. Free online converter supports seconds, milliseconds, and all major timezones. Fast and accurate conversions.",
  keywords: [
    "unix time to date",
    "unix timestamp to date",
    "convert unix time",
    "unix time converter",
    "timestamp to date converter"
  ],
  alternates: {
    canonical: "/unix-time-to-date/",
  },
  openGraph: {
    title: "Unix Time to Date Converter - Convert Unix Timestamps Online",
    description: "Convert Unix time to human-readable dates instantly. Free online converter supports seconds, milliseconds, and all major timezones.",
    url: "https://unix-timestamp-converter.com/unix-time-to-date/",
  },
};

export default function UnixTimeToDatePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary-900 mb-6">
            Unix Time to Date Converter
          </h1>
          <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
            Convert Unix timestamps to human-readable dates with precision and ease.
            Supports all timezones and date formats.
          </p>
        </div>
      </section>
      
      <TimestampConverter />
      
      {/* Educational Content */}
      <section className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8">
            Understanding Unix Time to Date Conversion
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">What is Unix Time?</h3>
              <p className="text-brand-secondary-700 mb-4">
                Unix time represents the number of seconds since January 1, 1970, 00:00:00 UTC. 
                This standardized time format is used across computer systems worldwide.
              </p>
              <ul className="space-y-2 text-brand-secondary-700">
                <li>• Platform independent</li>
                <li>• Always in UTC timezone</li>
                <li>• Integer representation</li>
                <li>• No leap seconds included</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Common Use Cases</h3>
              <ul className="space-y-3 text-brand-secondary-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Database timestamp storage and retrieval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>API response timestamp parsing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Log file analysis and debugging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Cross-timezone application development</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
            <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Conversion Examples</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-secondary-200">
                    <th className="text-left py-3 px-4 font-semibold text-brand-secondary-900">Unix Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold text-brand-secondary-900">Human-Readable Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-brand-secondary-900">Description</th>
                  </tr>
                </thead>
                <tbody className="text-brand-secondary-700">
                  <tr className="border-b border-brand-secondary-100">
                    <td className="py-3 px-4 font-mono">0</td>
                    <td className="py-3 px-4">January 1, 1970 00:00:00 UTC</td>
                    <td className="py-3 px-4">Unix Epoch start</td>
                  </tr>
                  <tr className="border-b border-brand-secondary-100">
                    <td className="py-3 px-4 font-mono">1640995200</td>
                    <td className="py-3 px-4">January 1, 2022 00:00:00 UTC</td>
                    <td className="py-3 px-4">New Year 2022</td>
                  </tr>
                  <tr className="border-b border-brand-secondary-100">
                    <td className="py-3 px-4 font-mono">2147483647</td>
                    <td className="py-3 px-4">January 19, 2038 03:14:07 UTC</td>
                    <td className="py-3 px-4">32-bit timestamp limit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      
      <ProgrammingExamples />
      
      {/* Internal Links */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 text-center">
            More Conversion Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="/epoch-converter/" 
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Epoch Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Convert epoch timestamps with advanced formatting options and timezone support.</p>
            </a>
            <a 
              href="/timestamp-converter/" 
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Universal Timestamp Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Convert between different timestamp formats including Unix, ISO 8601, and more.</p>
            </a>
          </div>
        </div>
      </section>
      
      <FeatureCTA
        currentPage="unix-to-date"
        title="More Timestamp Conversion Tools"
        description="Explore our complete suite of timestamp conversion tools designed for different use cases."
      />

      <FAQ />
    </>
  );
}
