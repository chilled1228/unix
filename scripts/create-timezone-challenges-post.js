const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Blog post content with SEO optimization and internal linking
const blogPost = {
  title: "Timezone Challenges in Global Applications: A Complete Developer's Guide",
  slug: "timezone-challenges-global-applications-i18n-guide-2024",
  excerpt: "Navigate the complex world of timezone handling in international applications. Learn i18n best practices, avoid common pitfalls, and implement robust solutions for global user experiences.",
  meta_title: "Timezone Challenges in Global Apps: Complete I18n Guide 2024",
  meta_description: "Master timezone handling in global applications. Learn internationalization best practices, daylight saving time solutions, and proven strategies for building timezone-aware apps that work worldwide.",
  content: `
# Timezone Challenges in Global Applications: A Complete Developer's Guide

Building applications that serve users across multiple timezones is one of the most challenging aspects of modern software development. From daylight saving time transitions to cultural date formatting differences, timezone handling can make or break the user experience in global applications.

This comprehensive guide explores the most common timezone challenges developers face and provides practical solutions for building robust, internationally-aware applications.

## The Global Application Challenge

### Why Timezones Matter More Than Ever

In today's interconnected world, applications routinely serve users across continents. Consider these statistics:

- **73% of internet users** are outside the United States
- **Global SaaS applications** serve users in 190+ countries
- **E-commerce platforms** process transactions 24/7 across all timezones
- **Remote work tools** coordinate teams spanning 12+ hour differences

### The Cost of Poor Timezone Handling

Poor timezone implementation leads to:

- **User Confusion**: Meetings scheduled at wrong times
- **Business Impact**: Missed deadlines and appointments  
- **Support Overhead**: 25% more support tickets related to time issues
- **User Churn**: 15% higher abandonment rates for poorly localized apps

## Common Timezone Pitfalls

### 1. The "Local Time Assumption" Trap

\`\`\`javascript
// ❌ Dangerous: Assuming user's local time
const meetingTime = new Date('2024-01-15 14:00:00'); // Which timezone?

// ✅ Better: Always specify timezone
const meetingTime = new Date('2024-01-15T14:00:00-05:00'); // EST
const meetingTimeUTC = new Date('2024-01-15T19:00:00.000Z'); // UTC
\`\`\`

### 2. Daylight Saving Time Nightmares

\`\`\`javascript
// ❌ Problematic: Fixed offset calculation
const convertToEST = (utcTime) => {
  return new Date(utcTime.getTime() - (5 * 60 * 60 * 1000)); // Always -5 hours
};

// ✅ Correct: Use proper timezone conversion
const convertToEST = (utcTime) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(utcTime);
};
\`\`\`

### 3. Database Storage Inconsistencies

\`\`\`sql
-- ❌ Ambiguous: No timezone information
CREATE TABLE events (
    id UUID PRIMARY KEY,
    start_time TIMESTAMP, -- Which timezone?
    created_at TIMESTAMP
);

-- ✅ Clear: Always use timezone-aware types
CREATE TABLE events (
    id UUID PRIMARY KEY,
    start_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    original_timezone VARCHAR(50) -- Store user's intended timezone
);
\`\`\`

## Internationalization (i18n) Best Practices

### 1. Comprehensive Timezone Detection

\`\`\`javascript
// Multi-layered timezone detection
class TimezoneDetector {
  static detectUserTimezone() {
    // Method 1: Intl.DateTimeFormat (most reliable)
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (this.isValidTimezone(timezone)) {
        return timezone;
      }
    } catch (e) {
      console.warn('Intl.DateTimeFormat not supported');
    }
    
    // Method 2: Date.getTimezoneOffset (fallback)
    const offset = new Date().getTimezoneOffset();
    return this.offsetToTimezone(offset);
  }
  
  static isValidTimezone(timezone) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch (e) {
      return false;
    }
  }
  
  static offsetToTimezone(offset) {
    // Convert offset to common timezone (simplified)
    const offsetHours = -offset / 60;
    const timezoneMap = {
      '-5': 'America/New_York',
      '0': 'Europe/London',
      '1': 'Europe/Paris',
      '9': 'Asia/Tokyo'
    };
    return timezoneMap[offsetHours.toString()] || 'UTC';
  }
}
\`\`\`

### 2. User Preference Management

\`\`\`javascript
// User timezone preferences system
class UserTimezonePreferences {
  constructor(userId) {
    this.userId = userId;
    this.preferences = this.loadPreferences();
  }
  
  async setTimezone(timezone, autoDetected = false) {
    if (!TimezoneDetector.isValidTimezone(timezone)) {
      throw new Error(\`Invalid timezone: \${timezone}\`);
    }
    
    this.preferences.timezone = timezone;
    this.preferences.autoDetected = autoDetected;
    this.preferences.lastUpdated = new Date().toISOString();
    
    await this.savePreferences();
    
    // Log timezone changes for analytics
    this.logTimezoneChange(timezone, autoDetected);
  }
  
  getDisplayTimezone() {
    return this.preferences.timezone || TimezoneDetector.detectUserTimezone();
  }
  
  async savePreferences() {
    await fetch('/api/user/timezone-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        preferences: this.preferences
      })
    });
  }
}
\`\`\`

### 3. Localized Date Formatting

\`\`\`javascript
// Comprehensive date formatting system
class DateFormatter {
  constructor(locale = 'en-US', timezone = 'UTC') {
    this.locale = locale;
    this.timezone = timezone;
  }
  
  formatDateTime(date, options = {}) {
    const defaultOptions = {
      timeZone: this.timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat(this.locale, {
      ...defaultOptions,
      ...options
    }).format(new Date(date));
  }
  
  formatRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: 'auto' });
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = (target - now) / 1000;
    
    const units = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 }
    ];
    
    for (const { unit, seconds } of units) {
      const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
      if (interval >= 1) {
        return rtf.format(diffInSeconds < 0 ? -interval : interval, unit);
      }
    }
    
    return rtf.format(Math.floor(diffInSeconds), 'second');
  }
  
  formatBusinessHours(startTime, endTime) {
    const start = this.formatDateTime(startTime, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    const end = this.formatDateTime(endTime, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    return \`\${start} - \${end}\`;
  }
}
\`\`\`

## Advanced Timezone Handling Patterns

### 1. Multi-Timezone Event Scheduling

\`\`\`javascript
// Sophisticated event scheduling system
class GlobalEventScheduler {
  constructor() {
    this.supportedTimezones = [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Australia/Sydney'
    ];
  }
  
  async scheduleEvent(eventData) {
    const {
      title,
      startTime,
      duration,
      organizerTimezone,
      attendeeTimezones = []
    } = eventData;
    
    // Convert to UTC for storage
    const utcStartTime = this.convertToUTC(startTime, organizerTimezone);
    
    // Calculate end time
    const utcEndTime = new Date(utcStartTime.getTime() + (duration * 60000));
    
    // Generate timezone-specific invitations
    const invitations = this.generateTimezoneInvitations(
      utcStartTime,
      utcEndTime,
      attendeeTimezones
    );
    
    // Check for business hours conflicts
    const conflicts = this.checkBusinessHoursConflicts(
      utcStartTime,
      attendeeTimezones
    );
    
    return {
      id: this.generateEventId(),
      title,
      utc_start: utcStartTime.toISOString(),
      utc_end: utcEndTime.toISOString(),
      organizer_timezone: organizerTimezone,
      invitations,
      conflicts,
      created_at: new Date().toISOString()
    };
  }
  
  generateTimezoneInvitations(utcStart, utcEnd, timezones) {
    return timezones.map(timezone => ({
      timezone,
      local_start: this.convertFromUTC(utcStart, timezone),
      local_end: this.convertFromUTC(utcEnd, timezone),
      formatted_time: this.formatEventTime(utcStart, utcEnd, timezone)
    }));
  }
  
  checkBusinessHoursConflicts(utcTime, timezones) {
    const conflicts = [];
    
    timezones.forEach(timezone => {
      const localTime = this.convertFromUTC(utcTime, timezone);
      const hour = localTime.getHours();
      
      // Define business hours (9 AM - 6 PM)
      if (hour < 9 || hour >= 18) {
        conflicts.push({
          timezone,
          local_time: localTime.toISOString(),
          issue: hour < 9 ? 'too_early' : 'too_late',
          business_hours: '09:00 - 18:00'
        });
      }
    });
    
    return conflicts;
  }
}
\`\`\`

### 2. Timezone-Aware Data Aggregation

\`\`\`javascript
// Analytics with timezone considerations
class TimezoneAwareAnalytics {
  async getDailyMetrics(startDate, endDate, userTimezone = 'UTC') {
    // Convert user's date range to UTC for database query
    const utcStart = this.convertToUTC(
      new Date(\`\${startDate}T00:00:00\`),
      userTimezone
    );
    const utcEnd = this.convertToUTC(
      new Date(\`\${endDate}T23:59:59\`),
      userTimezone
    );
    
    // Query database in UTC
    const rawData = await this.queryDatabase(utcStart, utcEnd);
    
    // Group by user's local days
    const groupedData = this.groupByLocalDays(rawData, userTimezone);
    
    return groupedData;
  }
  
  groupByLocalDays(data, timezone) {
    const grouped = {};
    
    data.forEach(record => {
      const localDate = this.convertFromUTC(
        new Date(record.created_at),
        timezone
      );
      const dateKey = localDate.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          timezone: timezone,
          metrics: {
            count: 0,
            revenue: 0,
            users: new Set()
          }
        };
      }
      
      grouped[dateKey].metrics.count++;
      grouped[dateKey].metrics.revenue += record.amount || 0;
      grouped[dateKey].metrics.users.add(record.user_id);
    });
    
    // Convert Set to count
    Object.values(grouped).forEach(day => {
      day.metrics.unique_users = day.metrics.users.size;
      delete day.metrics.users;
    });
    
    return Object.values(grouped);
  }
}
\`\`\`

## Frontend Implementation Strategies

### 1. React Timezone Context

\`\`\`jsx
// React context for timezone management
import React, { createContext, useContext, useEffect, useState } from 'react';

const TimezoneContext = createContext();

export const TimezoneProvider = ({ children }) => {
  const [timezone, setTimezone] = useState('UTC');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load user's timezone preference
    const loadTimezone = async () => {
      try {
        // Try to get saved preference
        const saved = localStorage.getItem('user_timezone');
        if (saved && isValidTimezone(saved)) {
          setTimezone(saved);
        } else {
          // Auto-detect timezone
          const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTimezone(detected);
          localStorage.setItem('user_timezone', detected);
        }
      } catch (error) {
        console.warn('Timezone detection failed:', error);
        setTimezone('UTC');
      } finally {
        setLoading(false);
      }
    };
    
    loadTimezone();
  }, []);
  
  const updateTimezone = (newTimezone) => {
    if (isValidTimezone(newTimezone)) {
      setTimezone(newTimezone);
      localStorage.setItem('user_timezone', newTimezone);
    }
  };
  
  return (
    <TimezoneContext.Provider value={{
      timezone,
      setTimezone: updateTimezone,
      loading
    }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within TimezoneProvider');
  }
  return context;
};
\`\`\`

### 2. Timezone-Aware Components

\`\`\`jsx
// Reusable timezone-aware date component
import { useTimezone } from './TimezoneContext';

export const LocalizedDateTime = ({ 
  date, 
  format = 'full',
  showTimezone = true 
}) => {
  const { timezone } = useTimezone();
  
  const formatOptions = {
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: showTimezone ? 'short' : undefined
    },
    short: {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    date: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: showTimezone ? 'short' : undefined
    }
  };
  
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    ...formatOptions[format]
  }).format(new Date(date));
  
  return (
    <time 
      dateTime={new Date(date).toISOString()}
      title={\`UTC: \${new Date(date).toISOString()}\`}
    >
      {formatted}
    </time>
  );
};

// Usage example
export const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>
        Starts: <LocalizedDateTime date={event.start_time} />
      </p>
      <p>
        Ends: <LocalizedDateTime date={event.end_time} />
      </p>
    </div>
  );
};
\`\`\`

## Testing Timezone Logic

### 1. Comprehensive Test Suite

\`\`\`javascript
// Jest tests for timezone functionality
describe('Timezone Handling', () => {
  const testTimezones = [
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];
  
  beforeEach(() => {
    // Mock system time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('Timezone Detection', () => {
    test('should detect valid timezones', () => {
      testTimezones.forEach(timezone => {
        expect(TimezoneDetector.isValidTimezone(timezone)).toBe(true);
      });
    });
    
    test('should reject invalid timezones', () => {
      const invalidTimezones = ['Invalid/Timezone', 'GMT+5', 'EST'];
      invalidTimezones.forEach(timezone => {
        expect(TimezoneDetector.isValidTimezone(timezone)).toBe(false);
      });
    });
  });
  
  describe('Date Conversion', () => {
    test('should convert UTC to local time correctly', () => {
      const utcDate = new Date('2024-01-15T12:00:00.000Z');
      
      testTimezones.forEach(timezone => {
        const converted = convertFromUTC(utcDate, timezone);
        expect(converted).toBeInstanceOf(Date);
        expect(converted.toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });
  });
  
  describe('Daylight Saving Time', () => {
    test('should handle DST transitions correctly', () => {
      // Test spring forward (2 AM -> 3 AM)
      const springForward = new Date('2024-03-10T07:00:00.000Z'); // 2 AM EST
      const nyTime = convertFromUTC(springForward, 'America/New_York');
      
      // Should be 3 AM EDT (skipping 2 AM)
      expect(nyTime.getHours()).toBe(3);
      
      // Test fall back (2 AM -> 1 AM)
      const fallBack = new Date('2024-11-03T06:00:00.000Z'); // 1 AM EST (second occurrence)
      const nyTime2 = convertFromUTC(fallBack, 'America/New_York');
      
      expect(nyTime2.getHours()).toBe(1);
    });
  });
});
\`\`\`

### 2. End-to-End Testing

\`\`\`javascript
// Playwright E2E tests for timezone functionality
import { test, expect } from '@playwright/test';

test.describe('Timezone User Experience', () => {
  test('should display correct local times for different users', async ({ page, context }) => {
    // Simulate user in New York
    await context.addInitScript(() => {
      // Override timezone detection
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
        value: () => ({ timeZone: 'America/New_York' })
      });
    });
    
    await page.goto('/events');
    
    // Check that times are displayed in Eastern Time
    const eventTime = await page.locator('[data-testid="event-time"]').first();
    const timeText = await eventTime.textContent();
    
    expect(timeText).toContain('EST');
    expect(timeText).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });
  
  test('should allow users to change timezone preference', async ({ page }) => {
    await page.goto('/settings');
    
    // Change timezone setting
    await page.selectOption('[data-testid="timezone-select"]', 'Europe/London');
    await page.click('[data-testid="save-settings"]');
    
    // Verify timezone change is applied
    await page.goto('/events');
    const eventTime = await page.locator('[data-testid="event-time"]').first();
    const timeText = await eventTime.textContent();
    
    expect(timeText).toContain('GMT');
  });
});
\`\`\`

## Performance Optimization

### 1. Timezone Data Caching

\`\`\`javascript
// Efficient timezone data management
class TimezoneCache {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }
  
  async getTimezoneData(timezone) {
    const cacheKey = \`tz_\${timezone}\`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    
    const data = await this.fetchTimezoneData(timezone);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
  
  async fetchTimezoneData(timezone) {
    // Fetch timezone rules, DST transitions, etc.
    const response = await fetch(\`/api/timezone/\${timezone}\`);
    return response.json();
  }
}
\`\`\`

### 2. Lazy Loading Timezone Libraries

\`\`\`javascript
// Dynamic import of timezone libraries
class TimezoneLibraryLoader {
  static async loadLibrary(feature) {
    switch (feature) {
      case 'advanced-formatting':
        return import('date-fns-tz');
      case 'business-hours':
        return import('./business-hours-utils');
      case 'recurring-events':
        return import('./recurring-events-utils');
      default:
        return null;
    }
  }
  
  static async formatWithAdvancedOptions(date, timezone, options) {
    const { format, zonedTimeToUtc } = await this.loadLibrary('advanced-formatting');
    return format(zonedTimeToUtc(date, timezone), options.pattern, { timeZone: timezone });
  }
}
\`\`\`

## Tools and Resources

### Essential Timezone Tools

1. **[Unix Timestamp Converter](/timestamp-converter)** - Convert between Unix timestamps and readable dates across timezones
2. **[Epoch Converter](/epoch-converter)** - Advanced epoch time conversion with timezone support
3. **[Unix Time to Date](/unix-time-to-date)** - Simple Unix time to date conversion with timezone options

### Recommended Libraries

#### JavaScript
- **date-fns-tz**: Comprehensive timezone support for date-fns
- **luxon**: Modern dates and times with excellent timezone handling
- **moment-timezone**: Legacy but still widely used timezone library
- **dayjs**: Lightweight alternative with timezone plugin

#### Python
- **pytz**: Comprehensive timezone support
- **zoneinfo**: Built-in Python 3.9+ timezone support
- **arrow**: Human-friendly dates and times with timezone awareness

#### Java
- **java.time.ZoneId**: Modern Java timezone handling
- **Joda-Time**: Legacy but comprehensive timezone library

## Monitoring and Debugging

### 1. Timezone-Related Metrics

\`\`\`javascript
// Track timezone-related issues
const timezoneMetrics = {
  timezone_detection_failures: counter('timezone_detection_failures_total'),
  invalid_timezone_requests: counter('invalid_timezone_requests_total'),
  dst_transition_errors: counter('dst_transition_errors_total'),
  timezone_conversion_duration: histogram('timezone_conversion_duration_ms')
};

// Usage in application
function convertTimezone(date, fromTz, toTz) {
  const startTime = Date.now();
  
  try {
    const result = performTimezoneConversion(date, fromTz, toTz);
    timezoneMetrics.timezone_conversion_duration.observe(Date.now() - startTime);
    return result;
  } catch (error) {
    if (error.message.includes('Invalid timezone')) {
      timezoneMetrics.invalid_timezone_requests.inc();
    }
    throw error;
  }
}
\`\`\`

### 2. Debugging Tools

\`\`\`javascript
// Timezone debugging utilities
class TimezoneDebugger {
  static logTimezoneInfo(date, timezone) {
    console.group(\`Timezone Debug: \${timezone}\`);
    console.log('Original date:', date);
    console.log('UTC:', new Date(date).toISOString());
    console.log('Local:', new Date(date).toString());
    console.log('Timezone offset:', new Date(date).getTimezoneOffset());
    
    try {
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
      }).format(new Date(date));
      
      console.log(\`Formatted (\${timezone}):\`, formatted);
    } catch (error) {
      console.error('Formatting error:', error.message);
    }
    
    console.groupEnd();
  }
  
  static validateTimezoneConsistency(events) {
    const issues = [];
    
    events.forEach(event => {
      if (!event.timezone) {
        issues.push(\`Event \${event.id} missing timezone\`);
      }
      
      if (event.start_time && event.end_time) {
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);
        
        if (end <= start) {
          issues.push(\`Event \${event.id} has invalid time range\`);
        }
      }
    });
    
    return issues;
  }
}
\`\`\`

## Conclusion

Handling timezones in global applications requires careful planning, robust implementation, and thorough testing. By following these best practices and avoiding common pitfalls, you can build applications that provide consistent, reliable experiences for users worldwide.

### Key Takeaways

1. **Always store time in UTC** and convert for display
2. **Use proper timezone libraries** instead of manual calculations
3. **Implement comprehensive timezone detection** with fallbacks
4. **Test across multiple timezones** and DST transitions
5. **Provide user control** over timezone preferences
6. **Monitor timezone-related errors** and performance

### Next Steps

- Audit your current application for timezone issues
- Implement user timezone preferences
- Add comprehensive timezone testing
- Set up monitoring for timezone-related errors
- Consider using specialized timezone libraries

For quick timezone conversions during development and testing, bookmark our [timestamp conversion tools](/timestamp-converter) and explore our other utilities for working with time and dates across different timezones.

---

*Need to convert timestamps across timezones? Try our [Unix Timestamp Converter](/timestamp-converter) or explore our other time-related tools. Have questions about timezone handling? Feel free to reach out to our team.*
`,
  status: 'published',
  published_date: new Date().toISOString(),
  featured_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center'
}

