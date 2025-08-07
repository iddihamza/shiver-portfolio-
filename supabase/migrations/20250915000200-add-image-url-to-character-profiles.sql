-- Add image_url column to character_profiles table for character profile images
ALTER TABLE public.character_profiles
ADD COLUMN IF NOT EXISTS image_url TEXT;
