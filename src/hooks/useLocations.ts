
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export interface Location {
  id: string;
  user_id: string;
  story_id?: string | null;
  name: string;
  location_type?: string | null;
  primary_function?: string | null;
  summary?: string | null;
  key_scenes?: string[] | null;
  story_importance?: string | null;
  visual_mood?: string | null;
  sensory_details?: string | null;
  weather_effects?: string | null;
  cultural_feel?: string | null;
  core_symbolism?: string | null;
  recurring_motifs?: string[] | null;
  emotional_weight?: string | null;
  notes?: string | null;
  connected_characters?: string[] | null;
  related_artifacts?: string[] | null;
  visual_references?: Json | null;
  created_at: string;
  updated_at: string;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Location[];
    },
  });
};

export const useLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['location', locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Location | null;
    },
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (location: Omit<Location, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('locations')
        .insert([{ ...location, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Success",
        description: "Location created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create location: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Location> & { id: string }) => {
      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', data.id] });
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update location: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete location: " + error.message,
        variant: "destructive",
      });
    },
  });
};
