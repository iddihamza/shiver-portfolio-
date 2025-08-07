
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CharacterProfile {
  id: string;
  user_id: string;
  story_id?: string;
  full_name: string;
  title?: string;
  aliases_nicknames?: string;
  species_race?: string;
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  summary_tagline?: string;
  core_motivation?: string;
  backstory?: string;
  role_in_story?: string;
  img_url?: string | null;
  notable_traits_array?: string[];
  affiliations_array?: string[];
  created_at: string;
  updated_at: string;
}

export interface CharacterAbility {
  id: string;
  character_id: string;
  ability_type: 'power' | 'skill';
  name: string;
  description?: string | null;
  created_at: string;
}

export interface CharacterRelationship {
  id: string;
  character_id: string;
  relationship_type: 'ally' | 'rival' | 'antagonist' | 'romantic_connection' | 'linked_character';
  character_name: string;
  description?: string | null;
  related_character_id?: string | null;
  is_bidirectional?: boolean | null;
  created_at: string;
}

export interface CharacterInspiration {
  id: string;
  character_id: string;
  influence_name: string;
  influence_type?: string | null;
  why_they_matter?: string | null;
  created_at: string;
}

export const useCharacterProfiles = () => {
  return useQuery({
    queryKey: ['character-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_profiles')
        .select('*')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data as CharacterProfile[];
    },
  });
};

export const useCharacterProfile = (characterId: string) => {
  return useQuery({
    queryKey: ['character-profile', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_profiles')
        .select('*')
        .eq('id', characterId)
        .maybeSingle();
      
      if (error) throw error;
      return data as CharacterProfile | null;
    },
  });
};

export const useCreateCharacterProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (character: Omit<CharacterProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('character_profiles')
        .insert([{ ...character, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character-profiles'] });
      toast({
        title: "Success",
        description: "Character profile created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create character profile: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCharacterProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (character: Partial<CharacterProfile> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('character_profiles')
        .update(character)
        .eq('id', character.id)
        .eq('user_id', user.user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['character-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['character-profile', data.id] });
      toast({
        title: "Success",
        description: "Character profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update character profile: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCharacterAbilities = (characterId: string) => {
  return useQuery({
    queryKey: ['character-abilities', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_abilities')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as CharacterAbility[];
    },
  });
};

export const useCreateCharacterAbility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      ability: Omit<CharacterAbility, 'id' | 'created_at'>
    ) => {
      const { data, error } = await supabase
        .from('character_abilities')
        .insert([ability])
        .select()
        .single();
      if (error) throw error;
      return data as CharacterAbility;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['character-abilities', data.character_id],
      });
      toast({ title: 'Success', description: 'Ability saved' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save ability: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCharacterRelationships = (characterId: string) => {
  return useQuery({
    queryKey: ['character-relationships', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as CharacterRelationship[];
    },
  });
};

export const useCreateCharacterRelationship = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      relationship: Omit<CharacterRelationship, 'id' | 'created_at'>
    ) => {
      const { data, error } = await supabase
        .from('character_relationships')
        .insert([relationship])
        .select()
        .single();
      if (error) throw error;
      return data as CharacterRelationship;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['character-relationships', data.character_id],
      });
      toast({ title: 'Success', description: 'Relationship saved' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save relationship: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCharacterInspirations = (characterId: string) => {
  return useQuery({
    queryKey: ['character-inspirations', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_inspirations')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as CharacterInspiration[];
    },
  });
};

export const useCreateCharacterInspiration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      inspiration: Omit<CharacterInspiration, 'id' | 'created_at'>
    ) => {
      const { data, error } = await supabase
        .from('character_inspirations')
        .insert([inspiration])
        .select()
        .single();
      if (error) throw error;
      return data as CharacterInspiration;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['character-inspirations', data.character_id],
      });
      toast({ title: 'Success', description: 'Inspiration saved' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save inspiration: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};
