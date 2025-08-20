#!/usr/bin/env node

/**
 * Script to create a comprehensive blog post for Unix Timestamp Converter
 * This script creates a blog post with proper SEO optimization and internal linking
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Blog post content with SEO optimization and internal linking
const blogPost = {
  title: "The Complete Guide to Unix Timestamps: Everything You Need to Know in 2024",
  slug: "complete-guide-unix-timestamps-2024",
  excerpt: "Master Unix timestamps with our comprehensive guide. Learn what they are, how they work, and discover the best tools and techniques for converting between Unix time and human-readable dates.",
  meta_title: "Unix Timestamp Guide 2024: Complete Tutorial & Best Practices",
  meta_description: "Learn everything about Unix timestamps in 2024. Complete guide with examples, conversion tools, best practices, and common use cases for developers and system administrators.",
  content: `
# The Complete Guide to Unix Timestamps: Everything You Need to Know in 2024

Unix timestamps are fundamental to modern computing, serving as the backbone for time representation across systems, databases, and applications worldwide. Whether you're a developer, system administrator, or just curious about how computers handle time, this comprehensive guide will teach you everything you need to know about Unix timestamps.

## What is a Unix Timestamp?

A Unix timestamp (also known as Unix time, POSIX time, or Epoch time) is a system for describing a point in time. It represents the number of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC (Coordinated Universal Time), not counting leap seconds.

### Key Characteristics:
- **Origin**: January 1, 1970, 00:00:00 UTC (the "Unix Epoch")
- **Format**: Integer representing seconds since the epoch
- **Range**: Can represent dates from 1970 to 2038 (32-bit systems) or much further (64-bit systems)
- **Timezone**: Always in UTC, making it timezone-independent

## Why Unix Timestamps Matter

### 1. **Universal Standard**
Unix timestamps provide a universal way to represent time across different systems, programming languages, and databases. This standardization eliminates confusion when working with dates across different platforms.

### 2. **Simplicity**
Storing time as a single integer is much simpler than dealing with complex date formats, timezones, and locale-specific representations.

### 3. **Efficiency**
Comparing and sorting timestamps is extremely fast since they're just integers. This makes them perfect for database operations and time-based calculations.

### 4. **Precision**
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

### 1. **Database Storage**
Most databases store timestamps in Unix format for efficiency and consistency.

### 2. **API Responses**
REST APIs often use Unix timestamps for date/time fields to ensure consistency across different clients.

### 3. **Log Files**
System logs frequently use Unix timestamps for precise time tracking.

### 4. **Caching Systems**
Cache expiration times are often set using Unix timestamps.

### 5. **Session Management**
Web applications use Unix timestamps to track session creation and expiration times.

## Best Practices

### 1. **Always Use UTC**
Store timestamps in UTC to avoid timezone confusion. Convert to local time only when displaying to users.

### 2. **Consider Precision**
Decide whether you need second, millisecond, or microsecond precision based on your use case.

### 3. **Handle the Year 2038 Problem**
On 32-bit systems, Unix timestamps will overflow on January 19, 2038. Plan for 64-bit systems or alternative solutions.

### 4. **Validate Input**
Always validate timestamp values to ensure they're within reasonable ranges.

### 5. **Use Appropriate Data Types**
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

### 1. **Incorrect Timezone Display**
**Problem**: Timestamps showing wrong time
**Solution**: Ensure you're converting from UTC to the correct local timezone

### 2. **Millisecond vs Second Confusion**
**Problem**: Dates showing as 1970 or far future
**Solution**: Check if your timestamp is in seconds or milliseconds

### 3. **32-bit Overflow**
**Problem**: Dates after 2038 showing as 1970
**Solution**: Use 64-bit integers or upgrade your system

### 4. **Leap Second Discrepancies**
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
`,
  status: 'published',
  published_date: new Date().toISOString(),
  featured_image_url: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1755702481662-01s4t4e3yh9k-1755702477952_g4fyw3_chatgpt_image_aug_20.png'
}

// Categories and tags to create
const categories = [
  { name: 'Programming', slug: 'programming', description: 'Programming tutorials and guides' },
  { name: 'Web Development', slug: 'web-development', description: 'Web development tips and techniques' },
  { name: 'Tools', slug: 'tools', description: 'Useful tools and utilities' }
]

const tags = [
  { name: 'Unix', slug: 'unix' },
  { name: 'Timestamps', slug: 'timestamps' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Python', slug: 'python' },
  { name: 'PHP', slug: 'php' },
  { name: 'Tutorial', slug: 'tutorial' },
  { name: 'Guide', slug: 'guide' },
  { name: 'SEO', slug: 'seo' }
]

async function createBlogPost() {
  try {
    console.log('🚀 Starting blog post creation...')

    // Check if the database schema exists by trying to query user_profiles
    console.log('🔍 Checking database schema...')
    const { data: testQuery, error: schemaError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (schemaError) {
      console.log('❌ Database schema not found. Please set up the database first.')
      console.log('To set up the database:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Open the SQL Editor')
      console.log('3. Run the files in this order:')
      console.log('   - supabase/schema.sql')
      console.log('   - supabase/rls-policies.sql')
      console.log('   - supabase/storage-policies.sql')
      console.log('')
      console.log('After setting up the schema, create an admin user by:')
      console.log('1. Signing up through your application')
      console.log('2. Running this SQL in Supabase:')
      console.log('   UPDATE user_profiles SET role = \'admin\' WHERE email = \'your-email@example.com\';')
      return
    }

    // Check if we have an admin user
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')
      .limit(1)

    if (usersError) {
      console.log('❌ Database schema not properly set up.')
      console.log('Error:', usersError.message)
      console.log('')
      console.log('Please run the database setup files in your Supabase dashboard:')
      console.log('1. supabase/schema.sql')
      console.log('2. supabase/rls-policies.sql')
      console.log('3. supabase/storage-policies.sql')
      return
    }

    if (!users || users.length === 0) {
      console.log('❌ No admin user found. Please create an admin user first.')
      console.log('You can do this by:')
      console.log('1. Signing up through your application')
      console.log('2. Running this SQL in Supabase:')
      console.log('   UPDATE user_profiles SET role = \'admin\' WHERE email = \'your-email@example.com\';')
      return
    }

    const adminUser = users[0]
    console.log(`✅ Found admin user: ${adminUser.email}`)

    // Create categories
    console.log('📁 Creating categories...')
    const createdCategories = []
    for (const category of categories) {
      const { data: existingCategory } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('slug', category.slug)
        .single()

      if (existingCategory) {
        console.log(`   ↳ Category "${category.name}" already exists`)
        createdCategories.push(existingCategory)
      } else {
        const { data: newCategory, error } = await supabase
          .from('blog_categories')
          .insert(category)
          .select()
          .single()

        if (error) {
          console.error(`   ❌ Failed to create category "${category.name}":`, error.message)
        } else {
          console.log(`   ✅ Created category: ${category.name}`)
          createdCategories.push(newCategory)
        }
      }
    }

    // Create tags
    console.log('🏷️  Creating tags...')
    const createdTags = []
    for (const tag of tags) {
      const { data: existingTag } = await supabase
        .from('blog_tags')
        .select('*')
        .eq('slug', tag.slug)
        .single()

      if (existingTag) {
        console.log(`   ↳ Tag "${tag.name}" already exists`)
        createdTags.push(existingTag)
      } else {
        const { data: newTag, error } = await supabase
          .from('blog_tags')
          .insert(tag)
          .select()
          .single()

        if (error) {
          console.error(`   ❌ Failed to create tag "${tag.name}":`, error.message)
        } else {
          console.log(`   ✅ Created tag: ${tag.name}`)
          createdTags.push(newTag)
        }
      }
    }

    // Check if blog post already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('*')
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

    console.log(`✅ Created blog post: "${newPost.title}"`)

    // Associate with categories (first 2 categories)
    if (createdCategories.length > 0) {
      console.log('🔗 Linking categories...')
      const categoryLinks = createdCategories.slice(0, 2).map(category => ({
        post_id: newPost.id,
        category_id: category.id
      }))

      const { error: categoryError } = await supabase
        .from('blog_post_categories')
        .insert(categoryLinks)

      if (categoryError) {
        console.error('❌ Failed to link categories:', categoryError.message)
      } else {
        console.log(`   ✅ Linked ${categoryLinks.length} categories`)
      }
    }

    // Associate with tags (first 6 tags)
    if (createdTags.length > 0) {
      console.log('🏷️  Linking tags...')
      const tagLinks = createdTags.slice(0, 6).map(tag => ({
        post_id: newPost.id,
        tag_id: tag.id
      }))

      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(tagLinks)

      if (tagError) {
        console.error('❌ Failed to link tags:', tagError.message)
      } else {
        console.log(`   ✅ Linked ${tagLinks.length} tags`)
      }
    }

    console.log('\n🎉 Blog post creation completed successfully!')
    console.log(`📖 Post URL: /blog/${newPost.slug}`)
    console.log(`📊 Post ID: ${newPost.id}`)
    console.log(`👤 Author: ${adminUser.full_name || adminUser.email}`)
    console.log(`📅 Published: ${newPost.published_date}`)

  } catch (error) {
    console.error('❌ Error creating blog post:', error.message)
    process.exit(1)
  }
}

// Run the script
createBlogPost()
