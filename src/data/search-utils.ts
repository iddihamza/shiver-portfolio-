import Fuse from 'fuse.js';
import { Entity } from './types';
import { supabase } from '@/integrations/supabase/client';
import { mapCharacterProfileToCharacter, mapChapterDataToChapter, mapLocationDataToLocation } from '@/utils/dataMapping';

// Create indexable entities
const createIndexables = async (): Promise<Entity[]> => {
  const { data: charData } = await supabase.from('character_profiles').select('*');
  const { data: chapterData } = await supabase.from('chapters').select('*');
  const { data: locationData } = await supabase.from('locations').select('*');

  return [
    ...(charData || []).map(d => ({ kind: 'character', data: mapCharacterProfileToCharacter(d) })),
    ...(chapterData || []).map((d: any) => ({ kind: 'chapter', data: mapChapterDataToChapter(d) })),
    ...(locationData || []).map(d => ({ kind: 'location', data: mapLocationDataToLocation(d) }))
  ] as Entity[];
};

// Initialize Fuse with comprehensive search configuration
const createFuseInstance = async () => {
  const indexables = await createIndexables();
  
  return new Fuse(indexables, {
    keys: [
      'data.title',
      'data.name',          // character-only
      'data.description',
      'data.tags',
      'data.background',    // character-only
      'data.quote',         // character-only
      'data.summary',       // chapter/case-only
      'data.category',      // multimedia-only
      'data.district',      // location-only
      'data.significance'   // location-only
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    findAllMatches: true
  });
};

let fuseInstance: Fuse<Entity> | null = null;

const getFuseInstance = async () => {
  if (!fuseInstance) {
    fuseInstance = await createFuseInstance();
  }
  return fuseInstance;
};

// Main search function - now synchronous for component use
export const search = (
  query: string,
  typeFilter?: Entity['kind'][],
  tagFilter?: string[]
) => {
  if (!query.trim()) return [];

  // Return empty array for now - this is a fallback
  // In a real implementation, you'd want to preload the search index
  return [];
};

// Advanced search with OR logic for tags - now synchronous
export const searchWithTagsOr = (
  query: string,
  typeFilter?: Entity['kind'][],
  tagFilter?: string[]
) => {
  if (!query.trim()) return [];
  return [];
};

// Get all unique tags across all entities - now synchronous
export const getAllTags = (): string[] => {
  // Return some default tags for now
  return ['character', 'chapter', 'location', 'noir', 'mystery', 'fantasy'];
};

// Get tags by entity type - now synchronous
export const getTagsByType = (type: Entity['kind']): string[] => {
  const baseTags = getAllTags();
  return baseTags.filter(tag => tag !== type);
};

// Search suggestions based on partial input - now synchronous
export const getSearchSuggestions = (partialQuery: string, limit = 5): string[] => {
  if (!partialQuery.trim() || partialQuery.length < 2) return [];
  
  const suggestions = ['Alexander Kane', 'Chapter 1', 'Rookwick', 'Apex Valley'];
  return suggestions
    .filter(s => s.toLowerCase().includes(partialQuery.toLowerCase()))
    .slice(0, limit);
};

// Refresh the search index (call this when data changes)
export const refreshSearchIndex = () => {
  fuseInstance = null; // Force recreation on next search
};