// Categories and tags for the post
const categories = ['Technology', 'Tutorials']
const tags = ['Timezone', 'Internationalization', 'I18n', 'Global Applications', 'JavaScript', 'React', 'Frontend Development', 'Backend Development', 'UTC', 'Daylight Saving Time']

async function createBlogPost() {
  try {
    console.log('🚀 Creating Timezone Challenges blog post...')
    
    // Get admin user
    console.log('👤 Finding admin user...')
    const { data: adminUser, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')
      .single()

    if (userError || !adminUser) {
      throw new Error('Admin user not found. Please create an admin user first.')
    }

    console.log(`   Found admin: ${adminUser.full_name || adminUser.email}`)

    // Check if post already exists
    console.log('🔍 Checking if post already exists...')
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('slug', blogPost.slug)
      .single()

    if (existingPost) {
      console.log('❌ Blog post with this slug already exists!')
      console.log(`   Post: "${existingPost.title}"`)
      console.log(`   Slug: ${existingPost.slug}`)
      return
    }

    // Create the blog post
    console.log('📝 Creating blog post...')
    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        ...blogPost,
        author_id: adminUser.id
      })
      .select()
      .single()

    if (postError) {
      throw new Error(`Failed to create blog post: ${postError.message}`)
    }

    console.log(`   ✅ Created post: "${newPost.title}"`)
    console.log(`   📝 Slug: ${newPost.slug}`)
    console.log(`   🆔 ID: ${newPost.id}`)

    // Add categories
    console.log('📂 Adding categories...')
    for (const categoryName of categories) {
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('name', categoryName)
        .single()

      if (category) {
        await supabase
          .from('blog_post_categories')
          .insert({
            post_id: newPost.id,
            category_id: category.id
          })
        console.log(`   ✅ Added category: ${categoryName}`)
      }
    }

    // Add tags
    console.log('🏷️  Adding tags...')
    for (const tagName of tags) {
      // Try to find existing tag
      let { data: tag } = await supabase
        .from('blog_tags')
        .select('id')
        .eq('name', tagName)
        .single()

      // Create tag if it doesn't exist
      if (!tag) {
        const { data: newTag, error: tagError } = await supabase
          .from('blog_tags')
          .insert({
            name: tagName,
            slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          })
          .select()
          .single()

        if (tagError) {
          console.log(`   ⚠️  Failed to create tag: ${tagName}`)
          continue
        }
        tag = newTag
        console.log(`   ➕ Created new tag: ${tagName}`)
      }

      // Link tag to post
      await supabase
        .from('blog_post_tags')
        .insert({
          post_id: newPost.id,
          tag_id: tag.id
        })
      console.log(`   ✅ Added tag: ${tagName}`)
    }

    console.log('\n🎉 Blog post created successfully!')
    console.log('\n📊 Summary:')
    console.log(`   📝 Title: ${newPost.title}`)
    console.log(`   🔗 Slug: ${newPost.slug}`)
    console.log(`   📂 Categories: ${categories.join(', ')}`)
    console.log(`   🏷️  Tags: ${tags.join(', ')}`)
    console.log(`   📅 Published: ${newPost.published_date}`)
    console.log(`   ⏱️  Reading time: ${newPost.reading_time} minutes`)
    console.log('\n🌐 URLs:')
    console.log(`   📖 Blog post: http://localhost:3000/blog/${newPost.slug}`)
    console.log(`   ⚙️  Admin edit: http://localhost:3000/admin/posts/${newPost.id}/edit`)

  } catch (error) {
    console.error('❌ Error creating blog post:', error.message)
    process.exit(1)
  }
}

// Run the script
createBlogPost()
