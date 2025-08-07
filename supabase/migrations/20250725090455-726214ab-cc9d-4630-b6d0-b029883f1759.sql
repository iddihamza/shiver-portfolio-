-- Create page_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.page_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL,
  section_key TEXT NOT NULL,
  image_url TEXT,
  width INTEGER,
  height INTEGER,
  pos_x INTEGER,
  pos_y INTEGER,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_id, section_key)
);

-- Enable Row Level Security
ALTER TABLE public.page_images ENABLE ROW LEVEL SECURITY;

-- Create policies for page_images
CREATE POLICY "Admins can manage page images" 
ON public.page_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view page images" 
ON public.page_images 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_images_updated_at
BEFORE UPDATE ON public.page_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();