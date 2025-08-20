import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: {
    default: "Unix Timestamp Converter - Convert Unix Time to Human Date",
    template: "%s | Unix Timestamp Converter"
  },
  description: "Free online Unix timestamp converter tool. Convert Unix timestamps to human-readable dates and vice versa. Supports multiple timezones and date formats. Fast, accurate, and mobile-friendly.",
  keywords: [
    "unix timestamp converter",
    "epoch time converter",
    "unix time to date",
    "timestamp converter",
    "epoch converter",
    "unix time",
    "date converter",
    "timestamp to date",
    "unix timestamp",
    "epoch time"
  ],
  authors: [{ name: "Unix Timestamp Converter" }],
  creator: "Unix Timestamp Converter",
  publisher: "Unix Timestamp Converter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://unix-timestamp-converter.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Unix Timestamp Converter - Convert Unix Time to Human Date",
    description: "Free online Unix timestamp converter tool. Convert Unix timestamps to human-readable dates and vice versa. Supports multiple timezones and date formats.",
    url: "https://unix-timestamp-converter.com",
    siteName: "Unix Timestamp Converter",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Unix Timestamp Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter - Convert Unix Time to Human Date",
    description: "Free online Unix timestamp converter tool. Convert Unix timestamps to human-readable dates and vice versa.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Unix Timestamp Converter",
  "description": "Free online Unix timestamp converter tool. Convert Unix timestamps to human-readable dates and vice versa.",
  "url": "https://unix-timestamp-converter.com",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Unix timestamp to human date conversion",
    "Human date to Unix timestamp conversion",
    "Multiple timezone support",
    "Multiple date format options",
    "Real-time conversion",
    "Copy to clipboard functionality",
    "Mobile-friendly interface"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
