-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can view all profiles (for author information)
CREATE POLICY "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert profiles (handled by trigger)
CREATE POLICY "Authenticated users can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Blog Posts Policies
-- Everyone can view published posts
CREATE POLICY "Anyone can view published posts" ON blog_posts
    FOR SELECT USING (
        status = 'published' OR 
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can create posts
CREATE POLICY "Authors can create posts" ON blog_posts
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author')
        )
    );

-- Authors can update their own posts, editors and admins can update any
CREATE POLICY "Authors can update own posts, editors/admins can update any" ON blog_posts
    FOR UPDATE USING (
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Only admins and editors can delete posts
CREATE POLICY "Admins and editors can delete posts" ON blog_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Blog Categories Policies
-- Everyone can view categories
CREATE POLICY "Anyone can view categories" ON blog_categories
    FOR SELECT USING (true);

-- Only admins and editors can manage categories
CREATE POLICY "Admins and editors can manage categories" ON blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Blog Tags Policies
-- Everyone can view tags
CREATE POLICY "Anyone can view tags" ON blog_tags
    FOR SELECT USING (true);

-- Authors can create tags, admins and editors can manage all
CREATE POLICY "Authors can create tags" ON blog_tags
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author')
        )
    );

CREATE POLICY "Admins and editors can update tags" ON blog_tags
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can delete tags" ON blog_tags
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Blog Media Policies
-- Everyone can view media (for public images)
CREATE POLICY "Anyone can view media" ON blog_media
    FOR SELECT USING (true);

-- Authors can upload media
CREATE POLICY "Authors can upload media" ON blog_media
    FOR INSERT WITH CHECK (
        auth.uid() = uploaded_by AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author')
        )
    );

-- Users can update their own uploads, admins can update any
CREATE POLICY "Users can update own uploads, admins can update any" ON blog_media
    FOR UPDATE USING (
        auth.uid() = uploaded_by OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can delete their own uploads, admins can delete any
CREATE POLICY "Users can delete own uploads, admins can delete any" ON blog_media
    FOR DELETE USING (
        auth.uid() = uploaded_by OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Blog Post Categories Junction Table Policies
-- Everyone can view post-category relationships
CREATE POLICY "Anyone can view post categories" ON blog_post_categories
    FOR SELECT USING (true);

-- Authors can manage their post categories, editors/admins can manage any
CREATE POLICY "Authors can manage own post categories" ON blog_post_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE id = post_id AND (
                author_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE id = auth.uid() AND role IN ('admin', 'editor')
                )
            )
        )
    );

-- Blog Post Tags Junction Table Policies
-- Everyone can view post-tag relationships
CREATE POLICY "Anyone can view post tags" ON blog_post_tags
    FOR SELECT USING (true);

-- Authors can manage their post tags, editors/admins can manage any
CREATE POLICY "Authors can manage own post tags" ON blog_post_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE id = post_id AND (
                author_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE id = auth.uid() AND role IN ('admin', 'editor')
                )
            )
        )
    );

-- Create a function to check if user has required role
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = required_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has any of the required roles
CREATE OR REPLACE FUNCTION has_any_role(required_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = ANY(required_roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
