import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, AlertTriangle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface SecureFileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  allowedTypes?: string[] | 'all';
  onFilesSelected?: (files: File[]) => void;
  onFilesUploaded?: (results: Array<{success: boolean; path?: string; url?: string; error?: string}>) => void;
  disabled?: boolean;
  uploadToStorage?: boolean;
  storageBucket?: string;
  storageFolder?: string;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  accept = '*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  allowedTypes = 'all',
  onFilesSelected,
  onFilesUploaded,
  disabled = false,
  uploadToStorage = false,
  storageBucket = 'documents',
  storageFolder
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { uploadMultipleFiles, uploading, progress } = useFileUpload();

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`;
    }

    // Check file type (only if specific types are restricted)
    if (allowedTypes !== 'all' && Array.isArray(allowedTypes) && !allowedTypes.includes(file.type)) {
      return `File "${file.name}" has an unsupported type. Allowed types: ${allowedTypes.join(', ')}.`;
    }

    // Check file name for security
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    if (sanitizedName !== file.name) {
      return `File "${file.name}" contains invalid characters. Only letters, numbers, dots, hyphens, and underscores are allowed.`;
    }

    // Allow all file types - removed suspicious extension check

    return null;
  }, [maxSize, allowedTypes]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Check total number of files
    if (selectedFiles.length + fileArray.length > maxFiles) {
      newErrors.push(`Cannot upload more than ${maxFiles} files total.`);
      setErrors(newErrors);
      return;
    }

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(updatedFiles);
    setErrors([]);
    
    if (onFilesSelected) {
      onFilesSelected(updatedFiles);
    }

    // Upload to storage if enabled
    if (uploadToStorage && validFiles.length > 0) {
      try {
        const uploadResults = await uploadMultipleFiles(validFiles, storageBucket, storageFolder);
        if (onFilesUploaded) {
          onFilesUploaded(uploadResults);
        }
      } catch (error) {
        setErrors(['Failed to upload files to storage']);
      }
    }
  }, [selectedFiles, validateFile, maxFiles, onFilesSelected, onFilesUploaded, uploadToStorage, uploadMultipleFiles, storageBucket, storageFolder]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles, disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setErrors([]);
    
    if (onFilesSelected) {
      onFilesSelected(updatedFiles);
    }
  }, [selectedFiles, onFilesSelected]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-accent bg-accent/5' : 'border-border'
      } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading Files...' : 'Upload Files'}
          </CardTitle>
          <CardDescription>
            {uploading ? `Uploading ${Math.round(progress)}%...` : 'Drag and drop files here, or click to select files'}
          </CardDescription>
        </CardHeader>
        <CardContent
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled || uploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="block">
            <div className="text-center py-8">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Maximum {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept === '*' ? 'All file types supported' : `Supported formats: ${accept.split(',').join(', ')}`}
              </p>
              {uploadToStorage && (
                <p className="text-xs text-accent mt-1">
                  Files will be uploaded to secure storage
                </p>
              )}
            </div>
          </label>
        </CardContent>
      </Card>

      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading files...</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Files ({selectedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={disabled || uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};