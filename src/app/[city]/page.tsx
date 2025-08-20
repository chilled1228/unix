import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug, getAllCitySlugs, CityData } from '@/data/cities';
import { CityHero } from '@/components/CityHero';
import { CityTimestampConverter } from '@/components/CityTimestampConverter';
import { CityFeatures } from '@/components/CityFeatures';
import { CityExamples } from '@/components/CityExamples';
import { CityFAQ } from '@/components/CityFAQ';

import { Breadcrumbs } from '@/components/Breadcrumbs';

interface CityPageProps {
  params: {
    city: string;
  };
}

export async function generateStaticParams() {
  const citySlugs = getAllCitySlugs();
  return citySlugs.map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const cityData = getCityBySlug(resolvedParams.city);
  
  if (!cityData) {
    return {
      title: 'City Not Found',
      description: 'The requested city page could not be found.',
    };
  }

  const title = `Unix Timestamp Converter - ${cityData.name} | ${cityData.timezone} Time Zone Tool`;
  const description = `Convert Unix timestamps to ${cityData.name} local time (${cityData.utcOffset}). ${cityData.description} Free online tool for ${cityData.name}, ${cityData.country}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `Unix Timestamp Converter - ${cityData.name}`,
    "description": description,
    "url": `https://unix-timestamp-converter.com/${cityData.slug}`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "areaServed": {
      "@type": "City",
      "name": cityData.name,
      "addressCountry": cityData.country,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": cityData.coordinates.lat,
        "longitude": cityData.coordinates.lng
      }
    },
    "featureList": [
      `${cityData.name} timestamp conversion`,
      `${cityData.timezone} timezone support`,
      "Real-time conversion",
      "Copy to clipboard functionality",
      "Mobile-friendly interface",
      `${cityData.name} business hours examples`
    ]
  };

  return {
    title,
    description,
    keywords: [
      `unix timestamp converter ${cityData.name.toLowerCase()}`,
      `epoch time converter ${cityData.name.toLowerCase()}`,
      `${cityData.name.toLowerCase()} time converter`,
      `${cityData.timezone.toLowerCase()} converter`,
      ...cityData.keywords
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
      canonical: `/${cityData.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://unix-timestamp-converter.com/${cityData.slug}`,
      siteName: "Unix Timestamp Converter",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `/og-${cityData.slug}.png`,
          width: 1200,
          height: 630,
          alt: `Unix Timestamp Converter for ${cityData.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og-${cityData.slug}.png`],
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
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const cityData = getCityBySlug(resolvedParams.city);

  if (!cityData) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: cityData.name, href: `/${cityData.slug}` }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://unix-timestamp-converter.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": cityData.name,
                "item": `https://unix-timestamp-converter.com/${cityData.slug}`
              }
            ]
          })
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />
      <CityHero cityData={cityData} />
      <CityTimestampConverter cityData={cityData} />
      <CityFeatures cityData={cityData} />
      <CityExamples cityData={cityData} />
      <CityFAQ cityData={cityData} />
    </>
  );
}
