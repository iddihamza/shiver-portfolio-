-- Allow anonymous read access to chapter cover images

-- Mark the documents bucket as public
UPDATE storage.buckets
SET public = TRUE
WHERE id = 'documents';

-- Policy so anyone can read objects in the documents bucket
CREATE POLICY "Public read on documents bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');
