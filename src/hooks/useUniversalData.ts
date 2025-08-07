
import { useQuery } from '@tanstack/react-query';
import { useStories } from './useStories';
import { useChapters } from './useChapters';
import { useCharacterProfiles } from './useCharacters';
import { useLocations } from './useLocations';
import { mapCharacterProfileToCharacter, mapChapterDataToChapter, mapLocationDataToLocation } from '@/utils/dataMapping';
import type { SearchableContent } from '@/data/types';

export const useUniversalData = () => {
  const { data: stories = [], isLoading: storiesLoading } = useStories();
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const { data: characters = [], isLoading: charactersLoading } = useCharacterProfiles();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();

  const isLoading = storiesLoading || chaptersLoading || charactersLoading || locationsLoading;

  // Convert all data to searchable content format
  const searchableContent: SearchableContent[] = [
    // Characters
    ...characters.map(character => ({
      type: 'character' as const,
      id: parseInt(character.id.replace(/-/g, '').substring(0, 8), 16),
      title: character.full_name,
      description: character.summary_tagline || character.role_in_story || '',
      tags: ['character', ...(character.affiliations_array || [])],
      route: `/character/${character.id}`,
      image: character.img_url || null,
    })),
    
    // Chapters
    ...chapters.map(chapter => ({
      type: 'chapter' as const,
      id: parseInt(chapter.id.replace(/-/g, '').substring(0, 8), 16),
      title: chapter.title,
      description: chapter.summary || '',
      tags: ['chapter', ...(chapter.themes || [])],
      route: `/chapter/${chapter.id}`,
      image: null,
    })),
    
    // Locations
    ...locations.map(location => ({
      type: 'location' as const,
      id: parseInt(location.id.replace(/-/g, '').substring(0, 8), 16),
      title: location.name,
      description: location.summary || '',
      tags: ['location', location.location_type || ''].filter(Boolean),
      route: `/location/${location.id}`,
      image: null,
    })),
  ];

  return {
    // Raw data
    stories,
    chapters,
    characters,
    locations,
    
    // Mapped data for legacy compatibility
    mappedCharacters: characters.map(mapCharacterProfileToCharacter),
    mappedChapters: chapters.map(mapChapterDataToChapter),
    mappedLocations: locations.map(mapLocationDataToLocation),
    
    // Searchable content
    searchableContent,
    
    // Loading state
    isLoading,
    
    // Stats
    stats: {
      totalEntities: searchableContent.length,
      characters: characters.length,
      chapters: chapters.length,
      locations: locations.length,
      stories: stories.length,
    },
  };
};
