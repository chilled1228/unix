-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('blog-images', 'blog-images', true),
('user-avatars', 'user-avatars', true);

-- Blog Images Storage Policies
-- Anyone can view blog images (public bucket)
CREATE POLICY "Anyone can view blog images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

-- Authors can upload blog images
CREATE POLICY "Authors can upload blog images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' AND
        auth.uid()::text = (storage.foldername(name))[1] AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author')
        )
    );

-- Users can update their own blog images, admins can update any
CREATE POLICY "Users can update own blog images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog-images' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

-- Users can delete their own blog images, admins can delete any
CREATE POLICY "Users can delete own blog images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

-- User Avatars Storage Policies
-- Anyone can view user avatars (public bucket)
CREATE POLICY "Anyone can view user avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create a function to get the public URL for a storage object
CREATE OR REPLACE FUNCTION get_storage_public_url(bucket_name text, file_path text)
RETURNS text AS $$
BEGIN
    RETURN concat(
        current_setting('app.settings.supabase_url', true),
        '/storage/v1/object/public/',
        bucket_name,
        '/',
        file_path
    );
END;
$$ LANGUAGE plpgsql;
