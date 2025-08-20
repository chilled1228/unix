#!/usr/bin/env node

/**
 * Script to create additional blog posts for the Unix Timestamp Converter site
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

const additionalPosts = [
  {
    title: "JavaScript Date and Time: Working with Unix Timestamps",
    slug: "javascript-date-time-unix-timestamps",
    excerpt: "Learn how to work with Unix timestamps in JavaScript, including conversion methods, timezone handling, and best practices for modern web development.",
    meta_title: "JavaScript Unix Timestamps: Complete Guide with Examples",
    meta_description: "Master Unix timestamps in JavaScript. Learn Date object methods, timezone conversion, and best practices with practical examples and code snippets.",
    content: `
# JavaScript Date and Time: Working with Unix Timestamps

JavaScript provides powerful built-in capabilities for working with dates and times, including Unix timestamps. This guide will show you everything you need to know about handling timestamps in JavaScript.

## Understanding JavaScript Date Object

The JavaScript Date object is your primary tool for working with timestamps:

\`\`\`javascript
// Current timestamp in milliseconds
const now = Date.now();
console.log(now); // 1703980800000

// Current timestamp in seconds (Unix format)
const unixTimestamp = Math.floor(Date.now() / 1000);
console.log(unixTimestamp); // 1703980800
\`\`\`

## Converting Unix Timestamps to Dates

### From Seconds to Date
\`\`\`javascript
const timestamp = 1703980800; // Unix timestamp in seconds
const date = new Date(timestamp * 1000); // Convert to milliseconds
console.log(date.toISOString()); // 2023-12-31T00:00:00.000Z
\`\`\`

### From Milliseconds to Date
\`\`\`javascript
const timestampMs = 1703980800000; // Unix timestamp in milliseconds
const date = new Date(timestampMs);
console.log(date.toString()); // Sun Dec 31 2023 00:00:00 GMT+0000 (UTC)
\`\`\`

## Formatting Dates

### Using toLocaleString()
\`\`\`javascript
const date = new Date(1703980800 * 1000);

// Different locales
console.log(date.toLocaleString('en-US')); // 12/31/2023, 12:00:00 AM
console.log(date.toLocaleString('en-GB')); // 31/12/2023, 00:00:00
console.log(date.toLocaleString('de-DE')); // 31.12.2023, 00:00:00
\`\`\`

### Custom Formatting
\`\`\`javascript
const date = new Date(1703980800 * 1000);

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
};

console.log(date.toLocaleString('en-US', options));
// December 31, 2023 at 12:00 AM UTC
\`\`\`

## Timezone Handling

### Converting to Different Timezones
\`\`\`javascript
const timestamp = 1703980800;
const date = new Date(timestamp * 1000);

// Display in different timezones
console.log(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
console.log(date.toLocaleString('en-US', { timeZone: 'Europe/London' }));
console.log(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
\`\`\`

## Practical Examples

### Age Calculator
\`\`\`javascript
function calculateAge(birthTimestamp) {
  const birth = new Date(birthTimestamp * 1000);
  const now = new Date();
  const ageMs = now - birth;
  const ageYears = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365.25));
  return ageYears;
}

const birthTimestamp = 631152000; // January 1, 1990
console.log(\`Age: \${calculateAge(birthTimestamp)} years\`);
\`\`\`

### Time Difference Calculator
\`\`\`javascript
function timeDifference(timestamp1, timestamp2) {
  const diff = Math.abs(timestamp1 - timestamp2);
  const days = Math.floor(diff / (24 * 60 * 60));
  const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);
  
  return \`\${days} days, \${hours} hours, \${minutes} minutes\`;
}

const start = 1703980800;
const end = 1704067200;
console.log(timeDifference(start, end));
\`\`\`

## Best Practices

1. **Always use UTC for storage**: Store timestamps in UTC and convert to local time for display
2. **Handle timezone conversions carefully**: Use proper timezone identifiers
3. **Validate timestamps**: Check for reasonable ranges
4. **Use libraries for complex operations**: Consider date-fns or moment.js for advanced features

For quick timestamp conversions, use our [JavaScript Timestamp Converter](/timestamp-converter) tool.
`,
    status: 'published',
    published_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    featured_image_url: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1755702481662-01s4t4e3yh9k-1755702477952_g4fyw3_chatgpt_image_aug_20.png'
  },
  {
    title: "Python DateTime and Unix Timestamps: A Developer's Guide",
    slug: "python-datetime-unix-timestamps-guide",
    excerpt: "Comprehensive guide to working with Unix timestamps in Python using datetime, time, and other essential modules for date and time manipulation.",
    meta_title: "Python Unix Timestamps: DateTime Module Guide & Examples",
    meta_description: "Master Unix timestamps in Python with datetime module. Learn conversion methods, timezone handling, and best practices with practical code examples.",
    content: `
# Python DateTime and Unix Timestamps: A Developer's Guide

Python provides excellent support for working with dates, times, and Unix timestamps through its built-in modules. This guide covers everything you need to know.

## Essential Python Modules

### datetime Module
\`\`\`python
import datetime

# Current datetime
now = datetime.datetime.now()
print(now)  # 2023-12-31 12:00:00.123456

# UTC datetime
utc_now = datetime.datetime.now(datetime.timezone.utc)
print(utc_now)  # 2023-12-31 12:00:00.123456+00:00
\`\`\`

### time Module
\`\`\`python
import time

# Current Unix timestamp
timestamp = time.time()
print(timestamp)  # 1703980800.123456
\`\`\`

## Converting Unix Timestamps

### From Unix Timestamp to DateTime
\`\`\`python
import datetime

timestamp = 1703980800
dt = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
print(dt)  # 2023-12-31 00:00:00+00:00

# Local timezone
local_dt = datetime.datetime.fromtimestamp(timestamp)
print(local_dt)  # 2023-12-31 01:00:00 (if in CET)
\`\`\`

### From DateTime to Unix Timestamp
\`\`\`python
import datetime

dt = datetime.datetime(2023, 12, 31, 0, 0, 0, tzinfo=datetime.timezone.utc)
timestamp = int(dt.timestamp())
print(timestamp)  # 1703980800
\`\`\`

## Working with Timezones

### Using pytz (Third-party)
\`\`\`python
import datetime
import pytz

# Create timezone-aware datetime
utc = pytz.UTC
eastern = pytz.timezone('US/Eastern')

utc_dt = datetime.datetime(2023, 12, 31, 0, 0, 0, tzinfo=utc)
eastern_dt = utc_dt.astimezone(eastern)

print(f"UTC: {utc_dt}")
print(f"Eastern: {eastern_dt}")
\`\`\`

### Using zoneinfo (Python 3.9+)
\`\`\`python
import datetime
from zoneinfo import ZoneInfo

# Create timezone-aware datetime
utc_dt = datetime.datetime(2023, 12, 31, 0, 0, 0, tzinfo=ZoneInfo('UTC'))
tokyo_dt = utc_dt.astimezone(ZoneInfo('Asia/Tokyo'))

print(f"UTC: {utc_dt}")
print(f"Tokyo: {tokyo_dt}")
\`\`\`

## Formatting and Parsing

### Formatting DateTime
\`\`\`python
import datetime

dt = datetime.datetime(2023, 12, 31, 15, 30, 45)

# Different formats
print(dt.strftime('%Y-%m-%d'))           # 2023-12-31
print(dt.strftime('%B %d, %Y'))          # December 31, 2023
print(dt.strftime('%Y-%m-%d %H:%M:%S'))  # 2023-12-31 15:30:45
\`\`\`

### Parsing Strings
\`\`\`python
import datetime

date_string = "2023-12-31 15:30:45"
dt = datetime.datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S')
print(dt)  # 2023-12-31 15:30:45
\`\`\`

## Practical Examples

### Date Range Generator
\`\`\`python
import datetime

def date_range(start_date, end_date):
    current = start_date
    while current <= end_date:
        yield current
        current += datetime.timedelta(days=1)

start = datetime.date(2023, 12, 1)
end = datetime.date(2023, 12, 31)

for date in date_range(start, end):
    print(date.strftime('%Y-%m-%d'))
\`\`\`

### Age Calculator
\`\`\`python
import datetime

def calculate_age(birth_timestamp):
    birth_date = datetime.datetime.fromtimestamp(birth_timestamp)
    today = datetime.datetime.now()
    age = today - birth_date
    return age.days // 365

birth_timestamp = 631152000  # January 1, 1990
print(f"Age: {calculate_age(birth_timestamp)} years")
\`\`\`

## Best Practices

1. **Always use timezone-aware datetimes** for production applications
2. **Store timestamps in UTC** and convert for display
3. **Use appropriate precision** (seconds vs milliseconds)
4. **Validate input timestamps** for reasonable ranges
5. **Consider using libraries** like pendulum for advanced features

For quick Python timestamp conversions, try our [Python Timestamp Tools](/timestamp-converter).
`,
    status: 'published',
    published_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    featured_image_url: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1755702481662-01s4t4e3yh9k-1755702477952_g4fyw3_chatgpt_image_aug_20.png'
  }
];

async function createAdditionalPosts() {
  try {
    console.log('🚀 Creating additional blog posts...');

    // Get admin user
    const { data: users } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')
      .limit(1);

    if (!users || users.length === 0) {
      console.log('❌ No admin user found');
      return;
    }

    const adminUser = users[0];
    console.log(`✅ Found admin user: ${adminUser.email}`);

    // Get categories and tags
    const { data: categories } = await supabase.from('blog_categories').select('*');
    const { data: tags } = await supabase.from('blog_tags').select('*');

    for (const post of additionalPosts) {
      // Check if post already exists
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', post.slug)
        .single();

      if (existingPost) {
        console.log(`⏭️  Post "${post.title}" already exists, skipping...`);
        continue;
      }

      // Create the post
      const { data: newPost, error } = await supabase
        .from('blog_posts')
        .insert({
          ...post,
          author_id: adminUser.id
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create post "${post.title}":`, error.message);
        continue;
      }

      console.log(`✅ Created post: "${newPost.title}"`);

      // Add categories (Programming and Tutorials)
      if (categories && categories.length > 0) {
        const relevantCategories = categories.filter(c => 
          ['programming', 'tutorials', 'technology'].includes(c.slug)
        ).slice(0, 2);

        if (relevantCategories.length > 0) {
          const categoryLinks = relevantCategories.map(category => ({
            post_id: newPost.id,
            category_id: category.id
          }));

          await supabase.from('blog_post_categories').insert(categoryLinks);
          console.log(`   🔗 Linked ${categoryLinks.length} categories`);
        }
      }

      // Add tags
      if (tags && tags.length > 0) {
        const relevantTags = tags.filter(t => 
          ['javascript', 'python', 'tutorial', 'guide', 'web-development'].includes(t.slug)
        ).slice(0, 4);

        if (relevantTags.length > 0) {
          const tagLinks = relevantTags.map(tag => ({
            post_id: newPost.id,
            tag_id: tag.id
          }));

          await supabase.from('blog_post_tags').insert(tagLinks);
          console.log(`   🏷️  Linked ${tagLinks.length} tags`);
        }
      }
    }

    console.log('\n🎉 Additional blog posts creation completed!');

  } catch (error) {
    console.error('❌ Error creating additional posts:', error.message);
    process.exit(1);
  }
}

createAdditionalPosts();
