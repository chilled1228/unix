const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file for:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
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
  title: "API Development Best Practices: Mastering Time Handling in Modern APIs",
  slug: "api-development-time-handling-best-practices-2024",
  excerpt: "Learn essential best practices for handling time data in APIs. Discover how to implement proper timezone management, Unix timestamp usage, and create robust time-aware API endpoints that scale globally.",
  meta_title: "API Time Handling Best Practices 2024: Complete Developer Guide",
  meta_description: "Master API development with proper time handling. Learn Unix timestamps, timezone management, ISO 8601 standards, and best practices for building time-aware APIs that work globally.",
  content: `
# API Development Best Practices: Mastering Time Handling in Modern APIs

Time handling is one of the most critical yet often overlooked aspects of API development. Whether you're building a simple REST API or a complex microservices architecture, proper time management can make the difference between a robust, scalable system and one plagued with timezone bugs and data inconsistencies.

In this comprehensive guide, we'll explore the essential best practices for handling time data in APIs, covering everything from Unix timestamps to timezone management and real-world implementation strategies.

## Why Time Handling Matters in APIs

### The Global Challenge

Modern applications serve users across multiple timezones, making time handling a critical consideration. Poor time management can lead to:

- **Data Inconsistencies**: Different clients interpreting timestamps differently
- **User Experience Issues**: Incorrect display of dates and times
- **Business Logic Errors**: Scheduling conflicts and missed deadlines
- **Compliance Problems**: Audit trails with ambiguous timestamps

### The Cost of Getting It Wrong

According to industry studies, timezone-related bugs account for approximately 15% of all production issues in global applications. These bugs are often difficult to reproduce and can cause significant business impact.

## Core Principles of API Time Handling

### 1. Always Use UTC Internally

**Golden Rule**: Store and process all timestamps in UTC (Coordinated Universal Time).

\`\`\`javascript
// ✅ Good: Store in UTC
const apiResponse = {
  created_at: "2024-01-15T10:30:00.000Z",
  updated_at: "2024-01-15T14:45:00.000Z"
}

// ❌ Bad: Ambiguous timezone
const badResponse = {
  created_at: "2024-01-15 10:30:00",
  updated_at: "2024-01-15 14:45:00"
}
\`\`\`

### 2. Choose the Right Time Format

#### Unix Timestamps vs ISO 8601

**Unix Timestamps** are ideal for:
- High-performance scenarios
- Database storage efficiency
- Mathematical operations
- Cross-platform compatibility

\`\`\`javascript
// Unix timestamp (seconds since epoch)
{
  "created_at": 1705316200,
  "expires_at": 1705402600
}
\`\`\`

**ISO 8601** is better for:
- Human readability
- API documentation
- Frontend consumption
- Debugging and logging

\`\`\`javascript
// ISO 8601 format
{
  "created_at": "2024-01-15T10:30:00.000Z",
  "expires_at": "2024-01-16T10:30:00.000Z"
}
\`\`\`

### 3. Consistent Timezone Handling

Establish clear rules for timezone handling across your API:

\`\`\`javascript
// API Response with timezone context
{
  "event": {
    "id": "evt_123",
    "name": "Product Launch",
    "start_time": "2024-01-15T10:30:00.000Z",
    "timezone": "America/New_York",
    "local_time": "2024-01-15T05:30:00-05:00"
  }
}
\`\`\`

## Implementation Best Practices

### 1. Database Design

#### Schema Design for Time Data

\`\`\`sql
-- Recommended table structure
CREATE TABLE events (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50) -- Store original timezone for reference
);

-- Index for time-based queries
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_at ON events(created_at);
\`\`\`

#### Unix Timestamp Storage

\`\`\`sql
-- Alternative approach using Unix timestamps
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at BIGINT NOT NULL, -- Unix timestamp
    expires_at BIGINT NOT NULL, -- Unix timestamp
    last_activity BIGINT NOT NULL
);
\`\`\`

### 2. API Endpoint Design

#### RESTful Time Filtering

\`\`\`javascript
// GET /api/events?start_date=2024-01-15T00:00:00Z&end_date=2024-01-16T00:00:00Z
app.get('/api/events', async (req, res) => {
  const { start_date, end_date, timezone = 'UTC' } = req.query;
  
  // Validate ISO 8601 format
  if (!isValidISO8601(start_date) || !isValidISO8601(end_date)) {
    return res.status(400).json({
      error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)'
    });
  }
  
  const events = await Event.findByDateRange(start_date, end_date);
  
  res.json({
    data: events.map(event => ({
      ...event,
      created_at: event.created_at.toISOString(),
      start_time: event.start_time.toISOString()
    })),
    meta: {
      timezone: timezone,
      count: events.length
    }
  });
});
\`\`\`

#### Time Conversion Utilities

\`\`\`javascript
// Utility functions for time handling
class TimeUtils {
  static toUnixTimestamp(date) {
    return Math.floor(new Date(date).getTime() / 1000);
  }
  
  static fromUnixTimestamp(timestamp) {
    return new Date(timestamp * 1000).toISOString();
  }
  
  static convertToTimezone(utcDate, timezone) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(utcDate));
  }
}
\`\`\`

### 3. Request/Response Patterns

#### Standardized Time Fields

\`\`\`javascript
// Consistent naming convention
const standardTimeFields = {
  created_at: "2024-01-15T10:30:00.000Z",    // Resource creation
  updated_at: "2024-01-15T14:45:00.000Z",    // Last modification
  published_at: "2024-01-15T12:00:00.000Z",  // Publication time
  expires_at: "2024-01-16T10:30:00.000Z",    // Expiration time
  deleted_at: null                            // Soft deletion (null if active)
};
\`\`\`

#### Error Handling for Time Data

\`\`\`javascript
// Comprehensive time validation
function validateTimeInput(timeString) {
  const errors = [];
  
  if (!timeString) {
    errors.push('Time field is required');
    return { valid: false, errors };
  }
  
  const date = new Date(timeString);
  
  if (isNaN(date.getTime())) {
    errors.push('Invalid date format');
  }
  
  if (date.getTime() < 0) {
    errors.push('Date cannot be before Unix epoch');
  }
  
  if (date.getTime() > 2147483647000) { // Year 2038 problem
    errors.push('Date exceeds maximum supported timestamp');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    parsed: errors.length === 0 ? date : null
  };
}
\`\`\`

## Advanced Patterns

### 1. Timezone-Aware Scheduling APIs

\`\`\`javascript
// POST /api/schedules
{
  "title": "Team Meeting",
  "start_time": "2024-01-15T14:00:00",
  "duration_minutes": 60,
  "timezone": "America/New_York",
  "recurrence": {
    "type": "weekly",
    "days": ["monday", "wednesday"]
  }
}

// Response includes multiple timezone representations
{
  "id": "sch_123",
  "title": "Team Meeting",
  "times": {
    "utc": "2024-01-15T19:00:00.000Z",
    "local": "2024-01-15T14:00:00-05:00",
    "unix": 1705345200
  },
  "timezone": "America/New_York"
}
\`\`\`

### 2. Time-Based Pagination

\`\`\`javascript
// Cursor-based pagination using timestamps
app.get('/api/posts', (req, res) => {
  const { cursor, limit = 20 } = req.query;
  
  let query = Post.query().orderBy('created_at', 'desc');
  
  if (cursor) {
    // Decode cursor (base64 encoded timestamp)
    const timestamp = Buffer.from(cursor, 'base64').toString();
    query = query.where('created_at', '<', timestamp);
  }
  
  const posts = await query.limit(limit + 1);
  const hasMore = posts.length > limit;
  
  if (hasMore) posts.pop();
  
  const nextCursor = hasMore ? 
    Buffer.from(posts[posts.length - 1].created_at.toISOString()).toString('base64') : 
    null;
  
  res.json({
    data: posts,
    pagination: {
      next_cursor: nextCursor,
      has_more: hasMore
    }
  });
});
\`\`\`

## Testing Time-Dependent APIs

### 1. Mock Time in Tests

\`\`\`javascript
// Jest example for time mocking
describe('Time-dependent API endpoints', () => {
  beforeEach(() => {
    // Mock current time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T10:30:00.000Z'));
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('should create event with correct timestamp', async () => {
    const response = await request(app)
      .post('/api/events')
      .send({ name: 'Test Event' });
    
    expect(response.body.created_at).toBe('2024-01-15T10:30:00.000Z');
  });
});
\`\`\`

### 2. Timezone Testing

\`\`\`javascript
// Test across multiple timezones
const timezones = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney'
];

timezones.forEach(timezone => {
  test(\`should handle \${timezone} correctly\`, async () => {
    process.env.TZ = timezone;
    
    const response = await request(app)
      .get('/api/events')
      .query({ timezone });
    
    expect(response.status).toBe(200);
    expect(response.body.meta.timezone).toBe(timezone);
  });
});
\`\`\`

## Performance Considerations

### 1. Indexing Strategies

\`\`\`sql
-- Composite indexes for time-based queries
CREATE INDEX idx_events_user_time ON events(user_id, created_at DESC);
CREATE INDEX idx_events_status_time ON events(status, start_time);

-- Partial indexes for active records
CREATE INDEX idx_active_events ON events(start_time) 
WHERE deleted_at IS NULL;
\`\`\`

### 2. Caching Time-Sensitive Data

\`\`\`javascript
// Redis caching with TTL
const cacheKey = \`events:\${userId}:\${date}\`;
const ttl = 300; // 5 minutes

const cachedEvents = await redis.get(cacheKey);
if (cachedEvents) {
  return JSON.parse(cachedEvents);
}

const events = await fetchEventsFromDB(userId, date);
await redis.setex(cacheKey, ttl, JSON.stringify(events));

return events;
\`\`\`

## Tools and Resources

### Essential Tools for Time Handling

1. **[Unix Timestamp Converter](/timestamp-converter)** - Convert between Unix timestamps and readable dates
2. **[Epoch Converter](/epoch-converter)** - Advanced epoch time conversion with multiple formats  
3. **[Unix Time to Date](/unix-time-to-date)** - Simple Unix time to date conversion

### Libraries and Frameworks

#### JavaScript/Node.js
- **date-fns**: Modern date utility library
- **moment.js**: Comprehensive date manipulation (legacy)
- **dayjs**: Lightweight alternative to moment.js
- **luxon**: Successor to moment.js with better timezone support

#### Python
- **datetime**: Built-in Python module
- **pytz**: Timezone handling
- **arrow**: Better dates and times for Python
- **pendulum**: Human-friendly dates and times

#### Java
- **java.time**: Modern Java date/time API
- **Joda-Time**: Legacy but still widely used
- **ThreeTen**: Backport of java.time

## Common Pitfalls and Solutions

### 1. The Daylight Saving Time Trap

\`\`\`javascript
// ❌ Problematic: Assuming fixed offset
const newYorkTime = utcTime - (5 * 60 * 60 * 1000); // Always -5 hours

// ✅ Correct: Use proper timezone conversion
const newYorkTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York'
}).format(utcTime);
\`\`\`

### 2. The Year 2038 Problem

\`\`\`javascript
// ❌ 32-bit Unix timestamp limitation
const maxTimestamp = 2147483647; // January 19, 2038

// ✅ Use 64-bit timestamps or ISO strings
const safeTimestamp = Date.now(); // 64-bit milliseconds
const isoString = new Date().toISOString(); // No year limit
\`\`\`

### 3. Leap Second Handling

\`\`\`javascript
// Be aware of leap seconds in high-precision applications
const isLeapSecond = (timestamp) => {
  // Implementation depends on your precision requirements
  // Most applications can ignore leap seconds
  return false;
};
\`\`\`

## Monitoring and Observability

### 1. Time-Related Metrics

\`\`\`javascript
// Track time-related API performance
const timeMetrics = {
  timezone_conversion_duration: histogram('timezone_conversion_ms'),
  invalid_timestamp_errors: counter('invalid_timestamp_total'),
  api_response_time_by_timezone: histogram('api_response_time_ms', ['timezone'])
};
\`\`\`

### 2. Alerting on Time Issues

\`\`\`javascript
// Alert on suspicious time patterns
if (timestamp < Date.now() - (365 * 24 * 60 * 60 * 1000)) {
  logger.warn('Timestamp more than 1 year in the past', { timestamp });
}

if (timestamp > Date.now() + (30 * 24 * 60 * 60 * 1000)) {
  logger.warn('Timestamp more than 30 days in the future', { timestamp });
}
\`\`\`

## Conclusion

Proper time handling in APIs is crucial for building robust, scalable applications that serve global audiences. By following these best practices, you'll avoid common pitfalls and create APIs that handle time data consistently and reliably.

### Key Takeaways

1. **Always store time in UTC** and convert for display
2. **Choose appropriate formats** (Unix timestamps vs ISO 8601) based on use case
3. **Implement comprehensive validation** for time inputs
4. **Test across multiple timezones** and edge cases
5. **Monitor time-related metrics** and errors
6. **Use established libraries** rather than rolling your own solutions

### Next Steps

- Audit your existing APIs for time handling issues
- Implement standardized time validation across your services
- Set up monitoring for time-related errors
- Consider migrating legacy systems to UTC-based storage

For quick timestamp conversions during development and testing, bookmark our [timestamp conversion tools](/timestamp-converter) and explore our other utilities for working with time and dates.

---

*Need to convert timestamps quickly? Try our [Unix Timestamp Converter](/timestamp-converter) or explore our other time-related tools. Have questions about API time handling? Feel free to reach out to our team.*
`,
  status: 'published',
  published_date: new Date().toISOString(),
  featured_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&crop=center'
}

// Categories and tags for the post
const categories = ['Technology', 'Tutorials']
const tags = ['API', 'Best Practices', 'Unix Timestamps', 'Backend Development', 'Time Handling', 'UTC', 'Timezone', 'JavaScript', 'Node.js', 'Database']

async function createBlogPost() {
  try {
    console.log('🚀 Creating API Best Practices blog post...')
    
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
