import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Image, Search, Eye, Edit, Trash2, FileImage, Palette, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SecureFileUpload } from '@/components/security/SecureFileUpload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useStories } from '@/hooks/useStories';
import { useLocations } from '@/hooks/useLocations';
import { useCharacterProfiles } from '@/hooks/useCharacters';
import { useVisualReferences, useCreateVisualReference, useUpdateVisualReference, useDeleteVisualReference, VisualReference } from '@/hooks/useVisualReferences';

const VisualReferences = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [isAddingReference, setIsAddingReference] = useState(false);
  const [editingReference, setEditingReference] = useState<VisualReference | null>(null);
  const [selectedReference, setSelectedReference] = useState<VisualReference | null>(null);
  const { toast } = useToast();

  const { data: references = [], isLoading } = useVisualReferences();
  const { data: stories = [] } = useStories();
  const { data: locations = [] } = useLocations();
  const { data: characters = [] } = useCharacterProfiles();
  const createMutation = useCreateVisualReference();
  const updateMutation = useUpdateVisualReference();
  const deleteMutation = useDeleteVisualReference();

  const categories = [
    { id: 'all', label: 'All References', icon: Image },
    { id: 'concept-art', label: 'Concept Art', icon: Palette },
    { id: 'inspiration', label: 'Inspiration', icon: Eye },
    { id: 'character-design', label: 'Character Design', icon: FileImage },
    { id: 'location-art', label: 'Location Art', icon: Camera },
    { id: 'mood-board', label: 'Mood Board', icon: Palette },
    { id: 'reference-photo', label: 'Reference Photo', icon: Camera }
  ];

  const entityTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'character', label: 'Characters' },
    { id: 'location', label: 'Locations' },
    { id: 'story', label: 'Stories' },
    { id: 'general', label: 'General' }
  ];

  const addReference = (newReference: Omit<VisualReference, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    createMutation.mutate(newReference);
    setIsAddingReference(false);
  };

  const updateReference = (updatedReference: VisualReference) => {
    updateMutation.mutate(updatedReference);
    setEditingReference(null);
  };

  const deleteReference = (referenceId: string) => {
    deleteMutation.mutate(referenceId);
  };

  // Filter references
  const filteredReferences = references.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ref.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ref.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || ref.category === selectedCategory;
    const matchesEntityType = selectedEntityType === 'all' || ref.entity_type === selectedEntityType;
    
    return matchesSearch && matchesCategory && matchesEntityType;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Image;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'concept-art': 'bg-purple-500/10 text-purple-500',
      'inspiration': 'bg-yellow-500/10 text-yellow-500',
      'character-design': 'bg-blue-500/10 text-blue-500',
      'location-art': 'bg-green-500/10 text-green-500',
      'mood-board': 'bg-pink-500/10 text-pink-500',
      'reference-photo': 'bg-cyan-500/10 text-cyan-500'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading visual references...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <span className="mono-font font-bold text-xl tracking-wide">Shiver</span>
          </Link>
          <nav>
            <ul className="flex gap-6 mono-font">
              <li><Link to="/portfolio" className="text-accent hover:underline">Portfolio</Link></li>
              <li><Link to="/characters" className="text-accent hover:underline">Characters</Link></li>
              <li><Link to="/timeline" className="text-accent hover:underline">Timeline</Link></li>
              <li><Link to="/locations" className="text-accent hover:underline">Locations</Link></li>
              <li><Link to="/cases" className="text-accent hover:underline">Cases</Link></li>
              <li><Link to="/multimedia" className="text-accent hover:underline">Multimedia</Link></li>
              <li><Link to="/admin" className="text-accent hover:underline">Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Sub Header */}
      <header className="fixed top-20 left-0 w-full bg-card/60 backdrop-blur-sm z-40 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/portfolio" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="mono-font font-bold text-xl tracking-wide">Visual References</span>
          </Link>
          <Dialog open={isAddingReference} onOpenChange={setIsAddingReference}>
            <DialogTrigger asChild>
              <Button className="mono-font">
                <Plus className="w-4 h-4 mr-2" />
                Add Reference
              </Button>
            </DialogTrigger>
            <ReferenceDialog 
              onSubmit={addReference}
              onClose={() => setIsAddingReference(false)}
              stories={stories}
              locations={locations}
              characters={characters}
            />
          </Dialog>
        </div>
      </header>

      <div className="pt-40 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image className="w-12 h-12 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
                Visual References
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Organize concept art, inspiration images, character designs, and mood boards. 
              Each visual reference supports your profiles with notes and categorization.
            </p>
            <Badge variant="secondary" className="mono-font">
              {references.length} visual references stored
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search references, descriptions, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 mono-font"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="mono-font"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                    {category.id !== 'all' && (
                      <Badge variant="secondary" className="ml-2">
                        {references.filter(ref => ref.category === category.id).length}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Entity Type Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mono-font self-center mr-2">Filter by type:</span>
              {entityTypes.map((type) => {
                const isActive = selectedEntityType === type.id;
                return (
                  <Button
                    key={type.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEntityType(type.id)}
                    className="mono-font"
                  >
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* References Grid */}
          {filteredReferences.length === 0 ? (
            <div className="text-center py-16">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2 mono-font">
                {references.length === 0 ? "Start building your visual library" : "No references match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {references.length === 0 
                  ? "Upload concept art, inspiration images, and visual notes to support your creative work."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {references.length === 0 && (
                <Button onClick={() => setIsAddingReference(true)} className="mono-font">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Reference
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredReferences.map((reference) => {
                const CategoryIcon = getCategoryIcon(reference.category);
                return (
                  <Card key={reference.id} className="bg-card hover:bg-card/80 transition-colors group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-accent" />
                          <Badge variant="outline" className={getCategoryColor(reference.category)}>
                            {reference.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReference(reference)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingReference(reference)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteReference(reference.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-sm mono-font text-foreground line-clamp-2">
                        {reference.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Image */}
                      <div 
                        className="w-full h-48 bg-muted rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setSelectedReference(reference)}
                      >
                        <img 
                          src={reference.image_url} 
                          alt={reference.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {reference.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {reference.entity_type || 'general'}
                        </Badge>
                        {reference.entity_id && (
                          <Badge variant="outline" className="text-xs">
                            Linked
                          </Badge>
                        )}
                      </div>
                      
                      {reference.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {reference.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {reference.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{reference.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* View Reference Dialog */}
      {selectedReference && (
        <Dialog open={!!selectedReference} onOpenChange={() => setSelectedReference(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mono-font">{selectedReference.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="w-full max-h-96 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={selectedReference.image_url} 
                  alt={selectedReference.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Category</Label>
                  <p className="text-sm text-muted-foreground">{selectedReference.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Entity Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedReference.entity_type || 'General'}</p>
                </div>
              </div>
              
              {selectedReference.description && (
                <div>
                  <Label className="text-sm font-semibold">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedReference.description}</p>
                </div>
              )}
              
              {selectedReference.notes && (
                <div>
                  <Label className="text-sm font-semibold">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedReference.notes}</p>
                </div>
              )}
              
              {selectedReference.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedReference.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Reference Dialog */}
      {editingReference && (
        <Dialog open={!!editingReference} onOpenChange={() => setEditingReference(null)}>
          <ReferenceDialog 
            reference={editingReference}
            onSubmit={updateReference}
            onClose={() => setEditingReference(null)}
            stories={stories}
            locations={locations}
            characters={characters}
          />
        </Dialog>
      )}
    </div>
  );
};

// Reference Dialog Component
interface ReferenceDialogProps {
  reference?: VisualReference;
  onSubmit: (reference: any) => void;
  onClose: () => void;
  stories: any[];
  locations: any[];
  characters: any[];
}

const ReferenceDialog: React.FC<ReferenceDialogProps> = ({ reference, onSubmit, onClose, stories, locations, characters }) => {
  const [formData, setFormData] = useState({
    title: reference?.title || '',
    description: reference?.description || '',
    category: reference?.category || 'concept-art',
    entity_type: reference?.entity_type || 'general',
    entity_id: reference?.entity_id || '',
    image_url: reference?.image_url || '',
    tags: reference?.tags || [],
    notes: reference?.notes || ''
  });
  const [newTag, setNewTag] = useState('');
  const { uploadFile, uploading } = useFileUpload();

  const handleImageUpload = async (file: File) => {
    const result = await uploadFile(file, 'documents', 'visual-references');
    if (result.success && result.url) {
      setFormData(prev => ({ ...prev, image_url: result.url! }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url) return;

    const submitData = {
      ...formData,
      entity_id: formData.entity_id || undefined
    };

    if (reference) {
      onSubmit({ ...reference, ...submitData });
    } else {
      onSubmit(submitData);
    }
  };

  const getEntityOptions = () => {
    switch (formData.entity_type) {
      case 'story':
        return stories.map(story => ({ id: story.id, title: story.title }));
      case 'location':
        return locations.map(location => ({ id: location.id, title: location.name }));
      case 'character':
        return characters.map(character => ({ id: character.id, title: character.full_name || character.name }));
      default:
        return [];
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="mono-font">
          {reference ? 'Edit Visual Reference' : 'Add Visual Reference'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter reference title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe this visual reference"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concept-art">Concept Art</SelectItem>
                <SelectItem value="inspiration">Inspiration</SelectItem>
                <SelectItem value="character-design">Character Design</SelectItem>
                <SelectItem value="location-art">Location Art</SelectItem>
                <SelectItem value="mood-board">Mood Board</SelectItem>
                <SelectItem value="reference-photo">Reference Photo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity_type">Link To</Label>
            <Select 
              value={formData.entity_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, entity_type: value, entity_id: '' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="character">Character</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.entity_type !== 'general' && getEntityOptions().length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="entity_id">Select {formData.entity_type}</Label>
            <Select value={formData.entity_id} onValueChange={(value) => setFormData(prev => ({ ...prev, entity_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={`Choose a ${formData.entity_type}`} />
              </SelectTrigger>
              <SelectContent>
                {getEntityOptions().map(entity => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Image *</Label>
          {formData.image_url ? (
            <div className="space-y-2">
              <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <SecureFileUpload
              onFilesSelected={(files) => files.length > 0 && handleImageUpload(files[0])}
              accept="image/*"
              maxFiles={1}
              disabled={uploading}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline">Add</Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about this reference"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.title.trim() || !formData.image_url || uploading}
          >
            {reference ? 'Update' : 'Create'} Reference
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default VisualReferences;