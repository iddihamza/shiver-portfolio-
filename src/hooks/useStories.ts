
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Story {
  id: string;
  title: string;
  summary?: string;
  status?: string;
  genre?: string;
  word_count?: number;
  target_word_count?: number;
  themes?: string[];
  tags?: string[];
  target_audience?: string;
  notes?: string;
  narrative_devices?: string[];
  series_id?: string;
  estimated_read_time_minutes?: number;
  structure?: any;
  created_at: string;
  updated_at: string;
}

export const useStories = () => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Story[];
    },
  });
};

export const useStory = (storyId: string) => {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Story | null;
    },
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (story: Omit<Story, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('stories')
        .insert([{ ...story, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast({
        title: "Success",
        description: "Story created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create story: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Story> & { id: string }) => {
      const { data, error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', data.id] });
      toast({
        title: "Success",
        description: "Story updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update story: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast({
        title: "Success",
        description: "Story deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete story: " + error.message,
        variant: "destructive",
      });
    },
  });
};
