"use client";

import { Code, Info, Clock, Globe } from "lucide-react";

export function UnixTimestampGuide() {
  return (
    <section className="py-16 px-4 bg-brand-secondary-50">
      <div className="max-w-4xl mx-auto">
        {/* What is Unix Timestamp Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-6 flex items-center gap-3">
            <Info className="w-8 h-8 text-brand-primary-600" />
            What is Unix Timestamp?
          </h2>
          
          <div className="bg-white rounded-xl p-8 shadow-lg border border-brand-secondary-200">
            <p className="text-lg text-brand-secondary-700 mb-6 leading-relaxed">
              Unix timestamp, also known as Unix time, POSIX time, or Epoch time, represents the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC (Coordinated Universal Time). This system provides a standardized way to track time across different computer systems and programming languages.
            </p>
            
            <p className="text-lg text-brand-secondary-700 mb-8 leading-relaxed">
              The Unix epoch (January 1, 1970) serves as the reference point because it coincides with the release of Unix version 1. All Unix timestamps are calculated as the difference between the desired date/time and this epoch moment.
            </p>

            <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Unix Epoch Explained</h3>
            <div className="bg-brand-primary-50 p-6 rounded-lg border border-brand-primary-200 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-brand-primary-600" />
                <span className="font-semibold text-brand-secondary-900">Unix Epoch Start:</span>
              </div>
              <p className="text-brand-secondary-700 font-mono text-lg">
                January 1, 1970, 00:00:00 UTC
              </p>
              <p className="text-sm text-brand-secondary-600 mt-2">
                This moment in time is represented as Unix timestamp: 0
              </p>
            </div>

            <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Unix Time vs UTC Time</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-brand-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-secondary-900 mb-2">Unix Time</h4>
                <ul className="text-brand-secondary-700 space-y-1 text-sm">
                  <li>• Seconds since epoch</li>
                  <li>• Integer representation</li>
                  <li>• Platform independent</li>
                  <li>• No timezone info</li>
                </ul>
              </div>
              <div className="bg-brand-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-secondary-900 mb-2">UTC Time</h4>
                <ul className="text-brand-secondary-700 space-y-1 text-sm">
                  <li>• Human-readable format</li>
                  <li>• Date and time components</li>
                  <li>• Timezone aware</li>
                  <li>• ISO 8601 standard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Unix Converter Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-6">
            How to Use Unix Converter
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Converting Timestamp to Date</h3>
              <ol className="space-y-3 text-brand-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Enter your Unix timestamp in the input field</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Select your preferred timezone from the dropdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Choose your desired date format</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                  <span>View the converted date and copy if needed</span>
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Converting Date to Timestamp</h3>
              <ol className="space-y-3 text-brand-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Enter your date in any common format</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Specify the timezone if different from UTC</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>The Unix timestamp will be calculated automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                  <span>Copy the result for use in your applications</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
            <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-primary-600" />
              Timezone Considerations
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-brand-primary-100 p-4 rounded-lg mb-3">
                  <Clock className="w-8 h-8 text-brand-primary-600 mx-auto" />
                </div>
                <h4 className="font-semibold text-brand-secondary-900 mb-2">UTC Standard</h4>
                <p className="text-sm text-brand-secondary-600">Unix timestamps are always in UTC, providing a universal reference point</p>
              </div>
              <div className="text-center">
                <div className="bg-brand-primary-100 p-4 rounded-lg mb-3">
                  <Globe className="w-8 h-8 text-brand-primary-600 mx-auto" />
                </div>
                <h4 className="font-semibold text-brand-secondary-900 mb-2">Local Display</h4>
                <p className="text-sm text-brand-secondary-600">Convert to local timezone for human-readable display</p>
              </div>
              <div className="text-center">
                <div className="bg-brand-primary-100 p-4 rounded-lg mb-3">
                  <Code className="w-8 h-8 text-brand-primary-600 mx-auto" />
                </div>
                <h4 className="font-semibold text-brand-secondary-900 mb-2">DST Handling</h4>
                <p className="text-sm text-brand-secondary-600">Daylight saving time is automatically handled in conversions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Time Formats Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-brand-secondary-900 mb-6">Supported Time Formats</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h4 className="text-lg font-semibold text-brand-secondary-900 mb-4">Input Formats</h4>
              <ul className="space-y-2 text-brand-secondary-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  Unix timestamp (seconds): 1640995200
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  Unix timestamp (milliseconds): 1640995200000
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  ISO 8601: 2022-01-01T00:00:00Z
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  Human readable: Jan 1, 2022 12:00 AM
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-secondary-200">
              <h4 className="text-lg font-semibold text-brand-secondary-900 mb-4">Output Formats</h4>
              <ul className="space-y-2 text-brand-secondary-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  US Format: 01/01/2022 12:00:00 AM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  UK Format: 01/01/2022 00:00:00
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  ISO Format: 2022-01-01 00:00:00
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary-600 rounded-full"></span>
                  Long Format: January 01, 2022 12:00:00 AM
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
