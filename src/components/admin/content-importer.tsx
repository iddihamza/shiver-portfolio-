import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, FileText, Image, Video, Database, CheckCircle, 
  AlertCircle, X, Download, FileJson, FileImage, File, Settings, Plus, Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { CharacterAPI, ChapterAPI, CaseAPI, LocationAPI, MultimediaAPI } from "@/data/db-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import mammoth from "mammoth";

export const ContentImporter = () => {
  const { toast } = useToast();
  const { uploadFile, uploading, progress } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; status: 'pending' | 'success' | 'error'; type: string; path?: string }>>([]);
  const [dragActive, setDragActive] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Record<string, any>>({});
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<{ type: string; template: any } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryTemplate, setNewCategoryTemplate] = useState("");

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  }, []);

  // Handle specific content type file upload
  const handleContentTypeUpload = useCallback((contentType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      processContentTypeFiles(files, contentType);
    };
    input.click();
  }, []);

  // Process files for specific content type
  const processContentTypeFiles = async (files: File[], expectedType: string) => {
    const fileResults = files.map(file => ({
      name: file.name,
      status: 'pending' as const,
      type: file.type
    }));
    
    setUploadedFiles(fileResults);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Upload file to storage first
        const uploadResult = await uploadFile(file, 'documents', expectedType);
        
        if (uploadResult.success) {
          // Then process the file content
          await processFileForType(file, expectedType, uploadResult.path);
          setUploadedFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'success', path: uploadResult.path } : f
          ));
        } else {
          throw new Error(uploadResult.error || 'Upload failed');
        }
      } catch (error) {
        setUploadedFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error' } : f
        ));
      }
    }

    toast({
      title: "Import Complete",
      description: `Processed ${files.length} ${expectedType} files`,
    });
  };

  // Process file for specific content type
  const processFileForType = async (file: File, expectedType: string, storagePath?: string): Promise<void> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === 'application/json' || fileName.endsWith('.json')) {
      return processJSONFileForType(file, expectedType);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return processWordFileForType(file, expectedType);
    } else if (fileType.startsWith('image/')) {
      return processImageFile(file, storagePath);
    } else if (fileType.startsWith('video/')) {
      return processVideoFile(file, storagePath);
    } else {
      // Process as generic file for media
      return processVideoFile(file, storagePath);
    }
  };

  // Process JSON file for specific content type
  const processJSONFileForType = async (file: File, expectedType: string): Promise<void> => {
    const text = await file.text();
    const data = JSON.parse(text);

    // Handle array of items
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        switch (expectedType) {
          case 'character':
            CharacterAPI.add(item);
            break;
          case 'chapter':
            ChapterAPI.add(item);
            break;
          case 'case':
            CaseAPI.add(item);
            break;
          case 'location':
            LocationAPI.add(item);
            break;
          case 'media':
            MultimediaAPI.add(item);
            break;
        }
      });
    } else {
      // Handle single item
      switch (expectedType) {
        case 'character':
          CharacterAPI.add(data);
          break;
        case 'chapter':
          ChapterAPI.add(data);
          break;
        case 'case':
          CaseAPI.add(data);
          break;
        case 'location':
          LocationAPI.add(data);
          break;
        case 'media':
          MultimediaAPI.add(data);
          break;
      }
    }
  };

  // Process uploaded files
  const processFiles = async (files: File[]) => {
    const fileResults = files.map(file => ({
      name: file.name,
      status: 'pending' as const,
      type: file.type
    }));
    
    setUploadedFiles(fileResults);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Upload file to storage first
        const uploadResult = await uploadFile(file, 'documents', 'general');
        
        if (uploadResult.success) {
          // Then process the file content
          await processFile(file, uploadResult.path);
          setUploadedFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'success', path: uploadResult.path } : f
          ));
        } else {
          throw new Error(uploadResult.error || 'Upload failed');
        }
      } catch (error) {
        setUploadedFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error' } : f
        ));
      }
    }

    toast({
      title: "Import Complete",
      description: `Processed ${files.length} files`,
    });
  };

  // Process individual file
  const processFile = async (file: File, storagePath?: string): Promise<void> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === 'application/json' || fileName.endsWith('.json')) {
      return processJSONFile(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return processWordFile(file);
    } else if (fileType.startsWith('image/')) {
      return processImageFile(file, storagePath);
    } else if (fileType.startsWith('video/')) {
      return processVideoFile(file, storagePath);
    } else {
      // Process any other file type as media
      return processVideoFile(file, storagePath);
    }
  };

  // Process JSON data files
  const processJSONFile = async (file: File): Promise<void> => {
    const text = await file.text();
    const data = JSON.parse(text);

    // Determine data type based on structure
    if (data.characters && Array.isArray(data.characters)) {
      data.characters.forEach((char: any) => CharacterAPI.add(char));
    }
    if (data.chapters && Array.isArray(data.chapters)) {
      data.chapters.forEach((chapter: any) => ChapterAPI.add(chapter));
    }
    if (data.cases && Array.isArray(data.cases)) {
      data.cases.forEach((caseData: any) => CaseAPI.add(caseData));
    }
    if (data.locations && Array.isArray(data.locations)) {
      data.locations.forEach((location: any) => LocationAPI.add(location));
    }
    if (data.multimedia && Array.isArray(data.multimedia)) {
      data.multimedia.forEach((media: any) => MultimediaAPI.add(media));
    }

    // Handle single entity types
    if (data.name && data.description) {
      if (data.stats) {
        CharacterAPI.add(data);
      } else if (data.district) {
        LocationAPI.add(data);
      } else if (data.status && data.classification) {
        CaseAPI.add(data);
      } else if (data.content) {
        ChapterAPI.add(data);
      }
    }
  };

  // Process image files
  const processImageFile = async (file: File, storagePath?: string): Promise<void> => {
    const url = storagePath || URL.createObjectURL(file);
    
    MultimediaAPI.add({
      title: file.name.replace(/\.[^/.]+$/, ""),
      type: 'image',
      category: 'uploaded',
      description: `Uploaded image: ${file.name}`,
      thumbnail: url,
      src: url,
      tags: ['uploaded', 'image'],
      route: `media/uploaded-${Date.now()}`
    });
  };

  // Process video files
  const processVideoFile = async (file: File, storagePath?: string): Promise<void> => {
    const url = storagePath || URL.createObjectURL(file);
    
    MultimediaAPI.add({
      title: file.name.replace(/\.[^/.]+$/, ""),
      type: 'video',
      category: 'uploaded',
      description: `Uploaded video: ${file.name}`,
      thumbnail: null,
      src: url,
      tags: ['uploaded', 'video'],
      route: `media/uploaded-${Date.now()}`
    });
  };

  // Process Word file for specific content type
  const processWordFileForType = async (file: File, expectedType: string): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      
      // Extract title from filename
      const title = file.name.replace(/\.[^/.]+$/, "");
      
      // Create content based on expected type
      const data = {
        name: title,
        title: title,
        description: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        tags: ['imported', 'word-document', expectedType],
        route: `${expectedType}-${Date.now()}`
      };
      
      switch (expectedType) {
        case 'character':
          CharacterAPI.add({
            ...data,
            color: 'gray',
            image: null,
            stats: { imported: 1 },
            background: text,
            quote: 'Imported from Word document',
            traits: ['Imported from Word document'],
            chapterAppearances: [],
            locationConnections: [],
            caseInvolvement: []
          });
          break;
        case 'chapter':
          ChapterAPI.add({
            ...data,
            color: 'blue',
            image: 'imported-chapter.jpg',
            content: text,
            summary: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
            charactersAppearing: [],
            locationsVisited: [],
            casesReferenced: []
          });
          break;
        case 'case':
          CaseAPI.add({
            ...data,
            status: 'Imported',
            classification: 'Document Import',
            date: new Date().toISOString().split('T')[0],
            evidence: ['Word document'],
            outcome: 'Requires Review',
            summary: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
            charactersInvolved: [],
            locationsInvolved: [],
            chaptersReferenced: []
          });
          break;
        case 'location':
          LocationAPI.add({
            ...data,
            district: 'Imported',
            status: 'Documented',
            image: 'imported-location.jpg',
            significance: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
            dangers: ['Unknown'],
            accessibility: 'Unknown',
            charactersPresent: [],
            chaptersVisited: [],
            casesOccurred: []
          });
          break;
        case 'media':
          MultimediaAPI.add({
            ...data,
            type: 'document',
            category: 'imported',
            src: URL.createObjectURL(file),
            thumbnail: null
          });
          break;
      }
    } catch (error) {
      throw new Error(`Failed to process Word document: ${error}`);
    }
  };

  // Process Word file with intelligent content detection
  const processWordFile = async (file: File): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.toLowerCase();
      
      // Extract title from filename
      const title = file.name.replace(/\.[^/.]+$/, "");
      
      // Intelligent content type detection
      let detectedType = 'chapter'; // default
      
      if (text.includes('character') || text.includes('personality') || text.includes('background') || text.includes('traits')) {
        detectedType = 'character';
      } else if (text.includes('case') || text.includes('investigation') || text.includes('evidence') || text.includes('suspect')) {
        detectedType = 'case';
      } else if (text.includes('location') || text.includes('place') || text.includes('building') || text.includes('district')) {
        detectedType = 'location';
      } else if (text.includes('chapter') || text.includes('story') || text.includes('narrative')) {
        detectedType = 'chapter';
      }
      
      // Process as detected type
      await processWordFileForType(file, detectedType);
    } catch (error) {
      throw new Error(`Failed to process Word document: ${error}`);
    }
  };

  // Download template files
  const downloadTemplate = (type: string) => {
    const template = getTemplate(type);
    const templates = {
      character: {
        name: "Alexander Blackwood",
        title: "Detective host of the Enigma",
        color: "red",
        description: "A stoic yet sardonic vigilante investigator with the weight of the Enigma upon him.",
        stats: {
          investigation: 95,
          "enigma control": 78,
          combat: 88,
          deduction: 94
        },
        background: "Orphaned after his family was wiped out in an Enigma experiment cover-up.",
        quote: "Rookwick doesn't need heroes — just someone who won't run.",
        traits: ["Enhanced senses", "Enigma-powered", "Noir combatant"],
        tags: ["protagonist", "detective", "enigma-host", "noir"],
        route: "character-route",
        image: null,
        chapterAppearances: [1, 2, 3],
        locationConnections: [1, 2],
        caseInvolvement: [1, 2]
      },
      chapter: {
        name: "The Discovery",
        title: "Chapter One: The Discovery",
        color: "blue",
        description: "The beginning of Alexander's journey into the mysteries of Rookwick.",
        summary: "Alexander investigates his first case involving the Enigma.",
        content: "# Chapter One\n\nThe fog rolled through Rookwick's streets like a living thing...",
        tags: ["opening", "mystery", "enigma"],
        route: "chapter-route",
        image: "chapter-image.jpg",
        charactersAppearing: [1, 2],
        locationsVisited: [1, 2],
        casesReferenced: [1]
      },
      case: {
        title: "The Missing Person Case",
        status: "Open",
        classification: "Missing Person",
        date: "2024-01-15",
        description: "A routine missing person case that leads to something much darker.",
        evidence: ["Torn clothing", "Strange symbols", "Witness testimony"],
        outcome: "Under Investigation",
        summary: "Initial investigation reveals connections to larger conspiracy.",
        tags: ["missing-person", "conspiracy", "investigation"],
        route: "case-route",
        charactersInvolved: [1, 2],
        locationsInvolved: [1, 2],
        chaptersReferenced: [1]
      },
      location: {
        name: "The Underground",
        title: "The Underground District",
        district: "Rookwick Underground",
        status: "Active",
        description: "A sprawling network of tunnels beneath Rookwick where secrets hide in every shadow.",
        significance: "Central hub for underground activities and resistance movements.",
        dangers: ["Cave-ins", "Hostile factions", "Unknown creatures"],
        accessibility: "Restricted - Requires local guide",
        tags: ["underground", "tunnels", "dangerous", "secret"],
        route: "location-route",
        image: "underground.jpg",
        charactersPresent: [1, 2],
        chaptersVisited: [1, 2],
        casesOccurred: [1]
      },
      media: {
        title: "Concept Art Collection",
        type: "Visual Art",
        category: "Concept Art",
        description: "Early concept art showing the visual development of Rookwick.",
        thumbnail: "concept-art-thumb.jpg",
        src: "concept-art-full.jpg",
        items: 25,
        status: "Available",
        tags: ["concept-art", "visual", "development"]
      }
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: `${type} template downloaded successfully`,
    });
  };

  // Get template (custom or default)
  const getTemplate = (type: string) => {
    return customTemplates[type] || {
      character: {
        name: "Alexander Blackwood",
        title: "Detective host of the Enigma",
        color: "red",
        description: "A stoic yet sardonic vigilante investigator with the weight of the Enigma upon him.",
        stats: {
          investigation: 95,
          "enigma control": 78,
          combat: 88,
          deduction: 94
        },
        background: "Orphaned after his family was wiped out in an Enigma experiment cover-up.",
        quote: "Rookwick doesn't need heroes — just someone who won't run.",
        traits: ["Enhanced senses", "Enigma-powered", "Noir combatant"],
        tags: ["protagonist", "detective", "enigma-host", "noir"],
        route: "character-route",
        image: null,
        chapterAppearances: [1, 2, 3],
        locationConnections: [1, 2],
        caseInvolvement: [1, 2]
      },
      chapter: {
        name: "The Discovery",
        title: "Chapter One: The Discovery",
        color: "blue",
        description: "The beginning of Alexander's journey into the mysteries of Rookwick.",
        summary: "Alexander investigates his first case involving the Enigma.",
        content: "# Chapter One\n\nThe fog rolled through Rookwick's streets like a living thing...",
        tags: ["opening", "mystery", "enigma"],
        route: "chapter-route",
        image: "chapter-image.jpg",
        charactersAppearing: [1, 2],
        locationsVisited: [1, 2],
        casesReferenced: [1]
      },
      case: {
        title: "The Missing Person Case",
        status: "Open",
        classification: "Missing Person",
        date: "2024-01-15",
        description: "A routine missing person case that leads to something much darker.",
        evidence: ["Torn clothing", "Strange symbols", "Witness testimony"],
        outcome: "Under Investigation",
        summary: "Initial investigation reveals connections to larger conspiracy.",
        tags: ["missing-person", "conspiracy", "investigation"],
        route: "case-route",
        charactersInvolved: [1, 2],
        locationsInvolved: [1, 2],
        chaptersReferenced: [1]
      },
      location: {
        name: "The Underground",
        title: "The Underground District",
        district: "Rookwick Underground",
        status: "Active",
        description: "A sprawling network of tunnels beneath Rookwick where secrets hide in every shadow.",
        significance: "Central hub for underground activities and resistance movements.",
        dangers: ["Cave-ins", "Hostile factions", "Unknown creatures"],
        accessibility: "Restricted - Requires local guide",
        tags: ["underground", "tunnels", "dangerous", "secret"],
        route: "location-route",
        image: "underground.jpg",
        charactersPresent: [1, 2],
        chaptersVisited: [1, 2],
        casesOccurred: [1]
      },
      media: {
        title: "Concept Art Collection",
        type: "Visual Art",
        category: "Concept Art",
        description: "Early concept art showing the visual development of Rookwick.",
        thumbnail: "concept-art-thumb.jpg",
        src: "concept-art-full.jpg",
        items: 25,
        status: "Available",
        tags: ["concept-art", "visual", "development"]
      }
    }[type];
  };

  // Update template
  const updateTemplate = (type: string, newTemplate: any) => {
    try {
      const parsedTemplate = JSON.parse(newTemplate);
      setCustomTemplates(prev => ({
        ...prev,
        [type]: parsedTemplate
      }));
      toast({
        title: "Template Updated",
        description: `${type} template updated successfully`,
      });
      setEditingTemplate(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive"
      });
    }
  };

  // Add new category
  const addNewCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedTemplate = JSON.parse(newCategoryTemplate || '{}');
      setCustomCategories(prev => [...prev, newCategoryName]);
      setCustomTemplates(prev => ({
        ...prev,
        [newCategoryName]: parsedTemplate
      }));
      
      toast({
        title: "Category Added",
        description: `${newCategoryName} category created successfully`,
      });
      
      setNewCategoryName("");
      setNewCategoryTemplate("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format for template",
        variant: "destructive"
      });
    }
  };

  // Clear uploaded files
  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      <Card className="tech-card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-accent bg-accent/10' : 'border-border'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
            <p className="text-muted-foreground mb-4">
              Supports all file types - JSON, Word documents, images, videos, and more
            </p>
            <Input
              type="file"
              multiple
              accept="*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              ref={(input) => {
                if (input) {
                  (window as any).fileInput = input;
                }
              }}
            />
            <Button 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => {
                const input = document.getElementById('file-upload') as HTMLInputElement;
                input?.click();
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Processing files... {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Uploaded Files</h4>
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') ? <FileImage className="w-4 h-4" /> : 
                       file.type === 'application/json' ? <FileJson className="w-4 h-4" /> :
                       file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc') ? <File className="w-4 h-4" /> :
                       <FileText className="w-4 h-4" />}
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Badge variant={
                      file.status === 'success' ? 'default' :
                      file.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {file.status === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                       file.status === 'error' ? <AlertCircle className="w-3 h-3 mr-1" /> :
                       <Upload className="w-3 h-3 mr-1" />}
                      {file.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Templates */}
      <Card className="tech-card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Import Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="character" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full grid-cols-5 max-w-2xl">
                <TabsTrigger value="character">Character</TabsTrigger>
                <TabsTrigger value="chapter">Chapter</TabsTrigger>
                <TabsTrigger value="case">Case</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                {customCategories.map(category => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
              </TabsList>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-template">Template JSON</Label>
                      <Textarea
                        id="category-template"
                        value={newCategoryTemplate}
                        onChange={(e) => setNewCategoryTemplate(e.target.value)}
                        placeholder="Enter JSON template structure"
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button onClick={addNewCategory} className="w-full">
                      Create Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="character" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Character Templates</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Character Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={JSON.stringify(getTemplate('character'), null, 2)}
                        onChange={(e) => setEditingTemplate({ type: 'character', template: e.target.value })}
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={() => updateTemplate('character', editingTemplate?.template || JSON.stringify(getTemplate('character'), null, 2))}
                        className="w-full"
                      >
                        Update Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col"
                    onClick={() => downloadTemplate('character')}
                  >
                    <Download className="w-5 h-5 mb-1" />
                    Download Character Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col border-accent/50 hover:border-accent"
                    onClick={() => handleContentTypeUpload('character')}
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    Upload Character Files
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground p-4 border rounded">
                  <strong>Character JSON Structure:</strong>
                  <pre className="mt-2 text-xs">{`{
  "name": "Character Name",
  "title": "Character Title",
  "description": "...",
  "stats": {...},
  "tags": [...]
}`}</pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chapter" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Chapter Templates</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Chapter Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={JSON.stringify(getTemplate('chapter'), null, 2)}
                        onChange={(e) => setEditingTemplate({ type: 'chapter', template: e.target.value })}
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={() => updateTemplate('chapter', editingTemplate?.template || JSON.stringify(getTemplate('chapter'), null, 2))}
                        className="w-full"
                      >
                        Update Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col"
                    onClick={() => downloadTemplate('chapter')}
                  >
                    <Download className="w-5 h-5 mb-1" />
                    Download Chapter Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col border-accent/50 hover:border-accent"
                    onClick={() => handleContentTypeUpload('chapter')}
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    Upload Chapter Files
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground p-4 border rounded">
                  <strong>Chapter JSON Structure:</strong>
                  <pre className="mt-2 text-xs">{`{
  "name": "Chapter Name",
  "title": "Chapter Title",
  "content": "...",
  "summary": "...",
  "tags": [...]
}`}</pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="case" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Case Templates</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Case Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={JSON.stringify(getTemplate('case'), null, 2)}
                        onChange={(e) => setEditingTemplate({ type: 'case', template: e.target.value })}
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={() => updateTemplate('case', editingTemplate?.template || JSON.stringify(getTemplate('case'), null, 2))}
                        className="w-full"
                      >
                        Update Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col"
                    onClick={() => downloadTemplate('case')}
                  >
                    <Download className="w-5 h-5 mb-1" />
                    Download Case Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col border-accent/50 hover:border-accent"
                    onClick={() => handleContentTypeUpload('case')}
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    Upload Case Files
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground p-4 border rounded">
                  <strong>Case JSON Structure:</strong>
                  <pre className="mt-2 text-xs">{`{
  "title": "Case Title",
  "status": "Open/Closed",
  "classification": "...",
  "description": "...",
  "tags": [...]
}`}</pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Location Templates</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Location Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={JSON.stringify(getTemplate('location'), null, 2)}
                        onChange={(e) => setEditingTemplate({ type: 'location', template: e.target.value })}
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={() => updateTemplate('location', editingTemplate?.template || JSON.stringify(getTemplate('location'), null, 2))}
                        className="w-full"
                      >
                        Update Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col"
                    onClick={() => downloadTemplate('location')}
                  >
                    <Download className="w-5 h-5 mb-1" />
                    Download Location Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col border-accent/50 hover:border-accent"
                    onClick={() => handleContentTypeUpload('location')}
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    Upload Location Files
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground p-4 border rounded">
                  <strong>Location JSON Structure:</strong>
                  <pre className="mt-2 text-xs">{`{
  "name": "Location Name",
  "title": "Location Title", 
  "district": "...",
  "description": "...",
  "tags": [...]
}`}</pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Media Templates</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Media Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={JSON.stringify(getTemplate('media'), null, 2)}
                        onChange={(e) => setEditingTemplate({ type: 'media', template: e.target.value })}
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={() => updateTemplate('media', editingTemplate?.template || JSON.stringify(getTemplate('media'), null, 2))}
                        className="w-full"
                      >
                        Update Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col"
                    onClick={() => downloadTemplate('media')}
                  >
                    <Download className="w-5 h-5 mb-1" />
                    Download Media Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 flex-col border-accent/50 hover:border-accent"
                    onClick={() => handleContentTypeUpload('media')}
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    Upload Media Files
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground p-4 border rounded">
                  <strong>Media JSON Structure:</strong>
                  <pre className="mt-2 text-xs">{`{
  "title": "Media Title",
  "type": "image/video/audio",
  "category": "...",
  "description": "...",
  "tags": [...]
}`}</pre>
                </div>
              </div>
            </TabsContent>

            {/* Custom Categories */}
            {customCategories.map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{category} Templates</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit {category} Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          value={JSON.stringify(getTemplate(category), null, 2)}
                          onChange={(e) => setEditingTemplate({ type: category, template: e.target.value })}
                          rows={15}
                          className="font-mono text-sm"
                        />
                        <Button 
                          onClick={() => updateTemplate(category, editingTemplate?.template || JSON.stringify(getTemplate(category), null, 2))}
                          className="w-full"
                        >
                          Update Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full h-16 flex-col"
                      onClick={() => downloadTemplate(category)}
                    >
                      <Download className="w-5 h-5 mb-1" />
                      Download {category} Template
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-16 flex-col border-accent/50 hover:border-accent"
                      onClick={() => handleContentTypeUpload(category)}
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      Upload {category} Files
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground p-4 border rounded">
                    <strong>{category} JSON Structure:</strong>
                    <pre className="mt-2 text-xs overflow-auto max-h-32">
                      {JSON.stringify(getTemplate(category), null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};