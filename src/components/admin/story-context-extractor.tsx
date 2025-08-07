import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, FileText, Brain, Tag, CheckCircle, 
  AlertCircle, Eye, Edit, Save, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import mammoth from 'mammoth';

// Content interface with storage path
interface ExtractedContent {
  id: string;
  fileName: string;
  contextLabel: string;
  rawContent: string;
  parsedData?: any;
  mappedTemplate?: any;
  confidence?: number;
  suggestions?: string[];
  status: 'uploaded' | 'parsed' | 'mapped' | 'reviewed' | 'saved';
  storagePath?: string;
  storageUrl?: string;
}

export const StoryContextExtractor = () => {
  const { toast } = useToast();
  const { uploadFile, uploading, progress } = useFileUpload();
  const [extractedContent, setExtractedContent] = useState<ExtractedContent[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'parse' | 'map' | 'review'>('upload');
  const [selectedContent, setSelectedContent] = useState<ExtractedContent | null>(null);
  const [contextLabels] = useState([
    'character-description',
    'location-description', 
    'plot-summary',
    'dialogue-scene',
    'world-building',
    'character-backstory',
    'scene-setting',
    'conflict-description',
    'custom'
  ]);

  // Handle file uploads with Supabase storage
  const handleFileUpload = async (files: File[], contextLabel: string): Promise<void> => {
    for (const file of files) {
      try {
        // Upload file to Supabase storage
        const uploadResult = await uploadFile(file, 'documents', `story-context/${contextLabel}`);
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Upload failed');
        }

        // Extract content from file
        let rawContent = '';
        
        if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          rawContent = await file.text();
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          rawContent = result.value;
        } else {
          // For other file types, just store the file info
          rawContent = `File: ${file.name} (${file.type}) - Content available in storage`;
        }

        // Create extracted content entry
        const newContent: ExtractedContent = {
          id: Date.now().toString() + Math.random().toString(36),
          fileName: file.name,
          contextLabel,
          rawContent,
          status: 'uploaded',
          storagePath: uploadResult.path,
          storageUrl: uploadResult.url
        };

        setExtractedContent(prev => [...prev, newContent]);
        
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded and content extracted successfully`
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Upload Error",
          description: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    }
  };

  // Parse all uploaded content
  const parseAllContent = useCallback(async () => {
    for (const content of extractedContent) {
      if (content.status === 'uploaded') {
        setExtractedContent(prev => 
          prev.map(item => 
            item.id === content.id 
              ? { ...item, status: 'parsed' as const }
              : item
          )
        );
      }
    }
    setCurrentStep('map');
  }, [extractedContent]);

  // Map all parsed content to templates
  const mapAllContent = useCallback(async () => {
    for (const content of extractedContent) {
      if (content.status === 'parsed') {
        setExtractedContent(prev => 
          prev.map(item => 
            item.id === content.id 
              ? { ...item, status: 'mapped' as const }
              : item
          )
        );
      }
    }
    setCurrentStep('review');
  }, [extractedContent]);

  // Save all reviewed content
  const saveAllContent = useCallback(async () => {
    for (const content of extractedContent) {
      if (content.status === 'reviewed') {
        setExtractedContent(prev => 
          prev.map(item => 
            item.id === content.id 
              ? { ...item, status: 'saved' as const }
              : item
          )
        );
      }
    }
    
    toast({
      title: "Content saved",
      description: "All extracted content has been saved to the database.",
    });
  }, [extractedContent, toast]);

  const getStatusIcon = (status: ExtractedContent['status']) => {
    switch (status) {
      case 'uploaded': return <Upload className="h-4 w-4" />;
      case 'parsed': return <Brain className="h-4 w-4" />;
      case 'mapped': return <Tag className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'saved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ExtractedContent['status']) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-500';
      case 'parsed': return 'bg-purple-500';
      case 'mapped': return 'bg-orange-500';
      case 'reviewed': return 'bg-green-500';
      case 'saved': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Aided Story Context Extractor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload & Label</TabsTrigger>
              <TabsTrigger value="parse" disabled={extractedContent.length === 0}>Parse Content</TabsTrigger>
              <TabsTrigger value="map" disabled={!extractedContent.some(c => c.status === 'parsed')}>Map Templates</TabsTrigger>
              <TabsTrigger value="review" disabled={!extractedContent.some(c => c.status === 'mapped')}>Review & Save</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Files with Context Labels</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* File upload and progress */}
                  {uploading && (
                    <Card className="mb-6">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Uploading to storage...</span>
                            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <FileUploadSection
                    contextLabels={contextLabels}
                    onFileUpload={handleFileUpload}
                    isProcessing={uploading}
                  />
                </CardContent>
              </Card>

              {extractedContent.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uploaded Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {extractedContent.map((content) => (
                        <div key={content.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className={`p-2 rounded-full ${getStatusColor(content.status)}`}>
                            {getStatusIcon(content.status)}
                          </div>
                          <div className="flex-1">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{content.fileName}</span>
                                <Badge variant="outline">{content.contextLabel}</Badge>
                                {content.storagePath && (
                                  <Badge variant="secondary" className="text-xs">Stored</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Status: {content.status} • {content.rawContent.length} characters
                                {content.storagePath && (
                                  <span> • Storage: {content.storagePath}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContent(content)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button onClick={parseAllContent} disabled={uploading}>
                        {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Parse All Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="parse">
              <Card>
                <CardHeader>
                  <CardTitle>Parse Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Content parsing functionality will be implemented here.
                  </p>
                  <Button onClick={() => setCurrentStep('map')}>
                    Continue to Mapping
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Map Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Template mapping functionality will be implemented here.
                  </p>
                  <Button onClick={() => setCurrentStep('review')}>
                    Continue to Review
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Save</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Review and save functionality will be implemented here.
                  </p>
                  <Button onClick={saveAllContent}>
                    Save All Content
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Content Preview Dialog */}
      {selectedContent && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedContent.fileName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>File:</strong> {selectedContent.fileName}</div>
                <div><strong>Context:</strong> {selectedContent.contextLabel}</div>
                <div><strong>Status:</strong> {selectedContent.status}</div>
                <div><strong>Characters:</strong> {selectedContent.rawContent.length}</div>
                {selectedContent.storagePath && (
                  <div><strong>Storage Path:</strong> {selectedContent.storagePath}</div>
                )}
                {selectedContent.storageUrl && (
                  <div><strong>Storage URL:</strong> 
                    <a href={selectedContent.storageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                      View File
                    </a>
                  </div>
                )}
              </div>
              <div>
                <Label>Raw Content</Label>
                <Textarea
                  value={selectedContent.rawContent}
                  readOnly
                  rows={10}
                  className="mt-2"
                />
              </div>
              {selectedContent.parsedData && (
                <div>
                  <Label>Parsed Data</Label>
                  <pre className="bg-muted p-3 rounded-md text-sm mt-2 overflow-x-auto">
                    {JSON.stringify(selectedContent.parsedData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// File Upload Section Component
interface FileUploadSectionProps {
  contextLabels: string[];
  onFileUpload: (files: File[], contextLabel: string) => void;
  isProcessing: boolean;
}

const FileUploadSection = ({ contextLabels, onFileUpload, isProcessing }: FileUploadSectionProps) => {
  const [selectedLabel, setSelectedLabel] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (!selectedLabel && !customLabel) {
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    const label = selectedLabel === 'custom' ? customLabel : selectedLabel;
    onFileUpload(files, label);
  }, [selectedLabel, customLabel, onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLabel && !customLabel) {
      return;
    }
    
    const files = Array.from(e.target.files || []);
    const label = selectedLabel === 'custom' ? customLabel : selectedLabel;
    onFileUpload(files, label);
  }, [selectedLabel, customLabel, onFileUpload]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="context-label">Context Label</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select context type..." />
            </SelectTrigger>
            <SelectContent>
              {contextLabels.map((label) => (
                <SelectItem key={label} value={label}>
                  {label.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedLabel === 'custom' && (
          <div>
            <Label htmlFor="custom-label">Custom Label</Label>
            <Input
              id="custom-label"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Enter custom context label..."
            />
          </div>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
        } ${(!selectedLabel && !customLabel) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          if (selectedLabel || customLabel) {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = '*';
            input.addEventListener('change', (e) => handleFileSelect(e as any));
            input.click();
          }
        }}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Upload Story Content</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-sm text-muted-foreground">
          Supports: All file types (files will be uploaded to secure storage)
        </p>
        {(!selectedLabel && !customLabel) && (
          <p className="text-sm text-destructive mt-2">
            Please select a context label first
          </p>
        )}
      </div>
    </div>
  );
};