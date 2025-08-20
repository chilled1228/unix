import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { FloatingCTA } from "@/components/FloatingCTA";
import { CacheBuster, CacheClearButton } from "@/components/CacheBuster";
import { MobileOptimizations } from "@/components/MobileOptimizations";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: {
    default: "Unix Timestamp Converter - Convert Epoch Time to Date Online Free",
    template: "%s | Unix Timestamp Converter"
  },
  description: "Convert Unix timestamps to human-readable dates instantly. Free online epoch converter supports seconds, milliseconds, and multiple timezones. No signup required - try now!",
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
    title: "Unix Timestamp Converter - Convert Epoch Time to Date Online Free",
    description: "Convert Unix timestamps to human-readable dates instantly. Free online epoch converter supports seconds, milliseconds, and multiple timezones. No signup required - try now!",
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
    title: "Unix Timestamp Converter - Convert Epoch Time to Date Online Free",
    description: "Convert Unix timestamps to human-readable dates instantly. Free online epoch converter supports seconds, milliseconds, and multiple timezones. No signup required - try now!",
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
  "description": "Convert Unix timestamps to human-readable dates and vice versa. Free online epoch converter supporting multiple formats and timezones.",
  "url": "https://unix-timestamp-converter.com",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Unix timestamp to date conversion",
    "Date to Unix timestamp conversion",
    "Multiple timezone support",
    "Millisecond precision",
    "Batch conversion",
    "API access",
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
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0284c7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Unix Converter" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* Cache busting meta tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Cache-busting comment: ${Date.now()} */
            .converter-tool {
              background: white;
              border-radius: 1rem;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              border: 1px solid var(--brand-secondary-200);
            }
            .primary-heading {
              font-size: 2.25rem;
              font-weight: 700;
              line-height: 1.2;
              margin-bottom: 1.5rem;
            }
            @media (min-width: 768px) {
              .primary-heading { font-size: 3.75rem; }
            }
          `
        }} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-brand-secondary-50 text-brand-secondary-900 dark:bg-brand-secondary-900 dark:text-brand-secondary-100`}>
        <AuthProvider>
          <ThemeProvider>
            <CacheBuster />
            <MobileOptimizations />
            <ServiceWorkerRegistration />
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navigation />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingCTA />
            <CacheClearButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
