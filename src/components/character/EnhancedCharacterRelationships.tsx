import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Heart, Swords, Target, Link as LinkIcon, Trash2, Edit, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CharacterRelationship } from '@/hooks/useCharacters';

const relationshipTypes = [
  { 
    id: 'ally', 
    label: 'Ally', 
    icon: Users, 
    color: 'bg-green-500/10 text-green-500 border-green-500/20', 
    hover: 'hover:bg-green-500/20',
    description: 'Trusted companion or friend'
  },
  { 
    id: 'rival', 
    label: 'Rival', 
    icon: Target, 
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', 
    hover: 'hover:bg-orange-500/20',
    description: 'Competitive relationship or opposing goals'
  },
  { 
    id: 'antagonist', 
    label: 'Antagonist', 
    icon: Swords, 
    color: 'bg-red-500/10 text-red-500 border-red-500/20', 
    hover: 'hover:bg-red-500/20',
    description: 'Enemy or opposing force'
  },
  { 
    id: 'romantic_connection', 
    label: 'Romantic', 
    icon: Heart, 
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20', 
    hover: 'hover:bg-pink-500/20',
    description: 'Romantic interest or partner'
  },
  { 
    id: 'linked_character', 
    label: 'Linked', 
    icon: LinkIcon, 
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
    hover: 'hover:bg-blue-500/20',
    description: 'Connected through story or circumstances'
  }
];

interface EnhancedCharacterRelationshipsProps {
  characterId: string;
  editable?: boolean;
  showAddButton?: boolean;
}

