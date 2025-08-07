import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  File, Download, Trash2, Search, Filter, Eye, 
  FileText, FileImage, FileVideo, FileCode, Folder
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface StoredFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  bucket: string;
  path: string;
  url?: string;
}

export const FileManager = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      
      // List files from the documents bucket
      const { data: storageFiles, error } = await supabase.storage
        .from('documents')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      // Convert storage files to our format
      const formattedFiles: StoredFile[] = storageFiles?.map(file => ({
        id: file.id || file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        mimeType: file.metadata?.mimetype || 'unknown',
        uploadedAt: file.created_at || new Date().toISOString(),
        bucket: 'documents',
        path: file.name,
      })) || [];

      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (file: StoredFile) => {
    try {
      const { error } = await supabase.storage
        .from(file.bucket)
        .remove([file.path]);

      if (error) {
        throw error;
      }

      setFiles(prev => prev.filter(f => f.id !== file.id));
      toast({
        title: "Success",
        description: `${file.name} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (file: StoredFile) => {
    try {
      const { data, error } = await supabase.storage
        .from(file.bucket)
        .download(file.path);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${file.name} downloaded successfully`
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <FileVideo className="w-4 h-4" />;
    if (mimeType.includes('json') || mimeType.includes('javascript')) return <FileCode className="w-4 h-4" />;
    if (mimeType.includes('text') || mimeType.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeFilter = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('json') || mimeType.includes('javascript')) return 'code';
    if (mimeType.includes('text') || mimeType.includes('document')) return 'document';
    return 'other';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || getFileTypeFilter(file.mimeType) === filter;
    return matchesSearch && matchesFilter;
  });

  const fileTypeStats = {
    total: files.length,
    images: files.filter(f => f.mimeType.startsWith('image/')).length,
    videos: files.filter(f => f.mimeType.startsWith('video/')).length,
    documents: files.filter(f => f.mimeType.includes('text') || f.mimeType.includes('document')).length,
    code: files.filter(f => f.mimeType.includes('json') || f.mimeType.includes('javascript')).length,
    other: files.filter(f => !f.mimeType.startsWith('image/') && !f.mimeType.startsWith('video/') && !f.mimeType.includes('text') && !f.mimeType.includes('document') && !f.mimeType.includes('json')).length
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            File Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading files...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{fileTypeStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{fileTypeStats.images}</div>
              <div className="text-sm text-muted-foreground">Images</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{fileTypeStats.videos}</div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{fileTypeStats.documents}</div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{fileTypeStats.code}</div>
              <div className="text-sm text-muted-foreground">Code/JSON</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{fileTypeStats.other}</div>
              <div className="text-sm text-muted-foreground">Other</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            File Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('image')}
              >
                Images
              </Button>
              <Button
                variant={filter === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('video')}
              >
                Videos
              </Button>
              <Button
                variant={filter === 'document' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('document')}
              >
                Documents
              </Button>
              <Button
                variant={filter === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('code')}
              >
                Code
              </Button>
            </div>
          </div>

          {/* File List */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {files.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.mimeType)}
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDistanceToNow(new Date(file.uploadedAt))} ago
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {file.mimeType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{file.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Size:</strong> {formatFileSize(file.size)}
                            </div>
                            <div>
                              <strong>Type:</strong> {file.mimeType}
                            </div>
                            <div>
                              <strong>Uploaded:</strong> {formatDistanceToNow(new Date(file.uploadedAt))} ago
                            </div>
                            <div>
                              <strong>Bucket:</strong> {file.bucket}
                            </div>
                          </div>
                          <div>
                            <strong>Path:</strong> {file.path}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};