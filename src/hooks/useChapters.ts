
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Chapter {
  id: string;
  story_id: string;
  title: string;
  chapter_number: number;
  summary?: string;
  content_plain?: string;
  content_xml?: string;
  word_count?: number;
  status?: string;
  cover_image_url?: string | null;
  themes?: string[];
  linked_characters?: string[];
  linked_locations?: string[];
  created_at: string;
  updated_at: string;
}

export const useChapters = (storyId?: string) => {
  return useQuery({
    queryKey: ['chapters', storyId],
    queryFn: async () => {
      let query = supabase.from('chapters').select('*');
      
      if (storyId) {
        query = query.eq('story_id', storyId);
      }
      
      const { data, error } = await query.order('chapter_number', { ascending: true });
      
      if (error) throw error;
      return data as Chapter[];
    },
  });
};

export const useChapter = (chapterId: string) => {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Chapter | null;
    },
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (chapter: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chapters')
        .insert([{ ...chapter, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      queryClient.invalidateQueries({ queryKey: ['chapters', data.story_id] });
      toast({
        title: "Success",
        description: "Chapter created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create chapter: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (chapter: Partial<Chapter> & { id: string }) => {
      const { id, ...updates } = chapter;
      const { data, error } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Chapter;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      queryClient.invalidateQueries({ queryKey: ['chapters', data.story_id] });
      queryClient.invalidateQueries({ queryKey: ['chapter', data.id] });
      toast({
        title: 'Success',
        description: 'Chapter updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update chapter: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (chapterId: string) => {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

      if (error) throw error;
    },
    onSuccess: (_, chapterId) => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
      toast({
        title: 'Success',
        description: 'Chapter deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete chapter: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};
