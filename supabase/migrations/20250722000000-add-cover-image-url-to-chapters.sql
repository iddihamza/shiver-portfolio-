-- Add cover image URL field for chapter cover art
ALTER TABLE public.chapters
ADD COLUMN cover_image_url text;
