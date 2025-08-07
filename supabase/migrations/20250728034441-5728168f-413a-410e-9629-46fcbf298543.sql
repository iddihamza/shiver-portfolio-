-- Add missing storage security policies
-- First, check if policies exist and create only missing ones

DO $$
BEGIN
    -- Create policy for shiver bucket SELECT if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can view their own files in shiver bucket'
    ) THEN
        CREATE POLICY "Users can view their own files in shiver bucket"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'shiver' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    -- Create policy for shiver bucket INSERT if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can upload their own files to shiver bucket'
    ) THEN
        CREATE POLICY "Users can upload their own files to shiver bucket"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'shiver' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    -- Create policy for documents bucket SELECT if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Anyone can view files in documents bucket'
    ) THEN
        CREATE POLICY "Anyone can view files in documents bucket"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'documents');
    END IF;

    -- Create policy for documents bucket INSERT if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload to documents bucket'
    ) THEN
        CREATE POLICY "Authenticated users can upload to documents bucket"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Add file size and type restrictions to buckets
UPDATE storage.buckets 
SET file_size_limit = 52428800, -- 50MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/json']
WHERE id = 'shiver';

UPDATE storage.buckets 
SET file_size_limit = 10485760, -- 10MB limit for public bucket
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'application/json']
WHERE id = 'documents';