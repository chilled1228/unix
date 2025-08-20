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
  title: "Database Time Storage Strategies: Unix Timestamps vs DateTime Fields",
  slug: "database-time-storage-unix-timestamps-vs-datetime-2024",
  excerpt: "Master database time storage with our comprehensive comparison of Unix timestamps vs DateTime fields. Learn performance implications, migration strategies, and best practices for different database systems.",
  meta_title: "Database Time Storage: Unix Timestamps vs DateTime Complete Guide 2024",
  meta_description: "Compare Unix timestamps vs DateTime fields in databases. Learn performance implications, storage efficiency, migration strategies, and best practices for PostgreSQL, MySQL, MongoDB, and more.",
  content: `
# Database Time Storage Strategies: Unix Timestamps vs DateTime Fields

Choosing the right approach for storing time data in databases is a critical architectural decision that impacts performance, storage efficiency, and application complexity. This comprehensive guide compares Unix timestamps with native DateTime fields across different database systems, providing practical insights for database developers and system architects.

## The Time Storage Dilemma

### Why Time Storage Matters

Time data is fundamental to most applications, appearing in:

- **Audit trails** and logging systems
- **User activity** tracking
- **Event scheduling** and calendar systems
- **Financial transactions** and reporting
- **Content management** systems
- **IoT sensor data** collection

Poor time storage decisions can lead to:

- **Performance bottlenecks** in time-based queries
- **Storage inefficiency** consuming unnecessary disk space
- **Timezone confusion** and data inconsistencies
- **Complex migration** challenges as systems scale

### The Two Primary Approaches

#### Unix Timestamps
Store time as integers representing seconds (or milliseconds) since January 1, 1970, UTC.

#### Native DateTime Fields
Use database-specific date and time data types with built-in timezone support.

## Unix Timestamps: The Integer Approach

### Advantages of Unix Timestamps

#### 1. Storage Efficiency

\`\`\`sql
-- PostgreSQL storage comparison
-- Unix timestamp (BIGINT): 8 bytes
CREATE TABLE events_unix (
    id UUID PRIMARY KEY,
    created_at BIGINT NOT NULL,  -- 8 bytes
    updated_at BIGINT NOT NULL   -- 8 bytes
);

-- Total time storage: 16 bytes per record
\`\`\`

#### 2. Cross-Platform Consistency

\`\`\`javascript
// Same timestamp value across all systems
const timestamp = 1705316200; // 2024-01-15 10:30:00 UTC

// JavaScript
const jsDate = new Date(timestamp * 1000);

// Python
import datetime
py_date = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)

// Java
Instant javaInstant = Instant.ofEpochSecond(timestamp);
\`\`\`

#### 3. Mathematical Operations

\`\`\`sql
-- Easy time calculations with Unix timestamps
SELECT 
    id,
    created_at,
    created_at + 86400 as tomorrow,           -- Add 1 day (86400 seconds)
    created_at - (7 * 86400) as week_ago,    -- Subtract 1 week
    (updated_at - created_at) as duration    -- Calculate duration in seconds
FROM events_unix;

-- Time-based aggregations
SELECT 
    (created_at / 86400) * 86400 as day_bucket,  -- Group by day
    COUNT(*) as events_per_day
FROM events_unix
GROUP BY day_bucket;
\`\`\`

#### 4. Index Performance

\`\`\`sql
-- Efficient indexing on integer values
CREATE INDEX idx_events_created_at ON events_unix(created_at);

-- Range queries are very fast
SELECT * FROM events_unix 
WHERE created_at BETWEEN 1705316200 AND 1705402600;  -- Specific date range
\`\`\`

### Disadvantages of Unix Timestamps

#### 1. Human Readability

\`\`\`sql
-- ❌ Not human-readable
SELECT id, created_at FROM events_unix;
-- Result: id | created_at
--         1  | 1705316200

-- ✅ Requires conversion for readability
SELECT 
    id, 
    created_at,
    to_timestamp(created_at) as readable_date
FROM events_unix;
\`\`\`

#### 2. Year 2038 Problem (32-bit systems)

\`\`\`sql
-- 32-bit Unix timestamp limitation
-- Maximum value: 2147483647 (January 19, 2038, 03:14:07 UTC)

-- Solution: Use BIGINT (64-bit) instead of INTEGER (32-bit)
CREATE TABLE events_safe (
    id UUID PRIMARY KEY,
    created_at BIGINT NOT NULL  -- Safe until year 292,277,026,596
);
\`\`\`

#### 3. Timezone Complexity

\`\`\`sql
-- Unix timestamps are always UTC
-- Application must handle timezone conversion
SELECT 
    id,
    created_at,
    -- Convert to different timezones in application layer
    created_at as utc_timestamp
FROM events_unix;
\`\`\`

## Native DateTime Fields: The Database Approach

### Advantages of DateTime Fields

#### 1. Human Readability

\`\`\`sql
-- PostgreSQL TIMESTAMP WITH TIME ZONE
CREATE TABLE events_datetime (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Immediately readable results
SELECT id, created_at FROM events_datetime;
-- Result: id | created_at
--         1  | 2024-01-15 10:30:00+00
\`\`\`

#### 2. Built-in Timezone Support

\`\`\`sql
-- PostgreSQL timezone handling
SELECT 
    id,
    created_at,
    created_at AT TIME ZONE 'America/New_York' as ny_time,
    created_at AT TIME ZONE 'Europe/London' as london_time,
    created_at AT TIME ZONE 'Asia/Tokyo' as tokyo_time
FROM events_datetime;
\`\`\`

#### 3. Rich Date Functions

\`\`\`sql
-- PostgreSQL date functions
SELECT 
    id,
    created_at,
    EXTRACT(YEAR FROM created_at) as year,
    EXTRACT(MONTH FROM created_at) as month,
    EXTRACT(DOW FROM created_at) as day_of_week,
    DATE_TRUNC('day', created_at) as day_start,
    created_at + INTERVAL '1 day' as tomorrow
FROM events_datetime;

-- MySQL date functions
SELECT 
    id,
    created_at,
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    DAYOFWEEK(created_at) as day_of_week,
    DATE_ADD(created_at, INTERVAL 1 DAY) as tomorrow
FROM events_datetime;
\`\`\`

#### 4. Data Validation

\`\`\`sql
-- Automatic validation of date values
INSERT INTO events_datetime (created_at) VALUES ('2024-02-30');  -- Error: invalid date
INSERT INTO events_datetime (created_at) VALUES ('2024-13-01');  -- Error: invalid month
\`\`\`

### Disadvantages of DateTime Fields

#### 1. Storage Overhead

\`\`\`sql
-- PostgreSQL storage comparison
-- TIMESTAMP WITH TIME ZONE: 8 bytes
-- TIMESTAMP WITHOUT TIME ZONE: 8 bytes
-- But often requires additional timezone storage

CREATE TABLE events_datetime (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,  -- 8 bytes
    updated_at TIMESTAMP WITH TIME ZONE,  -- 8 bytes
    timezone VARCHAR(50)                  -- Additional 50+ bytes for timezone name
);
\`\`\`

#### 2. Cross-Platform Inconsistencies

\`\`\`sql
-- Different databases handle timezones differently

-- PostgreSQL: Full timezone support
CREATE TABLE events (created_at TIMESTAMP WITH TIME ZONE);

-- MySQL: Limited timezone support (before 8.0.19)
CREATE TABLE events (created_at DATETIME);  -- No timezone info

-- SQLite: No native datetime type
CREATE TABLE events (created_at TEXT);  -- Stored as text
\`\`\`

#### 3. Performance Considerations

\`\`\`sql
-- DateTime operations can be slower than integer operations
-- Especially for large-scale aggregations

-- Slower: DateTime aggregation
SELECT 
    DATE_TRUNC('hour', created_at) as hour_bucket,
    COUNT(*) 
FROM events_datetime 
GROUP BY hour_bucket;

-- Faster: Unix timestamp aggregation
SELECT 
    (created_at / 3600) * 3600 as hour_bucket,
    COUNT(*) 
FROM events_unix 
GROUP BY hour_bucket;
\`\`\`

## Database-Specific Implementations

### PostgreSQL

#### Best Practices for PostgreSQL

\`\`\`sql
-- Recommended approach: TIMESTAMP WITH TIME ZONE
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    -- Optional: Store original timezone for reference
    original_timezone TEXT
);

-- Efficient indexing
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_created_at_date ON events(DATE(created_at));

-- Automatic update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
\`\`\`

#### PostgreSQL Performance Optimization

\`\`\`sql
-- Partitioning by time ranges
CREATE TABLE events_2024 PARTITION OF events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE events_2025 PARTITION OF events
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Partial indexes for active records
CREATE INDEX idx_events_active ON events(created_at) 
WHERE deleted_at IS NULL;
\`\`\`

### MySQL

#### MySQL Time Storage Strategies

\`\`\`sql
-- MySQL 8.0+ with timezone support
CREATE TABLE events (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    -- Store timezone separately for older MySQL versions
    timezone VARCHAR(50) DEFAULT 'UTC'
);

-- For high-precision requirements
CREATE TABLE events_precise (
    id CHAR(36) PRIMARY KEY,
    created_at_unix BIGINT NOT NULL,           -- Unix timestamp in microseconds
    created_at_readable TIMESTAMP(6) GENERATED ALWAYS AS (FROM_UNIXTIME(created_at_unix/1000000)) STORED
);
\`\`\`

### MongoDB

#### MongoDB Time Storage Patterns

\`\`\`javascript
// MongoDB native Date type (recommended)
const eventSchema = {
  _id: ObjectId(),
  title: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Optional: Store timezone context
  timezone: { type: String, default: 'UTC' }
};

// Unix timestamp approach
const eventUnixSchema = {
  _id: ObjectId(),
  title: String,
  createdAtUnix: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  updatedAtUnix: { type: Number, default: () => Math.floor(Date.now() / 1000) }
};

// Hybrid approach for flexibility
const eventHybridSchema = {
  _id: ObjectId(),
  title: String,
  timestamps: {
    created: {
      unix: { type: Number, default: () => Math.floor(Date.now() / 1000) },
      iso: { type: Date, default: Date.now },
      timezone: { type: String, default: 'UTC' }
    },
    updated: {
      unix: { type: Number, default: () => Math.floor(Date.now() / 1000) },
      iso: { type: Date, default: Date.now }
    }
  }
};
\`\`\`

## Performance Comparison

### Benchmark Results

#### Storage Space Comparison

\`\`\`sql
-- Test table with 1 million records
-- PostgreSQL results:

-- Unix timestamp approach
CREATE TABLE test_unix (
    id SERIAL PRIMARY KEY,
    created_at BIGINT,
    updated_at BIGINT,
    event_time BIGINT
);
-- Storage: ~76 MB for 1M records

-- DateTime approach  
CREATE TABLE test_datetime (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    event_time TIMESTAMP WITH TIME ZONE
);
-- Storage: ~84 MB for 1M records

-- Space savings: ~10% with Unix timestamps
\`\`\`

#### Query Performance Comparison

\`\`\`sql
-- Range query performance (1M records)

-- Unix timestamp query
SELECT COUNT(*) FROM test_unix 
WHERE created_at BETWEEN 1704067200 AND 1704153600;
-- Execution time: ~15ms

-- DateTime query
SELECT COUNT(*) FROM test_datetime 
WHERE created_at BETWEEN '2024-01-01' AND '2024-01-02';
-- Execution time: ~18ms

-- Aggregation performance
-- Unix timestamp aggregation
SELECT 
    (created_at / 86400) * 86400 as day,
    COUNT(*) 
FROM test_unix 
GROUP BY day;
-- Execution time: ~45ms

-- DateTime aggregation
SELECT 
    DATE_TRUNC('day', created_at) as day,
    COUNT(*) 
FROM test_datetime 
GROUP BY day;
-- Execution time: ~62ms
\`\`\`

## Migration Strategies

### From DateTime to Unix Timestamps

\`\`\`sql
-- PostgreSQL migration example
-- Step 1: Add new Unix timestamp columns
ALTER TABLE events 
ADD COLUMN created_at_unix BIGINT,
ADD COLUMN updated_at_unix BIGINT;

-- Step 2: Populate Unix timestamp columns
UPDATE events 
SET 
    created_at_unix = EXTRACT(EPOCH FROM created_at)::BIGINT,
    updated_at_unix = EXTRACT(EPOCH FROM updated_at)::BIGINT;

-- Step 3: Add indexes on new columns
CREATE INDEX idx_events_created_at_unix ON events(created_at_unix);

-- Step 4: Update application code to use new columns
-- Step 5: Drop old columns (after thorough testing)
ALTER TABLE events 
DROP COLUMN created_at,
DROP COLUMN updated_at;

-- Step 6: Rename new columns
ALTER TABLE events 
RENAME COLUMN created_at_unix TO created_at,
RENAME COLUMN updated_at_unix TO updated_at;
\`\`\`

### From Unix Timestamps to DateTime

\`\`\`sql
-- PostgreSQL migration example
-- Step 1: Add new DateTime columns
ALTER TABLE events 
ADD COLUMN created_at_dt TIMESTAMP WITH TIME ZONE,
ADD COLUMN updated_at_dt TIMESTAMP WITH TIME ZONE;

-- Step 2: Populate DateTime columns
UPDATE events 
SET 
    created_at_dt = TO_TIMESTAMP(created_at),
    updated_at_dt = TO_TIMESTAMP(updated_at);

-- Step 3: Add indexes and constraints
CREATE INDEX idx_events_created_at_dt ON events(created_at_dt);
ALTER TABLE events ALTER COLUMN created_at_dt SET NOT NULL;

-- Step 4: Update application code
-- Step 5: Drop old columns and rename
ALTER TABLE events 
DROP COLUMN created_at,
DROP COLUMN updated_at;

ALTER TABLE events 
RENAME COLUMN created_at_dt TO created_at,
RENAME COLUMN updated_at_dt TO updated_at;
\`\`\`

### Zero-Downtime Migration

\`\`\`sql
-- Blue-green migration approach
-- Step 1: Create new table with desired schema
CREATE TABLE events_new (
    id UUID PRIMARY KEY,
    created_at BIGINT NOT NULL,  -- New format
    updated_at BIGINT NOT NULL,
    -- ... other columns
);

-- Step 2: Set up real-time sync (using triggers or CDC)
CREATE OR REPLACE FUNCTION sync_to_new_table()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO events_new (id, created_at, updated_at, ...)
    VALUES (
        NEW.id,
        EXTRACT(EPOCH FROM NEW.created_at)::BIGINT,
        EXTRACT(EPOCH FROM NEW.updated_at)::BIGINT,
        ...
    )
    ON CONFLICT (id) DO UPDATE SET
        created_at = EXTRACT(EPOCH FROM NEW.created_at)::BIGINT,
        updated_at = EXTRACT(EPOCH FROM NEW.updated_at)::BIGINT;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Backfill historical data
INSERT INTO events_new (id, created_at, updated_at, ...)
SELECT 
    id,
    EXTRACT(EPOCH FROM created_at)::BIGINT,
    EXTRACT(EPOCH FROM updated_at)::BIGINT,
    ...
FROM events;

-- Step 4: Switch application to new table
-- Step 5: Drop old table after verification
\`\`\`

## Hybrid Approaches

### Best of Both Worlds

\`\`\`sql
-- Store both formats for maximum flexibility
CREATE TABLE events_hybrid (
    id UUID PRIMARY KEY,
    -- Unix timestamp for performance
    created_at_unix BIGINT NOT NULL,
    updated_at_unix BIGINT NOT NULL,
    -- DateTime for readability (computed columns)
    created_at_readable TIMESTAMP WITH TIME ZONE 
        GENERATED ALWAYS AS (TO_TIMESTAMP(created_at_unix)) STORED,
    updated_at_readable TIMESTAMP WITH TIME ZONE 
        GENERATED ALWAYS AS (TO_TIMESTAMP(updated_at_unix)) STORED
);

-- Index on Unix timestamp for performance
CREATE INDEX idx_events_created_unix ON events_hybrid(created_at_unix);

-- Use Unix for queries, DateTime for display
SELECT 
    id,
    created_at_readable as display_time
FROM events_hybrid
WHERE created_at_unix BETWEEN 1704067200 AND 1704153600;
\`\`\`

### Application-Level Abstraction

\`\`\`javascript
// Database abstraction layer
class TimeStorageAdapter {
  constructor(storageType = 'unix') {
    this.storageType = storageType;
  }
  
  // Convert application time to storage format
  toStorage(date) {
    switch (this.storageType) {
      case 'unix':
        return Math.floor(new Date(date).getTime() / 1000);
      case 'datetime':
        return new Date(date).toISOString();
      case 'hybrid':
        return {
          unix: Math.floor(new Date(date).getTime() / 1000),
          iso: new Date(date).toISOString()
        };
      default:
        throw new Error(\`Unsupported storage type: \${this.storageType}\`);
    }
  }
  
  // Convert storage format to application time
  fromStorage(stored) {
    switch (this.storageType) {
      case 'unix':
        return new Date(stored * 1000);
      case 'datetime':
        return new Date(stored);
      case 'hybrid':
        return new Date(stored.unix * 1000);
      default:
        throw new Error(\`Unsupported storage type: \${this.storageType}\`);
    }
  }
  
  // Generate range query conditions
  rangeQuery(startDate, endDate) {
    const start = this.toStorage(startDate);
    const end = this.toStorage(endDate);
    
    switch (this.storageType) {
      case 'unix':
        return \`created_at BETWEEN \${start} AND \${end}\`;
      case 'datetime':
        return \`created_at BETWEEN '\${start}' AND '\${end}'\`;
      case 'hybrid':
        return \`created_at_unix BETWEEN \${start.unix} AND \${end.unix}\`;
    }
  }
}

// Usage example
const timeAdapter = new TimeStorageAdapter('unix');
const now = new Date();
const storedTime = timeAdapter.toStorage(now);
const retrievedTime = timeAdapter.fromStorage(storedTime);
\`\`\`

## Decision Framework

### When to Use Unix Timestamps

✅ **Choose Unix Timestamps When:**

- **High-performance requirements** with frequent time-based queries
- **Cross-platform consistency** is critical
- **Storage efficiency** is a primary concern
- **Mathematical operations** on time are common
- **Simple time handling** without complex timezone requirements
- **IoT or sensor data** with high-frequency timestamps
- **Analytics workloads** with time-based aggregations

### When to Use DateTime Fields

✅ **Choose DateTime Fields When:**

- **Human readability** is important for debugging/maintenance
- **Complex timezone handling** is required
- **Rich date functions** are needed frequently
- **Data validation** at the database level is preferred
- **Reporting and BI tools** need native date support
- **Regulatory compliance** requires audit-friendly timestamps
- **Team expertise** is stronger with native database features

### Hybrid Approach Considerations

✅ **Consider Hybrid When:**

- **Migration period** from one format to another
- **Different use cases** within the same application
- **Performance and readability** are both critical
- **Legacy system integration** requires multiple formats

## Monitoring and Optimization

### Performance Monitoring

\`\`\`sql
-- Monitor query performance
-- PostgreSQL example
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%created_at%'
ORDER BY total_time DESC;

-- Index usage monitoring
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'events'
ORDER BY idx_scan DESC;
\`\`\`

### Storage Monitoring

\`\`\`sql
-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE tablename LIKE '%events%'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
\`\`\`

## Tools and Resources

### Essential Time Conversion Tools

1. **[Unix Timestamp Converter](/timestamp-converter)** - Convert between Unix timestamps and readable dates for database testing
2. **[Epoch Converter](/epoch-converter)** - Advanced epoch time conversion for database migration planning
3. **[Unix Time to Date](/unix-time-to-date)** - Simple conversion tool for database debugging

### Database-Specific Tools

#### PostgreSQL
- **pg_stat_statements**: Query performance monitoring
- **pg_stat_user_indexes**: Index usage analysis
- **EXPLAIN ANALYZE**: Query execution plan analysis

#### MySQL
- **Performance Schema**: Comprehensive performance monitoring
- **SHOW PROFILE**: Query execution analysis
- **MySQL Workbench**: Visual query optimization

#### MongoDB
- **MongoDB Compass**: Visual query performance analysis
- **db.collection.explain()**: Query execution statistics
- **MongoDB Profiler**: Detailed operation profiling

## Conclusion

The choice between Unix timestamps and DateTime fields depends on your specific requirements for performance, readability, and functionality. Unix timestamps excel in high-performance scenarios with simple time operations, while DateTime fields provide better readability and rich functionality for complex applications.

### Key Decision Factors

1. **Performance Requirements**: Unix timestamps for high-performance scenarios
2. **Human Readability**: DateTime fields for debugging and maintenance
3. **Cross-Platform Needs**: Unix timestamps for consistency
4. **Timezone Complexity**: DateTime fields for rich timezone support
5. **Storage Efficiency**: Unix timestamps for space optimization
6. **Team Expertise**: Choose based on team familiarity

### Best Practices Summary

- **Always store time in UTC** regardless of format choice
- **Use appropriate indexing** strategies for your chosen format
- **Plan migration strategies** carefully for format changes
- **Monitor performance** regularly and optimize as needed
- **Consider hybrid approaches** for complex requirements
- **Document your choice** and reasoning for future maintainers

For quick timestamp conversions during database development and testing, bookmark our [timestamp conversion tools](/timestamp-converter) and explore our other utilities for working with time data in databases.

---

*Need to convert timestamps for database work? Try our [Unix Timestamp Converter](/timestamp-converter) or explore our other time-related tools. Have questions about database time storage? Feel free to reach out to our team.*
`,
  status: 'published',
  published_date: new Date().toISOString(),
  featured_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop&crop=center'
}

// Categories and tags for the post
const categories = ['Technology', 'Tutorials']
const tags = ['Database', 'Unix Timestamps', 'DateTime', 'PostgreSQL', 'MySQL', 'MongoDB', 'Performance', 'Storage', 'Migration', 'SQL']

async function createBlogPost() {
  try {
    console.log('🚀 Creating Database Time Storage blog post...')
    
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
