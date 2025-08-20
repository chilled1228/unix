import { BookOpen, Code, Clock, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Guide to Unix Timestamps for Developers - Unix Converter",
  description: "Comprehensive guide to Unix timestamps covering concepts, programming examples, best practices, and common pitfalls. Perfect for developers and system administrators.",
  keywords: [
    "unix timestamp guide",
    "unix time tutorial",
    "epoch time guide",
    "timestamp programming guide",
    "unix time best practices"
  ],
  alternates: {
    canonical: "/guide/",
  },
  openGraph: {
    title: "Complete Guide to Unix Timestamps for Developers",
    description: "Comprehensive guide to Unix timestamps covering concepts, programming examples, best practices, and common pitfalls.",
    url: "https://unix-timestamp-converter.com/guide/",
  },
};

export default function GuidePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-primary-600 p-4 rounded-full shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary-900 mb-6">
            Complete Guide to Unix Timestamps for Developers
          </h1>
          <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
            Master Unix timestamps with this comprehensive guide covering concepts, 
            programming examples, best practices, and common pitfalls.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8">Table of Contents</h2>
          <div className="bg-brand-secondary-50 rounded-xl p-8 border border-brand-secondary-200">
            <nav className="grid md:grid-cols-2 gap-4">
              <a href="#what-is-unix-timestamp" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                <Clock className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-secondary-900 hover:text-brand-primary-600">1. What is Unix Timestamp?</span>
              </a>
              <a href="#programming-examples" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                <Code className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-secondary-900 hover:text-brand-primary-600">2. Programming Examples</span>
              </a>
              <a href="#best-practices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                <BookOpen className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-secondary-900 hover:text-brand-primary-600">3. Best Practices</span>
              </a>
              <a href="#common-pitfalls" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                <AlertTriangle className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-secondary-900 hover:text-brand-primary-600">4. Common Pitfalls</span>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* What is Unix Timestamp */}
      <section id="what-is-unix-timestamp" className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 flex items-center gap-3">
            <Clock className="w-8 h-8 text-brand-primary-600" />
            What is Unix Timestamp?
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Definition and Origin</h3>
              <p className="text-brand-secondary-700 mb-4 leading-relaxed">
                Unix timestamp, also known as Unix time, POSIX time, or Epoch time, is a system for describing 
                a point in time. It is defined as the number of seconds that have elapsed since the Unix Epoch, 
                which is 00:00:00 UTC on 1 January 1970, minus leap seconds.
              </p>
              <p className="text-brand-secondary-700 leading-relaxed">
                This system was chosen because January 1, 1970, was close to the time when Unix was being developed, 
                and it provided a convenient reference point for computer systems to track time consistently across 
                different platforms and timezones.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Key Characteristics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Advantages</h4>
                  <ul className="space-y-2 text-brand-secondary-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Platform independent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Timezone agnostic (always UTC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Easy to sort and compare</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Compact storage (single integer)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Limitations</h4>
                  <ul className="space-y-2 text-brand-secondary-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Not human-readable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Year 2038 problem (32-bit systems)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>No leap second handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Limited precision (seconds)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programming Examples */}
      <section id="programming-examples" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 flex items-center gap-3">
            <Code className="w-8 h-8 text-brand-primary-600" />
            Programming Examples
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-brand-secondary-50 rounded-xl p-6 border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">JavaScript</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-brand-secondary-800 mb-2">Get current Unix timestamp</h4>
                  <pre className="bg-brand-secondary-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    <code>{`const now = Math.floor(Date.now() / 1000);
console.log(now); // 1640995200`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-brand-secondary-800 mb-2">Convert to Date object</h4>
                  <pre className="bg-brand-secondary-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    <code>{`const timestamp = 1640995200;
const date = new Date(timestamp * 1000);
console.log(date.toISOString());`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-brand-secondary-50 rounded-xl p-6 border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Python</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-brand-secondary-800 mb-2">Get current Unix timestamp</h4>
                  <pre className="bg-brand-secondary-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    <code>{`import time
now = int(time.time())
print(now)  # 1640995200`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-brand-secondary-800 mb-2">Convert to datetime</h4>
                  <pre className="bg-brand-secondary-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    <code>{`from datetime import datetime
timestamp = 1640995200
dt = datetime.fromtimestamp(timestamp)
print(dt.isoformat())`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-primary-600" />
            Best Practices
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">Storage and Database Design</h3>
              <ul className="space-y-3 text-brand-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DO</span>
                  <span>Store timestamps as integers in UTC timezone</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DO</span>
                  <span>Use 64-bit integers to avoid Year 2038 problem</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DO</span>
                  <span>Index timestamp columns for efficient queries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DON'T</span>
                  <span>Store local time as Unix timestamp without timezone info</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-lg font-semibold text-brand-secondary-900 mb-4">API Design</h3>
              <ul className="space-y-3 text-brand-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DO</span>
                  <span>Accept both seconds and milliseconds formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DO</span>
                  <span>Provide clear documentation about timestamp format</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DO</span>
                  <span>Validate timestamp ranges in your application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold mt-0.5">DON'T</span>
                  <span>Assume all clients use the same timestamp precision</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Pitfalls */}
      <section id="common-pitfalls" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-brand-primary-600" />
            Common Pitfalls and Solutions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Year 2038 Problem</h3>
              <p className="text-red-800 mb-4">
                32-bit signed integers can only represent timestamps up to January 19, 2038, 03:14:07 UTC.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Solution:</h4>
                <p className="text-red-800 text-sm">Use 64-bit integers or upgrade to systems that support larger timestamp values.</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Milliseconds vs Seconds Confusion</h3>
              <p className="text-yellow-800 mb-4">
                Different systems use different precisions - some use seconds, others milliseconds.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Solution:</h4>
                <p className="text-yellow-800 text-sm">Always validate timestamp length: 10 digits = seconds, 13 digits = milliseconds.</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Timezone Confusion</h3>
              <p className="text-blue-800 mb-4">
                Unix timestamps are always in UTC, but display formatting requires timezone conversion.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Solution:</h4>
                <p className="text-blue-800 text-sm">Store in UTC, convert to local timezone only for display purposes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 text-center">
            Try Our Unix Timestamp Tools
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="/" 
              className="bg-white p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Unix Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Convert Unix timestamps to dates and vice versa.</p>
            </a>
            <a 
              href="/timestamp-converter/" 
              className="bg-white p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Timestamp Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Universal timestamp format converter.</p>
            </a>
            <a 
              href="/unix-converter-api/" 
              className="bg-white p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">API Documentation</h3>
              <p className="text-brand-secondary-600 text-sm">Programmatic access for developers.</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
