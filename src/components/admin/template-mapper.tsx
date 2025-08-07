import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tag, CheckCircle, AlertCircle, Edit, 
  Loader2, FileText, User, MapPin, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Character, Chapter, CaseFile, Location, MultimediaItem } from "@/data/types";

interface ExtractedContent {
  id: string;
  fileName: string;
  contextLabel: string;
  rawContent: string;
  parsedData: any;
  mappedTemplate: any;
  confidence: number;
  suggestions: string[];
  status: 'uploaded' | 'parsed' | 'mapped' | 'reviewed' | 'saved';
}

interface TemplateMapperProps {
  content: ExtractedContent[];
  onContentUpdate: (content: ExtractedContent[]) => void;
  onComplete: () => void;
}

export const TemplateMapper = ({ content, onContentUpdate, onComplete }: TemplateMapperProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtractedContent | null>(null);

  // Template generators for different content types
  const generateCharacterTemplate = (parsedData: any, rawContent: string): Partial<Character> => {
    const entities = parsedData.entities;
    const characterName = entities.characters?.[0] || "Unknown Character";
    
    return {
      name: characterName,
      title: `Character from ${parsedData.contentType}`,
      color: "blue", // Default color
      image: null,
      description: rawContent.substring(0, 200) + (rawContent.length > 200 ? "..." : ""),
      stats: {
        investigation: 50,
        combat: 50,
        deduction: 50,
        social: 50
      },
      background: rawContent,
      quote: "", // To be filled by user
      traits: entities.keywords || [],
      tags: [...(entities.keywords || []), ...(entities.emotions || [])],
      chapterAppearances: [],
      locationConnections: [],
      caseInvolvement: []
    };
  };

  const generateLocationTemplate = (parsedData: any, rawContent: string): Partial<Location> => {
    const entities = parsedData.entities;
    const locationName = entities.locations?.[0] || "Unknown Location";
    
    return {
      name: locationName,
      title: `Location from ${parsedData.contentType}`,
      district: "Unknown District",
      status: "Active",
      description: rawContent.substring(0, 200) + (rawContent.length > 200 ? "..." : ""),
      significance: "To be determined",
      dangers: entities.keywords?.filter((k: string) => 
        ['dangerous', 'dark', 'scary', 'threatening'].includes(k.toLowerCase())
      ) || [],
      accessibility: "Unknown",
      image: "/placeholder.svg",
      tags: [...(entities.keywords || []), parsedData.contentType],
      charactersPresent: [],
      chaptersVisited: [],
      casesOccurred: []
    };
  };

  const generateChapterTemplate = (parsedData: any, rawContent: string): Partial<Chapter> => {
    const entities = parsedData.entities;
    
    return {
      name: `Chapter: ${parsedData.contentType}`,
      title: `Chapter from ${parsedData.contentType}`,
      color: "purple",
      image: "/placeholder.svg",
      description: rawContent.substring(0, 200) + (rawContent.length > 200 ? "..." : ""),
      summary: rawContent.substring(0, 400) + (rawContent.length > 400 ? "..." : ""),
      content: rawContent,
      tags: [...(entities.keywords || []), parsedData.contentType],
      charactersAppearing: [],
      locationsVisited: [],
      casesReferenced: []
    };
  };

  const generateCaseTemplate = (parsedData: any, rawContent: string): Partial<CaseFile> => {
    const entities = parsedData.entities;
    
    return {
      title: `Case: ${parsedData.contentType}`,
      status: "Open",
      classification: "Unknown",
      date: new Date().toISOString().split('T')[0],
      description: rawContent.substring(0, 200) + (rawContent.length > 200 ? "..." : ""),
      evidence: entities.keywords || [],
      outcome: "Pending investigation",
      summary: rawContent.substring(0, 400) + (rawContent.length > 400 ? "..." : ""),
      tags: [...(entities.keywords || []), parsedData.contentType],
      charactersInvolved: [],
      locationsInvolved: [],
      chaptersReferenced: []
    };
  };

  const generateMultimediaTemplate = (parsedData: any, rawContent: string): Partial<MultimediaItem> => {
    return {
      title: `Media: ${parsedData.contentType}`,
      type: 'document',
      category: parsedData.contentType,
      description: rawContent.substring(0, 200) + (rawContent.length > 200 ? "..." : ""),
      thumbnail: null,
      tags: [...(parsedData.entities?.keywords || []), parsedData.contentType],
      status: "Available"
    };
  };

  const getTemplateForContext = (parsedData: any, rawContent: string, contextLabel: string): any => {
    switch (contextLabel) {
      case 'character-description':
      case 'character-backstory':
        return generateCharacterTemplate(parsedData, rawContent);
      
      case 'location-description':
      case 'scene-setting':
        return generateLocationTemplate(parsedData, rawContent);
      
      case 'plot-summary':
      case 'dialogue-scene':
        return generateChapterTemplate(parsedData, rawContent);
      
      case 'conflict-description':
        return generateCaseTemplate(parsedData, rawContent);
      
      default:
        return generateMultimediaTemplate(parsedData, rawContent);
    }
  };

  const mapContentToTemplate = async (contentItem: ExtractedContent): Promise<ExtractedContent> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const mappedTemplate = getTemplateForContext(
      contentItem.parsedData, 
      contentItem.rawContent, 
      contentItem.contextLabel
    );
    
    return {
      ...contentItem,
      mappedTemplate,
      status: 'mapped'
    };
  };

  const mapAllContent = async () => {
    setIsProcessing(true);
    const parsedContent = content.filter(item => item.status === 'parsed');
    
    if (parsedContent.length === 0) {
      toast({
        title: "No content to map",
        description: "No parsed content available for template mapping.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }
    
    const updatedContent = [...content];
    
    for (const item of parsedContent) {
      const mappedItem = await mapContentToTemplate(item);
      
      const index = updatedContent.findIndex(c => c.id === item.id);
      if (index !== -1) {
        updatedContent[index] = mappedItem;
        onContentUpdate([...updatedContent]);
      }
    }
    
    setIsProcessing(false);
    
    toast({
      title: "Template mapping complete",
      description: `Successfully mapped ${parsedContent.length} content items to templates.`,
    });
  };

  const updateMappedTemplate = (itemId: string, updatedTemplate: any) => {
    const updatedContent = content.map(item => 
      item.id === itemId 
        ? { ...item, mappedTemplate: updatedTemplate }
        : item
    );
    onContentUpdate(updatedContent);
  };

  const getTemplateTypeIcon = (contextLabel: string) => {
    switch (contextLabel) {
      case 'character-description':
      case 'character-backstory':
        return <User className="h-4 w-4" />;
      case 'location-description':
      case 'scene-setting':
        return <MapPin className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTemplateTypeName = (contextLabel: string): string => {
    switch (contextLabel) {
      case 'character-description':
      case 'character-backstory':
        return 'Character';
      case 'location-description':
      case 'scene-setting':
        return 'Location';
      case 'plot-summary':
      case 'dialogue-scene':
        return 'Chapter';
      case 'conflict-description':
        return 'Case File';
      default:
        return 'Multimedia';
    }
  };

  const parsedContent = content.filter(item => item.status === 'parsed');
  const mappedContent = content.filter(item => item.status === 'mapped');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Template Mapping & Structure Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parsedContent.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {parsedContent.length} parsed content items ready for template mapping
                </p>
                <Button onClick={mapAllContent} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mapping...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Map All to Templates
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {mappedContent.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mapped Templates</h3>
                <Button onClick={onComplete} variant="default">
                  Continue to Review
                </Button>
              </div>
              
              <div className="grid gap-4">
                {mappedContent.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{item.fileName}</span>
                          <Badge variant="secondary">{item.contextLabel}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTemplateTypeIcon(item.contextLabel)}
                            {getTemplateTypeName(item.contextLabel)}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Template
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <TemplatePreview 
                        template={item.mappedTemplate} 
                        contextLabel={item.contextLabel}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Editor Dialog */}
      {editingItem && (
        <TemplateEditor
          item={editingItem}
          onSave={(updatedTemplate) => {
            updateMappedTemplate(editingItem.id, updatedTemplate);
            setEditingItem(null);
            toast({
              title: "Template updated",
              description: "Template has been successfully updated.",
            });
          }}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

// Template Preview Component
const TemplatePreview = ({ template, contextLabel }: { template: any; contextLabel: string }) => {
  const renderPreview = () => {
    switch (contextLabel) {
      case 'character-description':
      case 'character-backstory':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-medium">Name:</Label>
              <p className="text-muted-foreground">{template.name || 'N/A'}</p>
            </div>
            <div>
              <Label className="font-medium">Title:</Label>
              <p className="text-muted-foreground">{template.title || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <Label className="font-medium">Description:</Label>
              <p className="text-muted-foreground line-clamp-2">{template.description || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <Label className="font-medium">Traits:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.traits?.slice(0, 5)?.map((trait: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">{trait}</Badge>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'location-description':
      case 'scene-setting':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-medium">Name:</Label>
              <p className="text-muted-foreground">{template.name || 'N/A'}</p>
            </div>
            <div>
              <Label className="font-medium">District:</Label>
              <p className="text-muted-foreground">{template.district || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <Label className="font-medium">Description:</Label>
              <p className="text-muted-foreground line-clamp-2">{template.description || 'N/A'}</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-medium">Title:</Label>
              <p className="text-muted-foreground">{template.title || 'N/A'}</p>
            </div>
            <div>
              <Label className="font-medium">Type:</Label>
              <p className="text-muted-foreground">{template.type || template.category || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <Label className="font-medium">Description:</Label>
              <p className="text-muted-foreground line-clamp-2">{template.description || 'N/A'}</p>
            </div>
          </div>
        );
    }
  };

  return <div className="bg-muted/50 p-4 rounded-lg">{renderPreview()}</div>;
};

// Template Editor Component
const TemplateEditor = ({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: ExtractedContent; 
  onSave: (template: any) => void; 
  onCancel: () => void; 
}) => {
  const [editedTemplate, setEditedTemplate] = useState(item.mappedTemplate);

  const updateField = (field: string, value: any) => {
    setEditedTemplate((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderEditor = () => {
    switch (item.contextLabel) {
      case 'character-description':
      case 'character-backstory':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Character Name</Label>
                <Input
                  id="name"
                  value={editedTemplate.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedTemplate.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedTemplate.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="background">Background</Label>
              <Textarea
                id="background"
                value={editedTemplate.background || ''}
                onChange={(e) => updateField('background', e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="traits">Traits (comma-separated)</Label>
              <Input
                id="traits"
                value={editedTemplate.traits?.join(', ') || ''}
                onChange={(e) => updateField('traits', e.target.value.split(',').map((t: string) => t.trim()))}
              />
            </div>
          </div>
        );
      
      case 'location-description':
      case 'scene-setting':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  value={editedTemplate.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={editedTemplate.district || ''}
                  onChange={(e) => updateField('district', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedTemplate.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="significance">Significance</Label>
              <Textarea
                id="significance"
                value={editedTemplate.significance || ''}
                onChange={(e) => updateField('significance', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTemplate.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedTemplate.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="fixed inset-4 z-50 bg-background shadow-lg overflow-y-auto">
      <CardHeader>
        <CardTitle>Edit Template: {item.fileName}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderEditor()}
        <div className="flex gap-2 mt-6">
          <Button onClick={() => onSave(editedTemplate)}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};