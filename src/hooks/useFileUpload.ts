import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File, 
    bucket: string = 'documents',
    folder?: string
  ): Promise<UploadResult> => {
    try {
      setUploading(true);
      setProgress(0);

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
      const fileName = folder 
        ? `${folder}/${timestamp}-${sanitizedName}`
        : `${timestamp}-${sanitizedName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL if bucket is public, otherwise return the path
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProgress(100);
      
      toast({
        title: "Upload Complete",
        description: `${file.name} uploaded successfully`
      });

      return {
        success: true,
        path: data.path,
        url: urlData.publicUrl
      };

    } catch (error: any) {
      console.error('Upload error:', error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });

      return {
        success: false,
        error: error.message
      };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleFiles = async (
    files: File[],
    bucket: string = 'documents',
    folder?: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress((i / files.length) * 100);
      
      const result = await uploadFile(file, bucket, folder);
      results.push(result);
    }
    
    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    progress
  };
};