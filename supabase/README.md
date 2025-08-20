# Supabase Blog Management Setup

This directory contains all the SQL files needed to set up the blog management system in Supabase.

## Setup Instructions

### 1. Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Wait for the project to be fully initialized

### 2. Configure Environment Variables

Copy the project URL and anon key from your Supabase project settings and update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Database Schema

In the Supabase SQL Editor, run the following files in order:

1. **schema.sql** - Creates all tables, indexes, triggers, and default data
2. **rls-policies.sql** - Sets up Row Level Security policies
3. **storage-policies.sql** - Configures storage buckets and policies

### 4. Enable Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable the authentication providers you want to use
3. Configure redirect URLs for your application

### 5. Create First Admin User

After running the schema, you'll need to create your first admin user:

1. Sign up through your application
2. Go to the Supabase dashboard > Authentication > Users
3. Find your user and note the UUID
4. In the SQL Editor, run:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = 'your-user-uuid-here';
```

## Database Schema Overview

### Tables

- **user_profiles** - Extended user information with roles
- **blog_posts** - Main blog posts table
- **blog_categories** - Post categories
- **blog_tags** - Post tags
- **blog_media** - Uploaded media files
- **blog_post_categories** - Many-to-many relationship between posts and categories
- **blog_post_tags** - Many-to-many relationship between posts and tags

### User Roles

- **admin** - Full access to everything
- **editor** - Can manage all posts and categories
- **author** - Can create and edit their own posts
- **user** - Read-only access (default)

### Post Statuses

- **draft** - Not published, only visible to author and editors
- **published** - Public and visible to everyone
- **archived** - Hidden from public but accessible to editors

### Storage Buckets

- **blog-images** - For blog post images and media
- **user-avatars** - For user profile pictures

## Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure file upload policies
- Automatic user profile creation on signup
- Protected admin and editor functions

## Automatic Features

- **Updated timestamps** - Automatically updated on record changes
- **Published date** - Set automatically when post status changes to published
- **Reading time** - Calculated automatically based on content length
- **Slug validation** - Ensures unique slugs for posts and categories
- **Full-text search** - Enabled on post titles, content, and excerpts

## Indexes

The schema includes optimized indexes for:
- Fast post queries by status, author, and date
- Full-text search capabilities
- Efficient category and tag lookups
- Performance-optimized joins

## Triggers

- **update_updated_at** - Updates the updated_at timestamp
- **set_published_date** - Manages published_date based on status changes
- **calculate_reading_time** - Calculates estimated reading time
- **create_user_profile** - Creates profile when user signs up
