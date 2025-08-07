-- Make the documents bucket public for chapter cover images
UPDATE storage.buckets
SET public = TRUE
WHERE id = 'documents';

-- Policy so anyone can read objects in the documents bucket  
CREATE POLICY "Public read on documents bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');