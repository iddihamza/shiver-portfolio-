
import type { Character, Chapter, Location } from '@/data/types';
import type { CharacterProfile } from '@/hooks/useCharacters';
import type { Chapter as ChapterData } from '@/hooks/useChapters';
import type { Location as LocationData } from '@/hooks/useLocations';

// Map Supabase character profile to legacy character format
export const mapCharacterProfileToCharacter = (profile: CharacterProfile): Character => {
  return {
    id: parseInt(profile.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
    title: profile.full_name,
    name: profile.full_name,
    color: 'blue', // Default color, could be stored in profile later
    image: profile.img_url || null,
    description: profile.summary_tagline || profile.role_in_story || '',
    stats: {}, // Could be calculated from abilities/traits
    background: profile.backstory || '',
    quote: '', // Could be stored separately
    traits: profile.notable_traits_array || [],
    tags: ['character', ...(profile.affiliations_array || [])],
    route: `/character/${profile.id}`,
    chapterAppearances: [], // Will be populated from chapter data
    locationConnections: [], // Will be populated from location data
    caseInvolvement: [], // Legacy field
  };
};

// Map Supabase chapter to legacy chapter format
export const mapChapterDataToChapter = (chapter: ChapterData): Chapter => {
  const coverImageUrl = chapter.cover_image_url || '';

  return {
    id: parseInt(chapter.id.replace(/-/g, '').substring(0, 8), 16),
    title: chapter.title,
    name: chapter.title,
    color: 'purple', // Default color
    image: coverImageUrl,
    description: chapter.summary || '',
    summary: chapter.summary || '',
    content: chapter.content_plain || chapter.content_xml || '',
    tags: ['chapter', ...(chapter.themes || [])],
    route: chapter.id,
    charactersAppearing: [], // Will need to parse from content or separate table
    locationsVisited: [], // Will need to parse from content or separate table
    casesReferenced: [], // Legacy field
  };
};

// Map Supabase location to legacy location format
export const mapLocationDataToLocation = (location: LocationData): Location => {
  return {
    id: parseInt(location.id.replace(/-/g, '').substring(0, 8), 16),
    title: location.name,
    name: location.name,
    district: location.location_type || 'Unknown',
    status: 'Active', // Default status
    description: location.summary || '',
    significance: location.story_importance || '',
    dangers: [], // Default empty array since this isn't in the database
    accessibility: 'Unknown', // Default accessibility
    image: '', // Default empty image
    tags: ['location', location.location_type || ''].filter(Boolean),
    route: `/location/${location.id}`,
    charactersPresent: [], // Will be populated from relationships
    chaptersVisited: [], // Will be populated from chapter references
    casesOccurred: [], // Legacy field
  };
};
