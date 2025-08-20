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
  title: "Microservices Time Synchronization: Distributed Systems Timing Guide",
  slug: "microservices-time-synchronization-distributed-systems-2024",
  excerpt: "Master time synchronization in microservices architectures. Learn distributed systems timing, event ordering, consistency patterns, and advanced strategies for building reliable time-aware distributed systems.",
  meta_title: "Microservices Time Synchronization: Complete Distributed Systems Guide 2024",
  meta_description: "Learn microservices time synchronization and distributed systems timing. Master event ordering, consistency patterns, clock synchronization, and advanced strategies for time-aware architectures.",
  content: `
# Automated Testing for Time-Dependent Code: A Complete Testing Guide

Testing time-dependent functionality is one of the most challenging aspects of software testing. From scheduling systems to expiration logic, time-based features introduce complexity that can make tests flaky, unreliable, and difficult to maintain. This comprehensive guide provides practical strategies for testing temporal code effectively.

## The Challenge of Time-Dependent Testing

### Why Time Testing is Difficult

Time-dependent code presents unique challenges:

- **Non-deterministic behavior**: Tests may pass or fail based on when they run
- **Timezone complexity**: Different environments may have different timezone settings
- **Race conditions**: Timing-sensitive operations can create intermittent failures
- **Long-running tests**: Waiting for time-based events slows down test suites
- **Environment dependencies**: Tests may behave differently across systems

### Common Time-Related Bugs

- **Off-by-one errors** in date calculations
- **Timezone conversion mistakes** causing incorrect times
- **Daylight saving time issues** breaking scheduling logic
- **Leap year problems** in date arithmetic
- **Race conditions** in time-sensitive operations

## Time Mocking Fundamentals

### JavaScript Time Mocking

#### Using Jest Fake Timers

\`\`\`javascript
// Basic time mocking with Jest
describe('Time-dependent functionality', () => {
  beforeEach(() => {
    // Mock the system time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T10:30:00.000Z'));
  });

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  test('should create timestamp correctly', () => {
    const timestamp = Date.now();
    expect(timestamp).toBe(new Date('2024-01-15T10:30:00.000Z').getTime());
  });

  test('should handle setTimeout correctly', () => {
    const callback = jest.fn();
    
    setTimeout(callback, 1000);
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should handle setInterval correctly', () => {
    const callback = jest.fn();
    
    setInterval(callback, 1000);
    
    // Fast-forward through multiple intervals
    jest.advanceTimersByTime(3000);
    
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
\`\`\`

#### Advanced Time Mocking Patterns

\`\`\`javascript
// Custom time service for better testability
class TimeService {
  constructor(mockTime = null) {
    this.mockTime = mockTime;
  }

  now() {
    return this.mockTime || Date.now();
  }

  setMockTime(time) {
    this.mockTime = new Date(time).getTime();
  }

  clearMockTime() {
    this.mockTime = null;
  }

  addTime(milliseconds) {
    if (this.mockTime) {
      this.mockTime += milliseconds;
    }
  }
}

// Usage in application code
class EventScheduler {
  constructor(timeService = new TimeService()) {
    this.timeService = timeService;
  }

  scheduleEvent(event, delayMs) {
    const scheduledTime = this.timeService.now() + delayMs;
    
    return {
      ...event,
      scheduledAt: scheduledTime,
      isReady: () => this.timeService.now() >= scheduledTime
    };
  }
}

// Testing with custom time service
describe('EventScheduler', () => {
  let timeService;
  let scheduler;

  beforeEach(() => {
    timeService = new TimeService();
    timeService.setMockTime('2024-01-15T10:30:00.000Z');
    scheduler = new EventScheduler(timeService);
  });

  test('should schedule event correctly', () => {
    const event = { name: 'Test Event' };
    const scheduled = scheduler.scheduleEvent(event, 5000);

    expect(scheduled.scheduledAt).toBe(
      new Date('2024-01-15T10:30:05.000Z').getTime()
    );
    expect(scheduled.isReady()).toBe(false);

    // Advance time
    timeService.addTime(5000);
    expect(scheduled.isReady()).toBe(true);
  });
});
\`\`\`

### Python Time Mocking

#### Using unittest.mock

\`\`\`python
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
import time

class TimeService:
    @staticmethod
    def now():
        return datetime.now(timezone.utc)
    
    @staticmethod
    def timestamp():
        return time.time()

class EventProcessor:
    def __init__(self, time_service=None):
        self.time_service = time_service or TimeService()
    
    def process_event(self, event):
        current_time = self.time_service.now()
        return {
            'event': event,
            'processed_at': current_time.isoformat(),
            'timestamp': self.time_service.timestamp()
        }

class TestEventProcessor(unittest.TestCase):
    def setUp(self):
        self.mock_time = datetime(2024, 1, 15, 10, 30, 0, tzinfo=timezone.utc)
        self.mock_timestamp = 1705316200.0
    
    @patch('time.time')
    @patch('datetime.datetime')
    def test_process_event_with_mocked_time(self, mock_datetime, mock_time):
        # Setup mocks
        mock_datetime.now.return_value = self.mock_time
        mock_time.return_value = self.mock_timestamp
        
        processor = EventProcessor()
        result = processor.process_event({'name': 'test'})
        
        self.assertEqual(result['processed_at'], '2024-01-15T10:30:00+00:00')
        self.assertEqual(result['timestamp'], 1705316200.0)
    
    def test_process_event_with_injected_service(self):
        # Create mock time service
        mock_service = MagicMock()
        mock_service.now.return_value = self.mock_time
        mock_service.timestamp.return_value = self.mock_timestamp
        
        processor = EventProcessor(mock_service)
        result = processor.process_event({'name': 'test'})
        
        self.assertEqual(result['processed_at'], '2024-01-15T10:30:00+00:00')
        mock_service.now.assert_called_once()
        mock_service.timestamp.assert_called_once()

if __name__ == '__main__':
    unittest.main()
\`\`\`

#### Using freezegun for Python

\`\`\`python
from freezegun import freeze_time
import datetime
import time

class SubscriptionService:
    def is_expired(self, subscription):
        return datetime.datetime.now() > subscription['expires_at']
    
    def days_until_expiry(self, subscription):
        delta = subscription['expires_at'] - datetime.datetime.now()
        return delta.days

class TestSubscriptionService(unittest.TestCase):
    def setUp(self):
        self.service = SubscriptionService()
        self.subscription = {
            'id': 'sub_123',
            'expires_at': datetime.datetime(2024, 1, 20, 10, 30, 0)
        }
    
    @freeze_time("2024-01-15 10:30:00")
    def test_subscription_not_expired(self):
        self.assertFalse(self.service.is_expired(self.subscription))
        self.assertEqual(self.service.days_until_expiry(self.subscription), 5)
    
    @freeze_time("2024-01-25 10:30:00")
    def test_subscription_expired(self):
        self.assertTrue(self.service.is_expired(self.subscription))
        self.assertEqual(self.service.days_until_expiry(self.subscription), -5)
    
    def test_subscription_status_over_time(self):
        # Test progression over time
        test_dates = [
            ("2024-01-15 10:30:00", False, 5),
            ("2024-01-19 10:30:00", False, 1),
            ("2024-01-20 10:30:00", False, 0),
            ("2024-01-21 10:30:00", True, -1),
        ]
        
        for date_str, expected_expired, expected_days in test_dates:
            with freeze_time(date_str):
                self.assertEqual(
                    self.service.is_expired(self.subscription), 
                    expected_expired,
                    f"Failed for date {date_str}"
                )
                self.assertEqual(
                    self.service.days_until_expiry(self.subscription),
                    expected_days,
                    f"Failed for date {date_str}"
                )
\`\`\`

## Timezone Testing Strategies

### Testing Across Multiple Timezones

\`\`\`javascript
// Comprehensive timezone testing
describe('Timezone handling', () => {
  const timezones = [
    'UTC',
    'America/New_York',
    'Europe/London', 
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  timezones.forEach(timezone => {
    describe(\`in \${timezone}\`, () => {
      beforeEach(() => {
        // Mock timezone
        process.env.TZ = timezone;
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
      });

      afterEach(() => {
        delete process.env.TZ;
        jest.useRealTimers();
      });

      test('should format time correctly', () => {
        const formatter = new DateTimeFormatter(timezone);
        const result = formatter.format(new Date('2024-01-15T12:00:00.000Z'));
        
        // Verify timezone-specific formatting
        expect(result).toMatch(/\d{1,2}:\d{2}/);
        expect(result).toContain(getExpectedTimezoneAbbr(timezone));
      });

      test('should handle business hours correctly', () => {
        const businessHours = new BusinessHours(timezone);
        const testTime = new Date('2024-01-15T14:00:00.000Z');
        
        const isBusinessHour = businessHours.isBusinessHour(testTime);
        const expected = calculateExpectedBusinessHour(testTime, timezone);
        
        expect(isBusinessHour).toBe(expected);
      });
    });
  });
});

// Helper functions for timezone testing
function getExpectedTimezoneAbbr(timezone) {
  const abbrs = {
    'UTC': 'UTC',
    'America/New_York': 'EST',
    'Europe/London': 'GMT',
    'Asia/Tokyo': 'JST',
    'Australia/Sydney': 'AEDT'
  };
  return abbrs[timezone];
}

function calculateExpectedBusinessHour(time, timezone) {
  // Convert UTC time to local time and check if it's 9 AM - 5 PM
  const localTime = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false
  }).format(time);
  
  const hour = parseInt(localTime);
  return hour >= 9 && hour < 17;
}
\`\`\`

### Daylight Saving Time Testing

\`\`\`javascript
// Testing DST transitions
describe('Daylight Saving Time handling', () => {
  const dstTransitions = [
    {
      name: 'Spring Forward (US)',
      timezone: 'America/New_York',
      date: '2024-03-10T07:00:00.000Z', // 2 AM EST -> 3 AM EDT
      expectedHour: 3
    },
    {
      name: 'Fall Back (US)',
      timezone: 'America/New_York', 
      date: '2024-11-03T06:00:00.000Z', // 2 AM EDT -> 1 AM EST
      expectedHour: 1
    },
    {
      name: 'Spring Forward (EU)',
      timezone: 'Europe/London',
      date: '2024-03-31T01:00:00.000Z', // 1 AM GMT -> 2 AM BST
      expectedHour: 2
    }
  ];

  dstTransitions.forEach(({ name, timezone, date, expectedHour }) => {
    test(\`should handle \${name} correctly\`, () => {
      const converter = new TimezoneConverter();
      const localTime = converter.utcToLocal(new Date(date), timezone);
      
      expect(localTime.getHours()).toBe(expectedHour);
    });
  });

  test('should handle ambiguous times during fall back', () => {
    // During fall back, 1:30 AM occurs twice
    const ambiguousTime = '2024-11-03T01:30:00';
    const timezone = 'America/New_York';
    
    const converter = new TimezoneConverter();
    
    // Test both occurrences
    const firstOccurrence = converter.parseAmbiguousTime(
      ambiguousTime, 
      timezone, 
      { isDST: true }
    );
    const secondOccurrence = converter.parseAmbiguousTime(
      ambiguousTime, 
      timezone, 
      { isDST: false }
    );
    
    expect(secondOccurrence.getTime() - firstOccurrence.getTime())
      .toBe(60 * 60 * 1000); // 1 hour difference
  });
});
\`\`\`

## Testing Time-Based Business Logic

### Expiration and TTL Testing

\`\`\`javascript
// Testing expiration logic
class CacheService {
  constructor(timeService = new TimeService()) {
    this.cache = new Map();
    this.timeService = timeService;
  }

  set(key, value, ttlMs) {
    const expiresAt = this.timeService.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (this.timeService.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  cleanup() {
    const now = this.timeService.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

describe('CacheService expiration', () => {
  let timeService;
  let cache;

  beforeEach(() => {
    timeService = new TimeService();
    timeService.setMockTime('2024-01-15T10:30:00.000Z');
    cache = new CacheService(timeService);
  });

  test('should return value before expiration', () => {
    cache.set('key1', 'value1', 5000); // 5 second TTL
    
    // Advance time by 3 seconds
    timeService.addTime(3000);
    
    expect(cache.get('key1')).toBe('value1');
  });

  test('should return null after expiration', () => {
    cache.set('key1', 'value1', 5000);
    
    // Advance time past expiration
    timeService.addTime(6000);
    
    expect(cache.get('key1')).toBeNull();
  });

  test('should cleanup expired items', () => {
    cache.set('key1', 'value1', 5000);
    cache.set('key2', 'value2', 10000);
    
    // Advance time to expire first item
    timeService.addTime(6000);
    
    cache.cleanup();
    
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
  });
});
\`\`\`

### Scheduling and Recurring Events

\`\`\`javascript
// Testing recurring event logic
class RecurringEventScheduler {
  constructor(timeService = new TimeService()) {
    this.timeService = timeService;
  }

  getNextOccurrence(event) {
    const now = this.timeService.now();
    const startTime = new Date(event.startTime);
    
    switch (event.recurrence.type) {
      case 'daily':
        return this.getNextDaily(startTime, now, event.recurrence);
      case 'weekly':
        return this.getNextWeekly(startTime, now, event.recurrence);
      case 'monthly':
        return this.getNextMonthly(startTime, now, event.recurrence);
      default:
        throw new Error(\`Unsupported recurrence type: \${event.recurrence.type}\`);
    }
  }

  getNextDaily(startTime, now, recurrence) {
    const interval = recurrence.interval || 1;
    const dayMs = 24 * 60 * 60 * 1000;
    
    let nextTime = new Date(startTime);
    while (nextTime.getTime() <= now) {
      nextTime.setTime(nextTime.getTime() + (interval * dayMs));
    }
    
    return nextTime;
  }

  // ... other recurrence methods
}

describe('RecurringEventScheduler', () => {
  let timeService;
  let scheduler;

  beforeEach(() => {
    timeService = new TimeService();
    timeService.setMockTime('2024-01-15T10:30:00.000Z');
    scheduler = new RecurringEventScheduler(timeService);
  });

  test('should calculate next daily occurrence', () => {
    const event = {
      startTime: '2024-01-10T09:00:00.000Z',
      recurrence: { type: 'daily', interval: 1 }
    };

    const next = scheduler.getNextOccurrence(event);
    
    expect(next.toISOString()).toBe('2024-01-16T09:00:00.000Z');
  });

  test('should handle daily interval > 1', () => {
    const event = {
      startTime: '2024-01-10T09:00:00.000Z',
      recurrence: { type: 'daily', interval: 3 }
    };

    const next = scheduler.getNextOccurrence(event);
    
    expect(next.toISOString()).toBe('2024-01-16T09:00:00.000Z');
  });

  test('should calculate multiple future occurrences', () => {
    const event = {
      startTime: '2024-01-15T09:00:00.000Z',
      recurrence: { type: 'daily', interval: 1 }
    };

    const occurrences = [];
    for (let i = 0; i < 5; i++) {
      const next = scheduler.getNextOccurrence(event);
      occurrences.push(next.toISOString());
      
      // Advance time to after this occurrence
      timeService.setMockTime(next.getTime() + 1000);
    }

    expect(occurrences).toEqual([
      '2024-01-16T09:00:00.000Z',
      '2024-01-17T09:00:00.000Z',
      '2024-01-18T09:00:00.000Z',
      '2024-01-19T09:00:00.000Z',
      '2024-01-20T09:00:00.000Z'
    ]);
  });
});
\`\`\`

## CI/CD Integration for Time Testing

### GitHub Actions Time Testing

\`\`\`yaml
# .github/workflows/time-tests.yml
name: Time-Dependent Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run tests at different times to catch time-dependent issues
    - cron: '0 0 * * *'    # Daily at midnight UTC
    - cron: '0 12 * * *'   # Daily at noon UTC
    - cron: '0 6 * * 1'    # Weekly on Monday at 6 AM UTC

jobs:
  timezone-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        timezone:
          - 'UTC'
          - 'America/New_York'
          - 'Europe/London'
          - 'Asia/Tokyo'
          - 'Australia/Sydney'
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Set timezone
      run: |
        sudo timedatectl set-timezone \${{ matrix.timezone }}
        echo "TZ=\${{ matrix.timezone }}" >> $GITHUB_ENV
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run timezone-specific tests
      run: npm run test:timezone
      env:
        TZ: \${{ matrix.timezone }}
    
    - name: Run time-dependent integration tests
      run: npm run test:integration:time
      env:
        TZ: \${{ matrix.timezone }}

  dst-transition-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Test DST transitions
      run: |
        # Test spring forward
        export TEST_DATE="2024-03-10T07:00:00.000Z"
        npm run test:dst:spring
        
        # Test fall back
        export TEST_DATE="2024-11-03T06:00:00.000Z"
        npm run test:dst:fall

  performance-time-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run performance tests for time operations
      run: npm run test:performance:time
    
    - name: Upload performance results
      uses: actions/upload-artifact@v4
      with:
        name: time-performance-results
        path: performance-results.json
\`\`\`

### Docker-based Time Testing

\`\`\`dockerfile
# Dockerfile.test-time
FROM node:20-alpine

# Install timezone data
RUN apk add --no-cache tzdata

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Script to run tests in different timezones
COPY test-timezones.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/test-timezones.sh

# Default command
CMD ["test-timezones.sh"]
\`\`\`

\`\`\`bash
#!/bin/bash
# test-timezones.sh

set -e

TIMEZONES=(
  "UTC"
  "America/New_York"
  "Europe/London"
  "Asia/Tokyo"
  "Australia/Sydney"
)

echo "Running time-dependent tests across multiple timezones..."

for tz in "\${TIMEZONES[@]}"; do
  echo "Testing in timezone: $tz"
  export TZ="$tz"
  
  # Run tests with timezone set
  npm run test:time -- --testNamePattern="timezone" --verbose
  
  if [ $? -ne 0 ]; then
    echo "Tests failed in timezone: $tz"
    exit 1
  fi
done

echo "All timezone tests passed!"

# Run DST-specific tests
echo "Running DST transition tests..."
npm run test:dst

echo "All time-dependent tests completed successfully!"
\`\`\`

### Test Data Management for Time Tests

\`\`\`javascript
// test-data/time-fixtures.js
export const timeFixtures = {
  // Standard test times
  standardTimes: {
    epoch: new Date('1970-01-01T00:00:00.000Z'),
    y2k: new Date('2000-01-01T00:00:00.000Z'),
    currentTest: new Date('2024-01-15T10:30:00.000Z'),
    future: new Date('2030-12-31T23:59:59.999Z')
  },

  // DST transition times
  dstTransitions: {
    us: {
      springForward2024: new Date('2024-03-10T07:00:00.000Z'),
      fallBack2024: new Date('2024-11-03T06:00:00.000Z')
    },
    eu: {
      springForward2024: new Date('2024-03-31T01:00:00.000Z'),
      fallBack2024: new Date('2024-10-27T01:00:00.000Z')
    }
  },

  // Edge cases
  edgeCases: {
    leapYear: new Date('2024-02-29T12:00:00.000Z'),
    nonLeapYear: new Date('2023-02-28T12:00:00.000Z'),
    endOfMonth: new Date('2024-01-31T23:59:59.999Z'),
    startOfMonth: new Date('2024-02-01T00:00:00.000Z'),
    endOfYear: new Date('2024-12-31T23:59:59.999Z'),
    startOfYear: new Date('2025-01-01T00:00:00.000Z')
  },

  // Business scenarios
  businessScenarios: {
    businessHours: {
      start: new Date('2024-01-15T14:00:00.000Z'), // 9 AM EST
      end: new Date('2024-01-15T22:00:00.000Z'),   // 5 PM EST
      weekend: new Date('2024-01-13T15:00:00.000Z') // Saturday
    },
    subscriptions: {
      active: {
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: new Date('2024-12-31T23:59:59.999Z')
      },
      expired: {
        startDate: new Date('2023-01-01T00:00:00.000Z'),
        endDate: new Date('2023-12-31T23:59:59.999Z')
      },
      expiringSoon: {
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: new Date('2024-01-20T23:59:59.999Z') // 5 days from test time
      }
    }
  }
};

// Helper function to create test scenarios
export function createTimeScenario(baseName, variations) {
  return variations.map(variation => ({
    name: \`\${baseName} - \${variation.name}\`,
    mockTime: variation.time,
    expected: variation.expected,
    setup: variation.setup || (() => {}),
    teardown: variation.teardown || (() => {})
  }));
}

// Example usage
export const cacheExpirationScenarios = createTimeScenario('Cache Expiration', [
  {
    name: 'before expiration',
    time: new Date('2024-01-15T10:30:00.000Z'),
    expected: { expired: false, value: 'cached-value' }
  },
  {
    name: 'at expiration',
    time: new Date('2024-01-15T10:35:00.000Z'),
    expected: { expired: true, value: null }
  },
  {
    name: 'after expiration',
    time: new Date('2024-01-15T10:40:00.000Z'),
    expected: { expired: true, value: null }
  }
]);
\`\`\`

## Performance Testing for Time Operations

### Benchmarking Time Functions

\`\`\`javascript
// performance/time-benchmarks.js
import { performance } from 'perf_hooks';

class TimeBenchmark {
  constructor() {
    this.results = [];
  }

  benchmark(name, fn, iterations = 10000) {
    // Warm up
    for (let i = 0; i < 100; i++) {
      fn();
    }

    // Actual benchmark
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = performance.now();

    const result = {
      name,
      iterations,
      totalTime: end - start,
      avgTime: (end - start) / iterations,
      opsPerSecond: iterations / ((end - start) / 1000)
    };

    this.results.push(result);
    return result;
  }

  compare(benchmarks) {
    console.log('Time Operation Benchmarks:');
    console.log('==========================');
    
    benchmarks.forEach(result => {
      console.log(\`\${result.name}:\`);
      console.log(\`  Average time: \${result.avgTime.toFixed(4)}ms\`);
      console.log(\`  Operations/sec: \${result.opsPerSecond.toFixed(0)}\`);
      console.log('');
    });

    // Find fastest
    const fastest = benchmarks.reduce((prev, current) => 
      prev.avgTime < current.avgTime ? prev : current
    );
    
    console.log(\`Fastest: \${fastest.name}\`);
  }
}

// Benchmark different time operations
describe('Time operation performance', () => {
  let benchmark;

  beforeEach(() => {
    benchmark = new TimeBenchmark();
  });

  test('should benchmark timestamp creation methods', () => {
    const results = [
      benchmark.benchmark('Date.now()', () => Date.now()),
      benchmark.benchmark('new Date().getTime()', () => new Date().getTime()),
      benchmark.benchmark('performance.now()', () => performance.now()),
      benchmark.benchmark('+new Date()', () => +new Date())
    ];

    benchmark.compare(results);
    
    // Assert performance expectations
    const dateNowResult = results.find(r => r.name === 'Date.now()');
    expect(dateNowResult.opsPerSecond).toBeGreaterThan(1000000); // Should be very fast
  });

  test('should benchmark timezone conversions', () => {
    const testDate = new Date('2024-01-15T10:30:00.000Z');
    
    const results = [
      benchmark.benchmark('Intl.DateTimeFormat', () => {
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York'
        }).format(testDate);
      }),
      benchmark.benchmark('toLocaleString', () => {
        testDate.toLocaleString('en-US', {
          timeZone: 'America/New_York'
        });
      }),
      benchmark.benchmark('Manual offset calculation', () => {
        // Simplified manual calculation (not DST-aware)
        new Date(testDate.getTime() - (5 * 60 * 60 * 1000));
      })
    ];

    benchmark.compare(results);
  });
});
\`\`\`

## Tools and Resources

### Essential Testing Tools

1. **[Unix Timestamp Converter](/timestamp-converter)** - Convert timestamps for test data creation and verification
2. **[Epoch Converter](/epoch-converter)** - Advanced timestamp conversion for complex test scenarios
3. **[Unix Time to Date](/unix-time-to-date)** - Quick conversion for debugging time-related test failures

### Testing Libraries and Frameworks

#### JavaScript
- **Jest**: Built-in fake timers and mocking capabilities
- **Sinon.js**: Comprehensive mocking including time functions
- **MockDate**: Simple date mocking library
- **Timekeeper**: Travel through time in tests

#### Python
- **freezegun**: Comprehensive time mocking
- **unittest.mock**: Built-in mocking capabilities
- **pytest-freezegun**: Pytest integration for time mocking
- **delorean**: Time travel for Python

#### Java
- **Mockito**: Mocking framework with time support
- **JUnit 5**: Modern testing with time extensions
- **TestClock**: Java 8+ time testing utilities

## Best Practices Summary

### Time Testing Principles

1. **Always mock time** in tests - never rely on system time
2. **Test edge cases** like DST transitions and leap years
3. **Use dependency injection** for time services
4. **Test across multiple timezones** for global applications
5. **Separate time logic** from business logic when possible
6. **Use fixed test data** with known time values
7. **Test performance** of time-intensive operations

### Common Anti-Patterns to Avoid

❌ **Don't:**
- Use \`Thread.sleep()\` or \`setTimeout()\` in tests
- Rely on system time for test assertions
- Skip timezone testing for global applications
- Use hardcoded dates that will become outdated
- Ignore DST transitions in scheduling logic

✅ **Do:**
- Mock time consistently across all tests
- Use time services with dependency injection
- Test time logic in isolation
- Create comprehensive test fixtures
- Automate time-dependent tests in CI/CD

## Conclusion

Testing time-dependent code requires careful planning, proper mocking strategies, and comprehensive test coverage across different scenarios. By following these practices and using the right tools, you can build reliable, maintainable tests for even the most complex temporal functionality.

### Key Takeaways

1. **Mock time consistently** using appropriate libraries and patterns
2. **Test across timezones** and DST transitions
3. **Separate time concerns** from business logic
4. **Automate time tests** in CI/CD pipelines
5. **Use performance testing** for time-intensive operations
6. **Create comprehensive fixtures** for different time scenarios

For quick timestamp conversions during test development and debugging, bookmark our [timestamp conversion tools](/timestamp-converter) and explore our other utilities for working with time data in tests.

---

*Need to convert timestamps for testing? Try our [Unix Timestamp Converter](/timestamp-converter) or explore our other time-related tools. Have questions about testing time-dependent code? Feel free to reach out to our team.*
`,
  status: 'published',
  published_date: new Date().toISOString(),
  featured_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop&crop=center'
}

// Categories and tags for the post
const categories = ['Technology', 'Tutorials']
const tags = ['Testing', 'Automation', 'Time Mocking', 'CI/CD', 'Jest', 'JavaScript', 'Python', 'QA', 'TDD', 'Unit Testing']

async function createBlogPost() {
  try {
    console.log('🚀 Creating Automated Testing for Time-Dependent Code blog post...')
    
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
