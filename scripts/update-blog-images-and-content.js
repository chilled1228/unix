#!/usr/bin/env node

/**
 * Script to update blog posts with unique featured images and improved content
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Unique featured images for each post type
const postImages = {
  'complete-guide-unix-timestamps-2024': {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&crop=center',
    alt: 'Digital clock and timestamp visualization'
  },
  'javascript-date-time-unix-timestamps': {
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop&crop=center',
    alt: 'JavaScript code with date and time functions'
  },
  'python-datetime-unix-timestamps-guide': {
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=630&fit=crop&crop=center',
    alt: 'Python code with datetime modules'
  }
}

// Improved content formatting for better readability
const improvedContent = {
  'complete-guide-unix-timestamps-2024': `
# The Complete Guide to Unix Timestamps: Everything You Need to Know in 2024

Unix timestamps are fundamental to modern computing, serving as the backbone for time representation across systems, databases, and applications worldwide. Whether you're a developer, system administrator, or just curious about how computers handle time, this comprehensive guide will teach you everything you need to know about Unix timestamps.

## What is a Unix Timestamp?

A Unix timestamp (also known as Unix time, POSIX time, or Epoch time) is a system for describing a point in time. It represents the number of seconds that have elapsed since **January 1, 1970, at 00:00:00 UTC** (Coordinated Universal Time), not counting leap seconds.

### Key Characteristics:

- **Origin**: January 1, 1970, 00:00:00 UTC (the "Unix Epoch")
- **Format**: Integer representing seconds since the epoch
- **Range**: Can represent dates from 1970 to 2038 (32-bit systems) or much further (64-bit systems)
- **Timezone**: Always in UTC, making it timezone-independent

## Why Unix Timestamps Matter

### 1. Universal Standard
Unix timestamps provide a universal way to represent time across different systems, programming languages, and databases. This standardization eliminates confusion when working with dates across different platforms.

### 2. Simplicity
Storing time as a single integer is much simpler than dealing with complex date formats, timezones, and locale-specific representations.

### 3. Efficiency
Comparing and sorting timestamps is extremely fast since they're just integers. This makes them perfect for database operations and time-based calculations.

### 4. Precision
Modern implementations can include milliseconds or even microseconds, providing high precision for time-sensitive applications.

## How to Convert Unix Timestamps

Converting between Unix timestamps and human-readable dates is a common task. Here are several methods:

### Using Our Online Tools

Our website offers several powerful conversion tools:

1. **[Unix Timestamp Converter](/timestamp-converter)** - Convert between Unix timestamps and readable dates
2. **[Epoch Converter](/epoch-converter)** - Advanced epoch time conversion with multiple formats
3. **[Unix Time to Date](/unix-time-to-date)** - Simple Unix time to date conversion

### Programming Examples

#### JavaScript
\`\`\`javascript
// Convert Unix timestamp to Date
const timestamp = 1703980800; // Example timestamp
const date = new Date(timestamp * 1000); // Multiply by 1000 for milliseconds
console.log(date.toISOString()); // 2023-12-31T00:00:00.000Z

// Convert Date to Unix timestamp
const now = new Date();
const unixTimestamp = Math.floor(now.getTime() / 1000);
console.log(unixTimestamp);
\`\`\`

#### Python
\`\`\`python
import datetime

# Convert Unix timestamp to datetime
timestamp = 1703980800
dt = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2023-12-31T00:00:00+00:00

# Convert datetime to Unix timestamp
now = datetime.datetime.now(datetime.timezone.utc)
unix_timestamp = int(now.timestamp())
print(unix_timestamp)
\`\`\`

#### PHP
\`\`\`php
// Convert Unix timestamp to date
$timestamp = 1703980800;
$date = date('Y-m-d H:i:s', $timestamp);
echo $date; // 2023-12-31 00:00:00

// Convert date to Unix timestamp
$unix_timestamp = time(); // Current timestamp
echo $unix_timestamp;
\`\`\`

## Common Use Cases

### 1. Database Storage
Most databases store timestamps in Unix format for efficiency and consistency.

### 2. API Responses
REST APIs often use Unix timestamps for date/time fields to ensure consistency across different clients.

### 3. Log Files
System logs frequently use Unix timestamps for precise time tracking.

### 4. Caching Systems
Cache expiration times are often set using Unix timestamps.

### 5. Session Management
Web applications use Unix timestamps to track session creation and expiration times.

## Best Practices

### 1. Always Use UTC
Store timestamps in UTC to avoid timezone confusion. Convert to local time only when displaying to users.

### 2. Consider Precision
Decide whether you need second, millisecond, or microsecond precision based on your use case.

### 3. Handle the Year 2038 Problem
On 32-bit systems, Unix timestamps will overflow on January 19, 2038. Plan for 64-bit systems or alternative solutions.

### 4. Validate Input
Always validate timestamp values to ensure they're within reasonable ranges.

### 5. Use Appropriate Data Types
Choose the right data type in your database (INT, BIGINT, TIMESTAMP) based on your precision needs.

## Advanced Topics

### Millisecond Timestamps
Some systems use milliseconds since the epoch instead of seconds:

\`\`\`javascript
const timestampMs = Date.now(); // Milliseconds since epoch
const timestampSeconds = Math.floor(timestampMs / 1000);
\`\`\`

### Timezone Considerations
While Unix timestamps are timezone-independent, displaying them requires timezone conversion:

\`\`\`javascript
const timestamp = 1703980800;
const date = new Date(timestamp * 1000);

// Display in different timezones
console.log(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
console.log(date.toLocaleString('en-US', { timeZone: 'Europe/London' }));
console.log(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
\`\`\`

### Leap Seconds
Unix time doesn't account for leap seconds, which can cause slight discrepancies with atomic time standards.

## Tools and Resources

### Online Converters
- **[Our Timestamp Converter](/timestamp-converter)** - Full-featured conversion tool
- **[Epoch Converter](/epoch-converter)** - Advanced epoch time utilities
- **[Unix Time to Date](/unix-time-to-date)** - Quick conversion tool

### Programming Libraries
- **JavaScript**: Built-in Date object
- **Python**: datetime module
- **PHP**: date() and time() functions
- **Java**: java.time package
- **C++**: chrono library

## Troubleshooting Common Issues

### 1. Incorrect Timezone Display
**Problem**: Timestamps showing wrong time  
**Solution**: Ensure you're converting from UTC to the correct local timezone

### 2. Millisecond vs Second Confusion
**Problem**: Dates showing as 1970 or far future  
**Solution**: Check if your timestamp is in seconds or milliseconds

### 3. 32-bit Overflow
**Problem**: Dates after 2038 showing as 1970  
**Solution**: Use 64-bit integers or upgrade your system

### 4. Leap Second Discrepancies
**Problem**: Slight time differences with atomic clocks  
**Solution**: Use specialized time libraries that handle leap seconds

## Future of Unix Timestamps

As we approach 2038, the computing world is gradually transitioning to 64-bit timestamps, which will extend the usable range far into the future. Modern systems and programming languages are already prepared for this transition.

## Conclusion

Unix timestamps are an essential part of modern computing, providing a simple, efficient, and universal way to represent time. Understanding how they work and how to use them effectively is crucial for any developer or system administrator.

Whether you're building web applications, managing databases, or working with APIs, mastering Unix timestamps will make your work more efficient and your systems more reliable.

For quick conversions and advanced timestamp operations, don't forget to bookmark our [timestamp conversion tools](/timestamp-converter) and explore our other utilities for working with time and dates.

---

*Need to convert timestamps quickly? Try our [Unix Timestamp Converter](/timestamp-converter) or explore our other time-related tools. Have questions about timestamps? Feel free to reach out to our team.*
`
}

async function updateBlogImagesAndContent() {
  try {
    console.log('🎨 Updating blog posts with unique images and improved content...')

    // Get all blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug')

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    console.log(`📝 Found ${posts.length} posts to update`)

    for (const post of posts) {
      const imageData = postImages[post.slug]
      const newContent = improvedContent[post.slug]
      
      if (imageData) {
        console.log(`🖼️  Updating image for: ${post.title}`)
        
        const updateData = {
          featured_image_url: imageData.image
        }
        
        // Add improved content if available
        if (newContent) {
          updateData.content = newContent
          console.log(`📝 Also updating content for: ${post.title}`)
        }
        
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', post.id)

        if (updateError) {
          console.error(`❌ Failed to update ${post.title}:`, updateError.message)
        } else {
          console.log(`✅ Updated: ${post.title}`)
          console.log(`   🖼️  New image: ${imageData.image}`)
        }
      } else {
        console.log(`⏭️  No specific image found for: ${post.slug}`)
      }
    }

    console.log('\n🎉 Blog posts update completed!')
    console.log('\n📋 Summary:')
    console.log('- Each post now has a unique, relevant featured image')
    console.log('- Content formatting has been improved for better readability')
    console.log('- Images are from Unsplash with proper dimensions (1200x630)')
    console.log('- All images are optimized for social media sharing')

  } catch (error) {
    console.error('❌ Error updating blog posts:', error.message)
    process.exit(1)
  }
}

updateBlogImagesAndContent()
