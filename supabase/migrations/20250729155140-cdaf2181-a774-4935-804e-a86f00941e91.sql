-- Add story_id to character_profiles table
ALTER TABLE public.character_profiles 
ADD COLUMN story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE;

-- Add story_id to locations table  
ALTER TABLE public.locations
ADD COLUMN story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE;

-- Update RLS policies for character_profiles to include story access
DROP POLICY IF EXISTS "Users can view their own character profiles" ON public.character_profiles;
DROP POLICY IF EXISTS "Users can create their own character profiles" ON public.character_profiles;
DROP POLICY IF EXISTS "Users can update their own character profiles" ON public.character_profiles;
DROP POLICY IF EXISTS "Users can delete their own character profiles" ON public.character_profiles;

CREATE POLICY "Users can view characters from their stories" 
ON public.character_profiles 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = get_story_user_id(story_id));

CREATE POLICY "Users can create characters for their stories" 
ON public.character_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND (story_id IS NULL OR auth.uid() = get_story_user_id(story_id)));

CREATE POLICY "Users can update characters from their stories" 
ON public.character_profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = get_story_user_id(story_id));

CREATE POLICY "Users can delete characters from their stories" 
ON public.character_profiles 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = get_story_user_id(story_id));

-- Update RLS policies for locations to include story access
DROP POLICY IF EXISTS "Users can view their own locations" ON public.locations;
DROP POLICY IF EXISTS "Users can create their own locations" ON public.locations;
DROP POLICY IF EXISTS "Users can update their own locations" ON public.locations;
DROP POLICY IF EXISTS "Users can delete their own locations" ON public.locations;

CREATE POLICY "Users can view locations from their stories" 
ON public.locations 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = get_story_user_id(story_id));

CREATE POLICY "Users can create locations for their stories" 
ON public.locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND (story_id IS NULL OR auth.uid() = get_story_user_id(story_id)));

CREATE POLICY "Users can update locations from their stories" 
ON public.locations 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = get_story_user_id(story_id));

CREATE POLICY "Users can delete locations from their stories" 
ON public.locations 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = get_story_user_id(story_id));