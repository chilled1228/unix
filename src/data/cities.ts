export interface CityData {
  slug: string;
  name: string;
  country: string;
  timezone: string;
  utcOffset: string;
  population: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  businessHours: {
    start: string;
    end: string;
  };
  localTimeFormat: string;
  currency: string;
  language: string;
  keywords: string[];
  description: string;
  examples: {
    businessStart: number;
    lunchTime: number;
    businessEnd: number;
    midnight: number;
  };
}

export const europeanCities: CityData[] = [
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    utcOffset: 'UTC+0/+1',
    population: '9.5 million',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    businessHours: { start: '09:00', end: '17:30' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'GBP (£)',
    language: 'English',
    keywords: ['london timestamp', 'uk time converter', 'british time', 'gmt converter'],
    description: 'Convert Unix timestamps to London time (GMT/BST). Perfect for UK businesses, financial markets, and London-based operations.',
    examples: {
      businessStart: 1735635600, // 9:00 AM London time
      lunchTime: 1735646400,    // 12:00 PM London time
      businessEnd: 1735666200,  // 5:30 PM London time
      midnight: 1735689600      // 12:00 AM London time
    }
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    utcOffset: 'UTC+1/+2',
    population: '11 million',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    businessHours: { start: '09:00', end: '18:00' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'French',
    keywords: ['paris timestamp', 'france time converter', 'cet converter', 'french time'],
    description: 'Convert Unix timestamps to Paris time (CET/CEST). Ideal for French businesses, European operations, and Paris-based activities.',
    examples: {
      businessStart: 1735632000, // 9:00 AM Paris time
      lunchTime: 1735642800,    // 12:00 PM Paris time
      businessEnd: 1735664400,  // 6:00 PM Paris time
      midnight: 1735686000      // 12:00 AM Paris time
    }
  },
  {
    slug: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    utcOffset: 'UTC+1/+2',
    population: '3.7 million',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    businessHours: { start: '08:30', end: '17:00' },
    localTimeFormat: 'dd.MM.yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'German',
    keywords: ['berlin timestamp', 'germany time converter', 'german time', 'cet berlin'],
    description: 'Convert Unix timestamps to Berlin time (CET/CEST). Essential for German businesses, European tech companies, and Berlin operations.',
    examples: {
      businessStart: 1735630200, // 8:30 AM Berlin time
      lunchTime: 1735642800,    // 12:00 PM Berlin time
      businessEnd: 1735660800,  // 5:00 PM Berlin time
      midnight: 1735686000      // 12:00 AM Berlin time
    }
  },
  {
    slug: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    utcOffset: 'UTC+1/+2',
    population: '6.7 million',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    businessHours: { start: '09:00', end: '18:00' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'Spanish',
    keywords: ['madrid timestamp', 'spain time converter', 'spanish time', 'cet madrid'],
    description: 'Convert Unix timestamps to Madrid time (CET/CEST). Perfect for Spanish businesses, Iberian operations, and Madrid-based activities.',
    examples: {
      businessStart: 1735632000, // 9:00 AM Madrid time
      lunchTime: 1735642800,    // 12:00 PM Madrid time
      businessEnd: 1735664400,  // 6:00 PM Madrid time
      midnight: 1735686000      // 12:00 AM Madrid time
    }
  },
  {
    slug: 'rome',
    name: 'Rome',
    country: 'Italy',
    timezone: 'Europe/Rome',
    utcOffset: 'UTC+1/+2',
    population: '2.9 million',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    businessHours: { start: '09:00', end: '18:00' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'Italian',
    keywords: ['rome timestamp', 'italy time converter', 'italian time', 'cet rome'],
    description: 'Convert Unix timestamps to Rome time (CET/CEST). Ideal for Italian businesses, Mediterranean operations, and Rome-based activities.',
    examples: {
      businessStart: 1735632000, // 9:00 AM Rome time
      lunchTime: 1735642800,    // 12:00 PM Rome time
      businessEnd: 1735664400,  // 6:00 PM Rome time
      midnight: 1735686000      // 12:00 AM Rome time
    }
  },
  {
    slug: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    utcOffset: 'UTC+1/+2',
    population: '1.2 million',
    coordinates: { lat: 52.3676, lng: 4.9041 },
    businessHours: { start: '09:00', end: '17:30' },
    localTimeFormat: 'dd-MM-yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'Dutch',
    keywords: ['amsterdam timestamp', 'netherlands time converter', 'dutch time', 'cet amsterdam'],
    description: 'Convert Unix timestamps to Amsterdam time (CET/CEST). Perfect for Dutch businesses, European logistics, and Amsterdam operations.',
    examples: {
      businessStart: 1735632000, // 9:00 AM Amsterdam time
      lunchTime: 1735642800,    // 12:00 PM Amsterdam time
      businessEnd: 1735666200,  // 5:30 PM Amsterdam time
      midnight: 1735686000      // 12:00 AM Amsterdam time
    }
  },
  {
    slug: 'brussels',
    name: 'Brussels',
    country: 'Belgium',
    timezone: 'Europe/Brussels',
    utcOffset: 'UTC+1/+2',
    population: '1.2 million',
    coordinates: { lat: 50.8503, lng: 4.3517 },
    businessHours: { start: '09:00', end: '17:30' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'French/Dutch',
    keywords: ['brussels timestamp', 'belgium time converter', 'eu time', 'cet brussels'],
    description: 'Convert Unix timestamps to Brussels time (CET/CEST). Essential for EU institutions, Belgian businesses, and European operations.',
    examples: {
      businessStart: 1735632000, // 9:00 AM Brussels time
      lunchTime: 1735642800,    // 12:00 PM Brussels time
      businessEnd: 1735666200,  // 5:30 PM Brussels time
      midnight: 1735686000      // 12:00 AM Brussels time
    }
  },
  {
    slug: 'vienna',
    name: 'Vienna',
    country: 'Austria',
    timezone: 'Europe/Vienna',
    utcOffset: 'UTC+1/+2',
    population: '1.9 million',
    coordinates: { lat: 48.2082, lng: 16.3738 },
    businessHours: { start: '08:30', end: '17:00' },
    localTimeFormat: 'dd.MM.yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'German',
    keywords: ['vienna timestamp', 'austria time converter', 'austrian time', 'cet vienna'],
    description: 'Convert Unix timestamps to Vienna time (CET/CEST). Perfect for Austrian businesses, Central European operations, and Vienna activities.',
    examples: {
      businessStart: 1735630200, // 8:30 AM Vienna time
      lunchTime: 1735642800,    // 12:00 PM Vienna time
      businessEnd: 1735660800,  // 5:00 PM Vienna time
      midnight: 1735686000      // 12:00 AM Vienna time
    }
  },
  {
    slug: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    timezone: 'Europe/Zurich',
    utcOffset: 'UTC+1/+2',
    population: '1.4 million',
    coordinates: { lat: 47.3769, lng: 8.5417 },
    businessHours: { start: '08:00', end: '17:30' },
    localTimeFormat: 'dd.MM.yyyy HH:mm',
    currency: 'CHF',
    language: 'German',
    keywords: ['zurich timestamp', 'switzerland time converter', 'swiss time', 'cet zurich'],
    description: 'Convert Unix timestamps to Zurich time (CET/CEST). Ideal for Swiss banking, financial services, and Zurich-based operations.',
    examples: {
      businessStart: 1735628400, // 8:00 AM Zurich time
      lunchTime: 1735642800,    // 12:00 PM Zurich time
      businessEnd: 1735666200,  // 5:30 PM Zurich time
      midnight: 1735686000      // 12:00 AM Zurich time
    }
  },
  {
    slug: 'stockholm',
    name: 'Stockholm',
    country: 'Sweden',
    timezone: 'Europe/Stockholm',
    utcOffset: 'UTC+1/+2',
    population: '2.4 million',
    coordinates: { lat: 59.3293, lng: 18.0686 },
    businessHours: { start: '08:30', end: '17:00' },
    localTimeFormat: 'yyyy-MM-dd HH:mm',
    currency: 'SEK',
    language: 'Swedish',
    keywords: ['stockholm timestamp', 'sweden time converter', 'swedish time', 'cet stockholm'],
    description: 'Convert Unix timestamps to Stockholm time (CET/CEST). Perfect for Swedish businesses, Nordic operations, and Stockholm activities.',
    examples: {
      businessStart: 1735630200, // 8:30 AM Stockholm time
      lunchTime: 1735642800,    // 12:00 PM Stockholm time
      businessEnd: 1735660800,  // 5:00 PM Stockholm time
      midnight: 1735686000      // 12:00 AM Stockholm time
    }
  },
  {
    slug: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    timezone: 'Europe/Copenhagen',
    utcOffset: 'UTC+1/+2',
    population: '2.1 million',
    coordinates: { lat: 55.6761, lng: 12.5683 },
    businessHours: { start: '08:30', end: '16:30' },
    localTimeFormat: 'dd-MM-yyyy HH:mm',
    currency: 'DKK',
    language: 'Danish',
    keywords: ['copenhagen timestamp', 'denmark time converter', 'danish time', 'cet copenhagen'],
    description: 'Convert Unix timestamps to Copenhagen time (CET/CEST). Ideal for Danish businesses, Scandinavian operations, and Copenhagen activities.',
    examples: {
      businessStart: 1735630200, // 8:30 AM Copenhagen time
      lunchTime: 1735642800,    // 12:00 PM Copenhagen time
      businessEnd: 1735657200,  // 4:30 PM Copenhagen time
      midnight: 1735686000      // 12:00 AM Copenhagen time
    }
  },
  {
    slug: 'oslo',
    name: 'Oslo',
    country: 'Norway',
    timezone: 'Europe/Oslo',
    utcOffset: 'UTC+1/+2',
    population: '1.7 million',
    coordinates: { lat: 59.9139, lng: 10.7522 },
    businessHours: { start: '08:30', end: '16:00' },
    localTimeFormat: 'dd.MM.yyyy HH:mm',
    currency: 'NOK',
    language: 'Norwegian',
    keywords: ['oslo timestamp', 'norway time converter', 'norwegian time', 'cet oslo'],
    description: 'Convert Unix timestamps to Oslo time (CET/CEST). Perfect for Norwegian businesses, Nordic operations, and Oslo-based activities.',
    examples: {
      businessStart: 1735630200, // 8:30 AM Oslo time
      lunchTime: 1735642800,    // 12:00 PM Oslo time
      businessEnd: 1735657200,  // 4:00 PM Oslo time
      midnight: 1735686000      // 12:00 AM Oslo time
    }
  },
  {
    slug: 'helsinki',
    name: 'Helsinki',
    country: 'Finland',
    timezone: 'Europe/Helsinki',
    utcOffset: 'UTC+2/+3',
    population: '1.5 million',
    coordinates: { lat: 60.1699, lng: 24.9384 },
    businessHours: { start: '08:30', end: '16:30' },
    localTimeFormat: 'dd.MM.yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'Finnish',
    keywords: ['helsinki timestamp', 'finland time converter', 'finnish time', 'eet helsinki'],
    description: 'Convert Unix timestamps to Helsinki time (EET/EEST). Ideal for Finnish businesses, Baltic operations, and Helsinki-based activities.',
    examples: {
      businessStart: 1735626600, // 8:30 AM Helsinki time
      lunchTime: 1735639200,    // 12:00 PM Helsinki time
      businessEnd: 1735653600,  // 4:30 PM Helsinki time
      midnight: 1735682400      // 12:00 AM Helsinki time
    }
  },
  {
    slug: 'dublin',
    name: 'Dublin',
    country: 'Ireland',
    timezone: 'Europe/Dublin',
    utcOffset: 'UTC+0/+1',
    population: '1.4 million',
    coordinates: { lat: 53.3498, lng: -6.2603 },
    businessHours: { start: '09:00', end: '17:30' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'English',
    keywords: ['dublin timestamp', 'ireland time converter', 'irish time', 'gmt dublin'],
    description: 'Convert Unix timestamps to Dublin time (GMT/IST). Perfect for Irish businesses, European tech hubs, and Dublin operations.',
    examples: {
      businessStart: 1735635600, // 9:00 AM Dublin time
      lunchTime: 1735646400,    // 12:00 PM Dublin time
      businessEnd: 1735666200,  // 5:30 PM Dublin time
      midnight: 1735689600      // 12:00 AM Dublin time
    }
  },
  {
    slug: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    timezone: 'Europe/Lisbon',
    utcOffset: 'UTC+0/+1',
    population: '2.9 million',
    coordinates: { lat: 38.7223, lng: -9.1393 },
    businessHours: { start: '09:00', end: '18:00' },
    localTimeFormat: 'dd/MM/yyyy HH:mm',
    currency: 'EUR (€)',
    language: 'Portuguese',
    keywords: ['lisbon timestamp', 'portugal time converter', 'portuguese time', 'wet lisbon'],
    description: 'Convert Unix timestamps to Lisbon time (WET/WEST). Ideal for Portuguese businesses, Atlantic operations, and Lisbon-based activities.',
    examples: {
      businessStart: 1735635600, // 9:00 AM Lisbon time
      lunchTime: 1735646400,    // 12:00 PM Lisbon time
      businessEnd: 1735668000,  // 6:00 PM Lisbon time
      midnight: 1735689600      // 12:00 AM Lisbon time
    }
  }
];

export function getCityBySlug(slug: string): CityData | undefined {
  return europeanCities.find(city => city.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return europeanCities.map(city => city.slug);
}
