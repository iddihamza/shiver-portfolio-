import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, CheckCircle, AlertCircle, Edit, 
  Loader2, Save, Database, FileText, User, MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CharacterAPI, ChapterAPI, CaseAPI, LocationAPI, MultimediaAPI } from "@/data/db-utils";

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

interface ContentReviewerProps {
  content: ExtractedContent[];
  onContentUpdate: (content: ExtractedContent[]) => void;
  onSave: () => void;
  isProcessing: boolean;
}

export const ContentReviewer = ({ 
  content, 
  onContentUpdate, 
  onSave, 
  isProcessing 
}: ContentReviewerProps) => {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<ExtractedContent | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const mappedContent = content.filter(item => item.status === 'mapped');
  const reviewedContent = content.filter(item => item.status === 'reviewed');

  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAllItems = () => {
    if (selectedItems.size === mappedContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(mappedContent.map(item => item.id)));
    }
  };

  const approveSelectedItems = () => {
    const updatedContent = content.map(item => {
      if (selectedItems.has(item.id) && item.status === 'mapped') {
        return { ...item, status: 'reviewed' as const };
      }
      return item;
    });
    onContentUpdate(updatedContent);
    setSelectedItems(new Set());
    
    toast({
      title: "Items approved",
      description: `${selectedItems.size} items approved for saving.`,
    });
  };

  const updateItemTemplate = (itemId: string, updatedTemplate: any) => {
    const updatedContent = content.map(item => 
      item.id === itemId 
        ? { ...item, mappedTemplate: updatedTemplate }
        : item
    );
    onContentUpdate(updatedContent);
  };

  const addReviewNote = (itemId: string, note: string) => {
    setReviewNotes(prev => ({ ...prev, [itemId]: note }));
  };

  const saveToDatabase = async () => {
    const itemsToSave = content.filter(item => 
      item.status === 'reviewed' && selectedItems.has(item.id)
    );

    if (itemsToSave.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to save to the database.",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const item of itemsToSave) {
        const template = item.mappedTemplate;
        
        // Generate unique ID for database
        const maxId = Math.max(
          ...Object.values({
            ...CharacterAPI.getAll(),
            ...ChapterAPI.getAll(),
            ...CaseAPI.getAll(),
            ...LocationAPI.getAll(),
            ...MultimediaAPI.getAll()
          }).map((item: any) => item.id || 0)
        );
        
        const newId = maxId + 1;
        const finalTemplate = {
          ...template,
          id: newId,
          route: template.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `item-${newId}`
        };

        // Save to appropriate API based on context
        switch (item.contextLabel) {
          case 'character-description':
          case 'character-backstory':
            CharacterAPI.add(finalTemplate);
            break;
          
          case 'location-description':
          case 'scene-setting':
            LocationAPI.add(finalTemplate);
            break;
          
          case 'plot-summary':
          case 'dialogue-scene':
            ChapterAPI.add(finalTemplate);
            break;
          
          case 'conflict-description':
            CaseAPI.add(finalTemplate);
            break;
          
          default:
            MultimediaAPI.add(finalTemplate);
            break;
        }
      }

      // Update status to saved
      const updatedContent = content.map(item => 
        selectedItems.has(item.id) && item.status === 'reviewed'
          ? { ...item, status: 'saved' as const }
          : item
      );
      onContentUpdate(updatedContent);
      setSelectedItems(new Set());

      toast({
        title: "Content saved successfully",
        description: `${itemsToSave.length} items have been saved to the database.`,
      });

      onSave();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save some items to the database.",
        variant: "destructive"
      });
    }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Content Review & Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pending Review ({mappedContent.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({reviewedContent.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {mappedContent.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedItems.size === mappedContent.length && mappedContent.length > 0}
                        onCheckedChange={selectAllItems}
                      />
                      <Label>
                        Select All ({selectedItems.size} of {mappedContent.length} selected)
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={approveSelectedItems}
                        disabled={selectedItems.size === 0}
                        variant="outline"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Selected
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mappedContent.map((item) => (
                      <ReviewItemCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onSelect={() => toggleItemSelection(item.id)}
                        onEdit={() => setEditingItem(item)}
                        onAddNote={(note) => addReviewNote(item.id, note)}
                        reviewNote={reviewNotes[item.id] || ''}
                        getTemplateTypeIcon={getTemplateTypeIcon}
                        getTemplateTypeName={getTemplateTypeName}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No content available for review.</p>
                  <p className="text-sm">Complete the template mapping step first.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {reviewedContent.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {reviewedContent.length} items approved and ready for saving
                    </p>
                    <Button
                      onClick={saveToDatabase}
                      disabled={isProcessing || selectedItems.size === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Database className="h-4 w-4 mr-2" />
                          Save to Database ({selectedItems.size})
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {reviewedContent.map((item) => (
                      <ApprovedItemCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onSelect={() => toggleItemSelection(item.id)}
                        getTemplateTypeIcon={getTemplateTypeIcon}
                        getTemplateTypeName={getTemplateTypeName}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No approved content yet.</p>
                  <p className="text-sm">Approve items from the pending review tab.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Item Editor Dialog */}
      {editingItem && (
        <ItemEditor
          item={editingItem}
          onSave={(updatedTemplate) => {
            updateItemTemplate(editingItem.id, updatedTemplate);
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

// Review Item Card Component
const ReviewItemCard = ({ 
  item, 
  isSelected, 
  onSelect, 
  onEdit, 
  onAddNote, 
  reviewNote,
  getTemplateTypeIcon,
  getTemplateTypeName 
}: {
  item: ExtractedContent;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onAddNote: (note: string) => void;
  reviewNote: string;
  getTemplateTypeIcon: (label: string) => React.ReactNode;
  getTemplateTypeName: (label: string) => string;
}) => {
  const [noteText, setNoteText] = useState(reviewNote);

  return (
    <Card className={`border-l-4 ${isSelected ? 'border-l-blue-500 bg-blue-50/50' : 'border-l-orange-500'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          <div className="flex items-center gap-2 flex-1">
            <span className="font-medium">{item.fileName}</span>
            <Badge variant="secondary">{item.contextLabel}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getTemplateTypeIcon(item.contextLabel)}
              {getTemplateTypeName(item.contextLabel)}
            </Badge>
            {item.confidence && (
              <Badge 
                variant={item.confidence > 0.7 ? "default" : "secondary"}
                className="text-xs"
              >
                {Math.round(item.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <TemplatePreview template={item.mappedTemplate} contextLabel={item.contextLabel} />
          
          {item.suggestions.length > 0 && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <Label className="text-sm font-medium text-orange-700 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Review Suggestions:
              </Label>
              <ul className="text-sm text-orange-600 mt-1 space-y-1">
                {item.suggestions.map((suggestion, idx) => (
                  <li key={idx}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <Label htmlFor={`note-${item.id}`} className="text-sm font-medium">
              Review Notes (optional)
            </Label>
            <Textarea
              id={`note-${item.id}`}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={() => onAddNote(noteText)}
              placeholder="Add any notes about this content..."
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Approved Item Card Component
const ApprovedItemCard = ({ 
  item, 
  isSelected, 
  onSelect,
  getTemplateTypeIcon,
  getTemplateTypeName 
}: {
  item: ExtractedContent;
  isSelected: boolean;
  onSelect: () => void;
  getTemplateTypeIcon: (label: string) => React.ReactNode;
  getTemplateTypeName: (label: string) => string;
}) => {
  return (
    <Card className={`border-l-4 ${isSelected ? 'border-l-blue-500 bg-blue-50/50' : 'border-l-green-500'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          <div className="flex items-center gap-2 flex-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium">{item.fileName}</span>
            <Badge variant="secondary">{item.contextLabel}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getTemplateTypeIcon(item.contextLabel)}
              {getTemplateTypeName(item.contextLabel)}
            </Badge>
            <Badge className="bg-green-100 text-green-800">Approved</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <TemplatePreview template={item.mappedTemplate} contextLabel={item.contextLabel} />
      </CardContent>
    </Card>
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

// Item Editor Component (simplified for now)
const ItemEditor = ({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: ExtractedContent; 
  onSave: (template: any) => void; 
  onCancel: () => void; 
}) => {
  const [editedTemplate, setEditedTemplate] = useState(item.mappedTemplate);

  return (
    <Card className="fixed inset-4 z-50 bg-background shadow-lg overflow-y-auto">
      <CardHeader>
        <CardTitle>Quick Edit: {item.fileName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTemplate.title || editedTemplate.name || ''}
              onChange={(e) => setEditedTemplate(prev => ({ ...prev, title: e.target.value, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTemplate.description || ''}
              onChange={(e) => setEditedTemplate(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button onClick={() => onSave(editedTemplate)}>
            <Save className="h-4 w-4 mr-2" />
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