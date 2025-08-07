-- Create storage policies for chapter cover uploads
-- Allow users to upload files to the documents bucket
CREATE POLICY "Users can upload files to documents bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to view files in documents bucket (needed for cover image display)
CREATE POLICY "Users can view files in documents bucket" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to update their own files in documents bucket
CREATE POLICY "Users can update their own files in documents bucket" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files in documents bucket
CREATE POLICY "Users can delete their own files in documents bucket" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);