-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'user');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Blog categories table
CREATE TABLE blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Blog tags table
CREATE TABLE blog_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Blog media table
CREATE TABLE blog_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Blog posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    slug TEXT NOT NULL UNIQUE,
    status post_status DEFAULT 'draft' NOT NULL,
    featured_image_url TEXT,
    author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL NOT NULL,
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    reading_time INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0 NOT NULL
);

-- Junction table for post categories (many-to-many)
CREATE TABLE blog_post_categories (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (post_id, category_id)
);

-- Junction table for post tags (many-to-many)
CREATE TABLE blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_view_count ON blog_posts(view_count DESC);

-- Full-text search indexes
CREATE INDEX idx_blog_posts_title_search ON blog_posts USING gin(to_tsvector('english', title));
CREATE INDEX idx_blog_posts_content_search ON blog_posts USING gin(to_tsvector('english', content));
CREATE INDEX idx_blog_posts_excerpt_search ON blog_posts USING gin(to_tsvector('english', excerpt));

-- Trigram indexes for fuzzy search
CREATE INDEX idx_blog_posts_title_trgm ON blog_posts USING gin(title gin_trgm_ops);
CREATE INDEX idx_blog_categories_name_trgm ON blog_categories USING gin(name gin_trgm_ops);
CREATE INDEX idx_blog_tags_name_trgm ON blog_tags USING gin(name gin_trgm_ops);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_tags_updated_at BEFORE UPDATE ON blog_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_media_updated_at BEFORE UPDATE ON blog_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set published_date when status changes to published
CREATE OR REPLACE FUNCTION set_published_date()
RETURNS TRIGGER AS $$
BEGIN
    -- If status is changing to published and published_date is null, set it to now
    IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_date IS NULL THEN
        NEW.published_date = NOW();
    END IF;
    
    -- If status is changing from published to draft, clear published_date
    IF NEW.status != 'published' AND OLD.status = 'published' THEN
        NEW.published_date = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_blog_post_published_date BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_published_date();

-- Function to calculate reading time based on content
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
DECLARE
    word_count INTEGER;
    words_per_minute INTEGER := 200;
BEGIN
    -- Count words in content (rough estimate)
    word_count := array_length(string_to_array(regexp_replace(NEW.content, '<[^>]*>', '', 'g'), ' '), 1);
    
    -- Calculate reading time in minutes (minimum 1 minute)
    NEW.reading_time := GREATEST(1, CEIL(word_count::FLOAT / words_per_minute));
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_blog_post_reading_time BEFORE INSERT OR UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION calculate_reading_time();

-- Function to create user profile when user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_profile_trigger AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Insert some default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Technology', 'technology', 'Posts about technology, programming, and development', '#3b82f6'),
('Tutorials', 'tutorials', 'Step-by-step guides and tutorials', '#10b981'),
('News', 'news', 'Latest news and updates', '#f59e0b'),
('Tips & Tricks', 'tips-tricks', 'Helpful tips and tricks', '#8b5cf6');

-- Insert some default tags
INSERT INTO blog_tags (name, slug) VALUES
('JavaScript', 'javascript'),
('TypeScript', 'typescript'),
('React', 'react'),
('Next.js', 'nextjs'),
('Supabase', 'supabase'),
('Web Development', 'web-development'),
('Tutorial', 'tutorial'),
('Beginner', 'beginner'),
('Advanced', 'advanced'),
('Best Practices', 'best-practices');

-- Function to increment post view count
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts
    SET view_count = view_count + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get posts by category
CREATE OR REPLACE FUNCTION get_posts_by_category(category_slug TEXT, post_limit INTEGER DEFAULT 10, post_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    slug TEXT,
    status post_status,
    featured_image_url TEXT,
    author_id UUID,
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    meta_title TEXT,
    meta_description TEXT,
    reading_time INTEGER,
    view_count INTEGER,
    author_name TEXT,
    author_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.content,
        p.excerpt,
        p.slug,
        p.status,
        p.featured_image_url,
        p.author_id,
        p.published_date,
        p.created_at,
        p.updated_at,
        p.meta_title,
        p.meta_description,
        p.reading_time,
        p.view_count,
        u.full_name as author_name,
        u.email as author_email
    FROM blog_posts p
    JOIN user_profiles u ON p.author_id = u.id
    JOIN blog_post_categories pc ON p.id = pc.post_id
    JOIN blog_categories c ON pc.category_id = c.id
    WHERE c.slug = category_slug
    AND p.status = 'published'
    ORDER BY p.published_date DESC
    LIMIT post_limit
    OFFSET post_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get posts by tag
CREATE OR REPLACE FUNCTION get_posts_by_tag(tag_slug TEXT, post_limit INTEGER DEFAULT 10, post_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    slug TEXT,
    status post_status,
    featured_image_url TEXT,
    author_id UUID,
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    meta_title TEXT,
    meta_description TEXT,
    reading_time INTEGER,
    view_count INTEGER,
    author_name TEXT,
    author_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.content,
        p.excerpt,
        p.slug,
        p.status,
        p.featured_image_url,
        p.author_id,
        p.published_date,
        p.created_at,
        p.updated_at,
        p.meta_title,
        p.meta_description,
        p.reading_time,
        p.view_count,
        u.full_name as author_name,
        u.email as author_email
    FROM blog_posts p
    JOIN user_profiles u ON p.author_id = u.id
    JOIN blog_post_tags pt ON p.id = pt.post_id
    JOIN blog_tags t ON pt.tag_id = t.id
    WHERE t.slug = tag_slug
    AND p.status = 'published'
    ORDER BY p.published_date DESC
    LIMIT post_limit
    OFFSET post_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to search posts
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT, post_limit INTEGER DEFAULT 10, post_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    slug TEXT,
    status post_status,
    featured_image_url TEXT,
    author_id UUID,
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    meta_title TEXT,
    meta_description TEXT,
    reading_time INTEGER,
    view_count INTEGER,
    author_name TEXT,
    author_email TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.content,
        p.excerpt,
        p.slug,
        p.status,
        p.featured_image_url,
        p.author_id,
        p.published_date,
        p.created_at,
        p.updated_at,
        p.meta_title,
        p.meta_description,
        p.reading_time,
        p.view_count,
        u.full_name as author_name,
        u.email as author_email,
        ts_rank(
            to_tsvector('english', p.title || ' ' || p.content || ' ' || COALESCE(p.excerpt, '')),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM blog_posts p
    JOIN user_profiles u ON p.author_id = u.id
    WHERE p.status = 'published'
    AND (
        to_tsvector('english', p.title || ' ' || p.content || ' ' || COALESCE(p.excerpt, '')) @@ plainto_tsquery('english', search_query)
        OR p.title ILIKE '%' || search_query || '%'
        OR p.content ILIKE '%' || search_query || '%'
        OR p.excerpt ILIKE '%' || search_query || '%'
    )
    ORDER BY rank DESC, p.published_date DESC
    LIMIT post_limit
    OFFSET post_offset;
END;
$$ LANGUAGE plpgsql;
