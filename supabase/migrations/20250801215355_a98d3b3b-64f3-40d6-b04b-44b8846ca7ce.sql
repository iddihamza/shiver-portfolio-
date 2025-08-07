-- Allow public read access to character abilities
CREATE POLICY "Enable read access for all users on character abilities" 
ON public.character_abilities 
FOR SELECT 
USING (true);