const EnhancedCharacterRelationships: React.FC<EnhancedCharacterRelationshipsProps> = ({ 
  characterId, 
  editable = false,
  showAddButton = false 
}) => {
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<CharacterRelationship | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch relationships for this character
  const { data: relationships, isLoading } = useQuery({
    queryKey: ['character_relationships', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .eq('character_id', characterId)
        .order('relationship_type', { ascending: true });

      if (error) throw error;
      return data as CharacterRelationship[];
    },
    enabled: !!characterId,
  });

  // Create relationship mutation
  const createRelationshipMutation = useMutation({
    mutationFn: async (relationship: Omit<CharacterRelationship, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('character_relationships')
        .insert([relationship])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_relationships', characterId] });
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add relationship: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Update relationship mutation
  const updateRelationshipMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CharacterRelationship> }) => {
      const { data, error } = await supabase
        .from('character_relationships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_relationships', characterId] });
      toast({
        title: "Success",
        description: "Relationship updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update relationship: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete relationship mutation
  const deleteRelationshipMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('character_relationships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_relationships', characterId] });
      toast({
        title: "Success",
        description: "Relationship deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete relationship: " + error.message,
        variant: "destructive",
      });
    },
  });

  const getRelationshipTypeInfo = (type: string) => {
    return relationshipTypes.find(t => t.id === type) || relationshipTypes[0];
  };

  const handleCreateRelationship = (relationshipData: Omit<CharacterRelationship, 'id' | 'created_at'>) => {
    createRelationshipMutation.mutate(relationshipData);
    setIsAddingRelationship(false);
  };

  const handleUpdateRelationship = (id: string, updates: Partial<CharacterRelationship>) => {
    updateRelationshipMutation.mutate({ id, updates });
    setEditingRelationship(null);
  };

  const handleDeleteRelationship = (id: string) => {
    deleteRelationshipMutation.mutate(id);
  };

  // Dynamic grid calculation based on number of relationships
  const getGridColumns = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    if (count <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count <= 8) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    if (count <= 12) return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
  };

  // Dynamic card size based on content amount
  const getCardSize = (count: number) => {
    if (count <= 3) return 'p-4'; // Larger cards for few items
    if (count <= 6) return 'p-3'; // Medium cards
    return 'p-2'; // Compact cards for many items
  };

  // Dynamic text size based on content
  const getTextSize = (count: number) => {
    if (count <= 3) return { title: 'text-sm', desc: 'text-xs' };
    if (count <= 6) return { title: 'text-sm', desc: 'text-xs' };
    return { title: 'text-xs', desc: 'text-xs' };
  };

  const totalRelationships = relationships?.length || 0;
  const gridCols = getGridColumns(totalRelationships + (editable || showAddButton ? 1 : 0));
  const cardSize = getCardSize(totalRelationships);
  const textSize = getTextSize(totalRelationships);

  if (isLoading) {
    return (
      <Card className="tech-card-glow shimmer-effect">
        <CardHeader>
          <CardTitle className="mono-font text-foreground flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground mono-font">Loading relationships...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tech-card-glow hover-glow-intense">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="mono-font text-foreground flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            Relationships
            {relationships && (
              <Badge variant="secondary" className="ml-2">
                {relationships.length}
              </Badge>
            )}
          </CardTitle>
          {(editable || showAddButton) && (
            <Dialog open={isAddingRelationship} onOpenChange={setIsAddingRelationship}>
              <DialogTrigger asChild>
                <Button size="sm" className="mono-font hover-lift">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Relationship
                </Button>
              </DialogTrigger>
              <RelationshipDialog
                characterId={characterId}
                onSubmit={handleCreateRelationship}
                onClose={() => setIsAddingRelationship(false)}
              />
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalRelationships === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mono-font text-sm mb-4">
              {editable || showAddButton 
                ? "No relationships added yet. Click 'Add Relationship' to get started." 
                : "No relationships defined for this character."}
            </p>
            {(editable || showAddButton) && (
              <Button 
                onClick={() => setIsAddingRelationship(true)}
                variant="outline"
                className="mono-font hover-lift"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Relationship
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Dynamic Grid Layout - Adapts to Content Amount */}
            <div className={`grid ${gridCols} gap-3`}>
              {relationships?.map((relationship) => {
                const typeInfo = getRelationshipTypeInfo(relationship.relationship_type);
                const TypeIcon = typeInfo.icon;
                return (
                  <div
                    key={relationship.id}
                    className={`
                      relative ${cardSize} rounded-lg border transition-all duration-300 group
                      ${typeInfo.color} ${typeInfo.hover}
                      hover-lift cursor-pointer
                    `}
                  >
                    {(editable || showAddButton) && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRelationship(relationship);
                          }}
                          className="h-6 w-6 p-0 hover:bg-background/20"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRelationship(relationship.id);
                          }}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <div className="pr-8">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className="w-3 h-3" />
                        <h5 className={`font-medium mono-font ${textSize.title} truncate`}>{relationship.character_name}</h5>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {typeInfo.label}
                        </Badge>
                        {relationship.is_bidirectional && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            Mutual
                          </Badge>
                        )}
                      </div>
                      {relationship.description && (
                        <p className={`${textSize.desc} text-muted-foreground leading-relaxed ${totalRelationships > 8 ? 'line-clamp-1' : 'line-clamp-2'}`}>
                          {relationship.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Add New Relationship Card - Integrated into Dynamic Grid */}
              {(editable || showAddButton) && (
                <div 
                  onClick={() => setIsAddingRelationship(true)}
                  className={`
                    relative ${cardSize} rounded-lg border-2 border-dashed border-muted-foreground/30 
                    transition-all duration-300 cursor-pointer group
                    hover:border-accent hover:bg-accent/5 hover-lift
                    ${totalRelationships <= 3 ? 'min-h-[120px]' : totalRelationships <= 6 ? 'min-h-[100px]' : 'min-h-[80px]'} flex items-center justify-center
                  `}
                >
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className={`${totalRelationships <= 3 ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors`}>
                      <Plus className={`${totalRelationships <= 3 ? 'w-5 h-5' : 'w-4 h-4'} text-accent`} />
                    </div>
                    <div>
                      <p className={`${textSize.title} font-medium mono-font text-foreground group-hover:text-accent transition-colors`}>
                        Add New
                      </p>
                      <p className={`${textSize.desc} text-muted-foreground`}>
                        Relationship
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      {/* Edit Relationship Dialog */}
      {editingRelationship && (
        <Dialog open={!!editingRelationship} onOpenChange={() => setEditingRelationship(null)}>
          <RelationshipDialog
            characterId={characterId}
            relationship={editingRelationship}
            onSubmit={(updates) => {
              handleUpdateRelationship(editingRelationship.id, updates);
            }}
            onClose={() => setEditingRelationship(null)}
          />
        </Dialog>
      )}
    </Card>
  );
};

// Relationship Dialog Component
interface RelationshipDialogProps {
  characterId: string;
  relationship?: CharacterRelationship;
  onSubmit: (relationship: Omit<CharacterRelationship, 'id' | 'created_at'>) => void;
  onClose: () => void;
}

const RelationshipDialog: React.FC<RelationshipDialogProps> = ({ characterId, relationship, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    character_name: relationship?.character_name || '',
    relationship_type: relationship?.relationship_type || 'ally',
    description: relationship?.description || '',
    related_character_id: relationship?.related_character_id || '',
    is_bidirectional: relationship?.is_bidirectional || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.character_name.trim()) return;

    onSubmit({
      character_id: characterId,
      character_name: formData.character_name.trim(),
      relationship_type: formData.relationship_type as any,
      description: formData.description.trim() || undefined,
      related_character_id: formData.related_character_id || undefined,
      is_bidirectional: formData.is_bidirectional
    });

    onClose();
  };

  const selectedTypeInfo = relationshipTypes.find(t => t.id === formData.relationship_type) || relationshipTypes[0];
  const TypeIcon = selectedTypeInfo.icon;

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="mono-font flex items-center gap-2">
          <TypeIcon className="w-5 h-5 text-accent" />
          {relationship ? 'Edit Relationship' : 'Add New Relationship'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Character Name *
          </label>
          <Input
            value={formData.character_name}
            onChange={(e) => setFormData(prev => ({ ...prev, character_name: e.target.value }))}
            placeholder="e.g., Alexander Cross, Eve Winters..."
            className="mono-font"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Relationship Type *
          </label>
          <Select 
            value={formData.relationship_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, relationship_type: value }))}
          >
            <SelectTrigger className="mono-font">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relationshipTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the nature of this relationship..."
            rows={3}
            className="mono-font text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="bidirectional"
            checked={formData.is_bidirectional}
            onChange={(e) => setFormData(prev => ({ ...prev, is_bidirectional: e.target.checked }))}
            className="rounded"
          />
          <label htmlFor="bidirectional" className="text-sm mono-font text-foreground">
            Mutual relationship (applies to both characters)
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="mono-font hover-lift" disabled={!formData.character_name.trim()}>
            {relationship ? 'Update Relationship' : 'Add Relationship'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="mono-font">
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EnhancedCharacterRelationships;