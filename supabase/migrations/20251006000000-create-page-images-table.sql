-- Create table for editable page images
CREATE TABLE public.page_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id text NOT NULL,
  section_key text NOT NULL,
  image_url text,
  width numeric,
  height numeric,
  pos_x numeric,
  pos_y numeric,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_id, section_key)
);

-- Enable Row Level Security
ALTER TABLE public.page_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view page images"
  ON public.page_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can create page images"
  ON public.page_images
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page images"
  ON public.page_images
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete page images"
  ON public.page_images
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_page_images_updated_at
  BEFORE UPDATE ON public.page_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
