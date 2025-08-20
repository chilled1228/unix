import { TimestampConverter } from "@/components/TimestampConverter";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { UnixTimestampGuide } from "@/components/UnixTimestampGuide";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Epoch Converter - Convert Epoch Time to Date Online Free",
  description: "Free online epoch time converter. Convert epoch timestamps to human-readable dates instantly. Supports seconds, milliseconds, and multiple timezones. No signup required!",
  keywords: [
    "epoch converter",
    "epoch time converter",
    "unix epoch converter",
    "epoch to date",
    "epoch timestamp converter",
    "posix time converter"
  ],
  alternates: {
    canonical: "/epoch-converter/",
  },
  openGraph: {
    title: "Epoch Converter - Convert Epoch Time to Date Online Free",
    description: "Free online epoch time converter. Convert epoch timestamps to human-readable dates instantly. Supports seconds, milliseconds, and multiple timezones.",
    url: "https://unix-timestamp-converter.com/epoch-converter/",
  },
};

export default function EpochConverterPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary-900 mb-6">
            Epoch Converter - Convert Epoch Time to Date
          </h1>
          <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
            Convert epoch timestamps to human-readable dates and vice versa.
            Fast, accurate, and completely free online epoch converter tool.
          </p>
          <div className="bg-brand-primary-100 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-brand-secondary-700">
              <strong>What is Epoch Time?</strong> Epoch time (also known as Unix time) is the number of seconds
              since January 1, 1970, 00:00:00 UTC. It&apos;s the standard way computers track time across different systems.
            </p>
          </div>
        </div>
      </section>
      
      <TimestampConverter />
      <UnixTimestampGuide />
      <Features />
      
      {/* Internal Links Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 text-center">
            Related Tools and Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/unix-time-to-date/"
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors block"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Unix Time to Date Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Convert Unix timestamps to human-readable dates with timezone support.</p>
            </Link>
            <Link
              href="/timestamp-converter/"
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors block"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Timestamp Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Universal timestamp converter supporting multiple formats and timezones.</p>
            </Link>
            <Link
              href="/unix-converter-api/"
              className="bg-brand-secondary-50 p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors block"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Unix Converter API</h3>
              <p className="text-brand-secondary-600 text-sm">Programmatic access to Unix timestamp conversion for developers.</p>
            </Link>
          </div>
        </div>
      </section>

      <FeatureCTA
        currentPage="epoch"
        title="More Conversion Options"
        description="Discover additional timestamp conversion tools and features for your specific needs."
      />

      <FAQ />
    </>
  );
}
