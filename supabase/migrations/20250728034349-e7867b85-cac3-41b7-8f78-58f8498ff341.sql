-- Fix database function search paths for security
-- This prevents search path attacks on SECURITY DEFINER functions

-- 1. Fix get_character_profile_user_id function
ALTER FUNCTION public.get_character_profile_user_id(uuid) SET search_path = '';

-- 2. Fix has_role function  
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = '';

-- 3. Fix get_story_user_id function
ALTER FUNCTION public.get_story_user_id(uuid) SET search_path = '';

-- 4. Fix update_story_word_count function
ALTER FUNCTION public.update_story_word_count() SET search_path = '';

-- 5. Fix get_chapter_user_id function
ALTER FUNCTION public.get_chapter_user_id(uuid) SET search_path = '';

-- 6. Fix get_current_user_role function
ALTER FUNCTION public.get_current_user_role() SET search_path = '';

-- 7. Fix handle_new_user function
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- 8. Fix get_character_user_id function
ALTER FUNCTION public.get_character_user_id(uuid) SET search_path = '';

-- 9. Fix update_updated_at_column function
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Add comprehensive storage security policies
-- Create policies for shiver bucket (private bucket)
CREATE POLICY "Users can view their own files in shiver bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'shiver' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files to shiver bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shiver' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files in shiver bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'shiver' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files in shiver bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'shiver' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for documents bucket (public bucket)
CREATE POLICY "Anyone can view files in documents bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload to documents bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own files in documents bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files in documents bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add file size and type restrictions to buckets
UPDATE storage.buckets 
SET file_size_limit = 52428800, -- 50MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/json']
WHERE id = 'shiver';

UPDATE storage.buckets 
SET file_size_limit = 10485760, -- 10MB limit for public bucket
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'application/json']
WHERE id = 'documents';