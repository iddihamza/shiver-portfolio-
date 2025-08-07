-- Allow anyone to read chapters and character profiles

-- Enable row level security on chapters and character_profiles
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_profiles ENABLE ROW LEVEL SECURITY;

-- Policy so anyone can read chapters
CREATE POLICY "Public read on chapters"
  ON public.chapters
  FOR SELECT
  USING (true);

-- Policy so anyone can read character profiles
CREATE POLICY "Public read on character_profiles"
  ON public.character_profiles
  FOR SELECT
  USING (true);
