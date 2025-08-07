-- Create visual_references table for general visual assets
CREATE TABLE public.visual_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'concept-art',
  entity_type TEXT, -- 'character', 'location', 'chapter', 'story', 'general'
  entity_id UUID, -- Reference to the linked entity
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visual_references ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own visual references" 
ON public.visual_references 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visual references" 
ON public.visual_references 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visual references" 
ON public.visual_references 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visual references" 
ON public.visual_references 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_visual_references_updated_at
BEFORE UPDATE ON public.visual_references
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_visual_references_user_id ON public.visual_references(user_id);
CREATE INDEX idx_visual_references_entity ON public.visual_references(entity_type, entity_id);
CREATE INDEX idx_visual_references_tags ON public.visual_references USING GIN(tags);