import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Zap, Shield, Eye, Brain, Heart, Sword, Star, Trash2, Edit, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CharacterAbility } from '@/hooks/useCharacters';

const abilityTypes = [
  { id: 'power', label: 'Supernatural Power', icon: Zap, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', hover: 'hover:bg-purple-500/20' },
  { id: 'skill', label: 'Skill', icon: Sword, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', hover: 'hover:bg-blue-500/20' },
  { id: 'talent', label: 'Natural Talent', icon: Star, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', hover: 'hover:bg-yellow-500/20' },
  { id: 'knowledge', label: 'Knowledge', icon: Brain, color: 'bg-green-500/10 text-green-500 border-green-500/20', hover: 'hover:bg-green-500/20' },
  { id: 'trait', label: 'Character Trait', icon: Heart, color: 'bg-red-500/10 text-red-500 border-red-500/20', hover: 'hover:bg-red-500/20' },
  { id: 'sense', label: 'Enhanced Sense', icon: Eye, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', hover: 'hover:bg-indigo-500/20' },
  { id: 'resistance', label: 'Resistance/Immunity', icon: Shield, color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', hover: 'hover:bg-gray-500/20' }
];

interface EnhancedCharacterAbilitiesProps {
  characterId: string;
  editable?: boolean;
  showAddButton?: boolean;
}

const EnhancedCharacterAbilities: React.FC<EnhancedCharacterAbilitiesProps> = ({ 
  characterId, 
  editable = false,
  showAddButton = false 
}) => {
  const [isAddingAbility, setIsAddingAbility] = useState(false);
  const [editingAbility, setEditingAbility] = useState<CharacterAbility | null>(null);
  const [expandedAbilities, setExpandedAbilities] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch abilities for this character
  const { data: abilities, isLoading } = useQuery({
    queryKey: ['character_abilities', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_abilities')
        .select('*')
        .eq('character_id', characterId)
        .order('ability_type', { ascending: true });

      if (error) throw error;
      return data as CharacterAbility[];
    },
    enabled: !!characterId,
  });

  // Create ability mutation
  const createAbilityMutation = useMutation({
    mutationFn: async (ability: Omit<CharacterAbility, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('character_abilities')
        .insert([ability])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_abilities', characterId] });
      toast({
        title: "Success",
        description: "Ability added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add ability: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Update ability mutation
  const updateAbilityMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CharacterAbility> }) => {
      const { data, error } = await supabase
        .from('character_abilities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_abilities', characterId] });
      toast({
        title: "Success",
        description: "Ability updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ability: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete ability mutation
  const deleteAbilityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('character_abilities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_abilities', characterId] });
      toast({
        title: "Success",
        description: "Ability deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete ability: " + error.message,
        variant: "destructive",
      });
    },
  });

  const getAbilityTypeInfo = (type: string) => {
    return abilityTypes.find(t => t.id === type) || abilityTypes[0];
  };

  const handleCreateAbility = (abilityData: Omit<CharacterAbility, 'id' | 'created_at'>) => {
    createAbilityMutation.mutate(abilityData);
    setIsAddingAbility(false);
  };

  const handleUpdateAbility = (id: string, updates: Partial<CharacterAbility>) => {
    updateAbilityMutation.mutate({ id, updates });
    setEditingAbility(null);
  };

  const handleDeleteAbility = (id: string) => {
    deleteAbilityMutation.mutate(id);
  };

  const toggleAbilityExpansion = (abilityId: string) => {
    const newExpanded = new Set(expandedAbilities);
    if (newExpanded.has(abilityId)) {
      newExpanded.delete(abilityId);
    } else {
      newExpanded.add(abilityId);
    }
    setExpandedAbilities(newExpanded);
  };

  // Dynamic grid calculation based on number of abilities
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

  const totalAbilities = abilities?.length || 0;
  const gridCols = getGridColumns(totalAbilities + (editable || showAddButton ? 1 : 0));
  const cardSize = getCardSize(totalAbilities);
  const textSize = getTextSize(totalAbilities);

  if (isLoading) {
    return (
      <Card className="tech-card-glow shimmer-effect">
        <CardHeader>
          <CardTitle className="mono-font text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Abilities & Powers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground mono-font">Loading abilities...</div>
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
            <Sparkles className="w-5 h-5 text-accent" />
            Abilities & Powers
            {abilities && (
              <Badge variant="secondary" className="ml-2">
                {abilities.length}
              </Badge>
            )}
          </CardTitle>
          {(editable || showAddButton) && (
            <Dialog open={isAddingAbility} onOpenChange={setIsAddingAbility}>
              <DialogTrigger asChild>
                <Button size="sm" className="mono-font hover-lift">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Ability
                </Button>
              </DialogTrigger>
              <AbilityDialog
                characterId={characterId}
                onSubmit={handleCreateAbility}
                onClose={() => setIsAddingAbility(false)}
              />
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalAbilities === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mono-font text-sm mb-4">
              {editable || showAddButton 
                ? "No abilities added yet. Click 'Add Ability' to get started." 
                : "No abilities defined for this character."}
            </p>
            {(editable || showAddButton) && (
              <Button 
                onClick={() => setIsAddingAbility(true)}
                variant="outline"
                className="mono-font hover-lift"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Ability
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Dynamic Grid Layout - Adapts to Content Amount */}
            <div className={`grid ${gridCols} gap-3`}>
              {abilities?.map((ability) => {
                const typeInfo = getAbilityTypeInfo(ability.ability_type);
                const TypeIcon = typeInfo.icon;
                const isExpanded = expandedAbilities.has(ability.id);
                const hasDescription = ability.description && ability.description.trim().length > 0;
                
                return (
                  <div
                    key={ability.id}
                    onClick={() => hasDescription && toggleAbilityExpansion(ability.id)}
                    className={`
                      relative ${cardSize} rounded-lg border transition-all duration-300 group
                      ${typeInfo.color} ${typeInfo.hover}
                      hover-lift ${hasDescription ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {(editable || showAddButton) && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAbility(ability);
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
                            handleDeleteAbility(ability.id);
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
                        <h5 className={`font-medium mono-font ${textSize.title} truncate`}>{ability.name}</h5>
                        {hasDescription && (
                          <div className="ml-auto">
                            <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-accent' : 'bg-muted-foreground/50'} transition-colors`} />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {typeInfo.label}
                        </Badge>
                        {hasDescription && !isExpanded && (
                          <span className="text-xs text-muted-foreground/70">Click to expand</span>
                        )}
                      </div>
                      {hasDescription && isExpanded && (
                        <p className={`${textSize.desc} text-muted-foreground leading-relaxed`}>
                          {ability.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Add New Ability Card - Integrated into Dynamic Grid */}
              {(editable || showAddButton) && (
                <div 
                  onClick={() => setIsAddingAbility(true)}
                  className={`
                    relative ${cardSize} rounded-lg border-2 border-dashed border-muted-foreground/30 
                    transition-all duration-300 cursor-pointer group
                    hover:border-accent hover:bg-accent/5 hover-lift
                    ${totalAbilities <= 3 ? 'min-h-[120px]' : totalAbilities <= 6 ? 'min-h-[100px]' : 'min-h-[80px]'} flex items-center justify-center
                  `}
                >
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className={`${totalAbilities <= 3 ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors`}>
                      <Plus className={`${totalAbilities <= 3 ? 'w-5 h-5' : 'w-4 h-4'} text-accent`} />
                    </div>
                    <div>
                      <p className={`${textSize.title} font-medium mono-font text-foreground group-hover:text-accent transition-colors`}>
                        Add New
                      </p>
                      <p className={`${textSize.desc} text-muted-foreground`}>
                        Ability
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      {/* Edit Ability Dialog */}
      {editingAbility && (
        <Dialog open={!!editingAbility} onOpenChange={() => setEditingAbility(null)}>
          <AbilityDialog
            characterId={characterId}
            ability={editingAbility}
            onSubmit={(updates) => {
              handleUpdateAbility(editingAbility.id, updates);
            }}
            onClose={() => setEditingAbility(null)}
          />
        </Dialog>
      )}
    </Card>
  );
};

// Ability Dialog Component
interface AbilityDialogProps {
  characterId: string;
  ability?: CharacterAbility;
  onSubmit: (ability: Omit<CharacterAbility, 'id' | 'created_at'>) => void;
  onClose: () => void;
}

const AbilityDialog: React.FC<AbilityDialogProps> = ({ characterId, ability, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: ability?.name || '',
    ability_type: ability?.ability_type || 'power',
    description: ability?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    onSubmit({
      character_id: characterId,
      name: formData.name.trim(),
      ability_type: formData.ability_type as 'power' | 'skill',
      description: formData.description.trim() || undefined
    });

    onClose();
  };

  const selectedTypeInfo = abilityTypes.find(t => t.id === formData.ability_type) || abilityTypes[0];
  const TypeIcon = selectedTypeInfo.icon;

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="mono-font flex items-center gap-2">
          <TypeIcon className="w-5 h-5 text-accent" />
          {ability ? 'Edit Ability' : 'Add New Ability'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Ability Name *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Telekinesis, Master Archer, Photographic Memory..."
            className="mono-font"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Type *
          </label>
          <Select 
            value={formData.ability_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, ability_type: value }))}
          >
            <SelectTrigger className="mono-font">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {abilityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {type.label}
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
            placeholder="Describe how this ability works, its limitations, or its effects..."
            rows={3}
            className="mono-font text-sm"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="mono-font hover-lift" disabled={!formData.name.trim()}>
            {ability ? 'Update Ability' : 'Add Ability'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="mono-font">
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EnhancedCharacterAbilities;