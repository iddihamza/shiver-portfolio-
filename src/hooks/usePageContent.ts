import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PageContent {
  id: string;
  page_id: string;
  section_key: string;
  content: string;
  content_type: string;
}

export const usePageContent = (pageId: string, sectionKey: string, defaultContent: string = '') => {
  const [content, setContent] = useState<string>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchContent();
  }, [pageId, sectionKey]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_id', pageId)
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      if (data) {
        setContent(data.content);
      } else {
        setContent(defaultContent);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (newContent: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save content');
      return false;
    }

    try {
      setSaving(true);
      
      const { data: existingContent } = await supabase
        .from('page_content')
        .select('id')
        .eq('page_id', pageId)
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (existingContent) {
        // Update existing content
        const { error } = await supabase
          .from('page_content')
          .update({ 
            content: newContent,
            user_id: (await supabase.auth.getUser()).data.user?.id
          })
          .eq('page_id', pageId)
          .eq('section_key', sectionKey);

        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('page_content')
          .insert({
            page_id: pageId,
            section_key: sectionKey,
            content: newContent,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
      }

      setContent(newContent);
      toast.success('Content saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    content,
    loading,
    saving,
    saveContent,
    refetch: fetchContent
  };
};