-- Ensure chapters table has optional cover image URL
ALTER TABLE public.chapters
ADD COLUMN IF NOT EXISTS cover_image_url text;
