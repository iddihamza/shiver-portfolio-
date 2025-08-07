import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VisualReference {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  entity_type?: string;
  entity_id?: string;
  image_url: string;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useVisualReferences = () => {
  return useQuery({
    queryKey: ['visual-references'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visual_references')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VisualReference[];
    },
  });
};

export const useCreateVisualReference = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reference: Omit<VisualReference, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('visual_references')
        .insert([{ ...reference, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visual-references'] });
      toast({
        title: "Success",
        description: "Visual reference created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create visual reference: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVisualReference = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<VisualReference> & { id: string }) => {
      const { data, error } = await supabase
        .from('visual_references')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visual-references'] });
      toast({
        title: "Success",
        description: "Visual reference updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update visual reference: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteVisualReference = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('visual_references')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visual-references'] });
      toast({
        title: "Success",
        description: "Visual reference deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete visual reference: " + error.message,
        variant: "destructive",
      });
    },
  });
};