import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SaveOptions {
  imageUrl?: string | null;
  width?: number | null;
  height?: number | null;
  posX?: number | null;
  posY?: number | null;
}

export const usePageImage = (pageId: string, sectionKey: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchImage();
  }, [pageId, sectionKey]);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_images')
        .select('*')
        .eq('page_id', pageId)
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) {
        console.error('Error fetching image:', error);
        return;
      }

      if (data) {
        setImageUrl(data.image_url);
        setWidth(data.width);
        setHeight(data.height);
        setPosX(data.pos_x);
        setPosY(data.pos_y);
      } else {
        setImageUrl(null);
        setWidth(null);
        setHeight(null);
        setPosX(null);
        setPosY(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveImage = async (opts: SaveOptions) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save content');
      return false;
    }

    try {
      setSaving(true);

      const { data: existing } = await supabase
        .from('page_images')
        .select('id')
        .eq('page_id', pageId)
        .eq('section_key', sectionKey)
        .maybeSingle();

      const payload = {
        image_url: opts.imageUrl,
        width: opts.width,
        height: opts.height,
        pos_x: opts.posX,
        pos_y: opts.posY,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      if (existing) {
        const { error } = await supabase
          .from('page_images')
          .update(payload)
          .eq('page_id', pageId)
          .eq('section_key', sectionKey);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_images')
          .insert({ ...payload, page_id: pageId, section_key: sectionKey });
        if (error) throw error;
      }

      toast.success('Image saved successfully');
      await fetchImage();
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    imageUrl,
    width,
    height,
    posX,
    posY,
    loading,
    saving,
    saveImage,
    refetch: fetchImage
  };
};
