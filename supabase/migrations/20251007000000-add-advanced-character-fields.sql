-- Add character_abilities table
CREATE TABLE IF NOT EXISTS public.character_abilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES public.character_profiles(id) ON DELETE CASCADE NOT NULL,
    ability_type TEXT CHECK (ability_type IN ('power','skill')) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add character_relationships table
CREATE TABLE IF NOT EXISTS public.character_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES public.character_profiles(id) ON DELETE CASCADE NOT NULL,
    relationship_type TEXT CHECK (relationship_type IN ('ally','rival','antagonist','romantic_connection','linked_character')) NOT NULL,
    character_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    related_character_id UUID REFERENCES public.character_profiles(id),
    is_bidirectional BOOLEAN DEFAULT FALSE
);

-- Add character_inspirations table
CREATE TABLE IF NOT EXISTS public.character_inspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES public.character_profiles(id) ON DELETE CASCADE NOT NULL,
    influence_name TEXT NOT NULL,
    influence_type TEXT,
    why_they_matter TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
