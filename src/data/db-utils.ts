import { db } from './shiver-database';
import {
  Character, Chapter, CaseFile, Location, MultimediaItem, BaseEntity
} from './types';
import { supabase } from '@/integrations/supabase/client';
import { mapCharacterProfileToCharacter, mapChapterDataToChapter, mapLocationDataToLocation } from '@/utils/dataMapping';

/* ---------- ID helper ---------- */
let nextId = Math.max(
  ...Object.values(db).flat().map((e: BaseEntity) => e.id)
) + 1;

// Load data from Supabase to replace static database
async function loadSupabaseData() {
  try {
    const { data: spChars } = await supabase.from('character_profiles').select('*');
    if (spChars) {
      // Create new arrays instead of modifying read-only properties
      const mappedCharacters = spChars.map(mapCharacterProfileToCharacter);
      Object.assign(db, { characters: mappedCharacters });
    }
    const { data: spChapters } = await supabase.from('chapters').select('*');
    if (spChapters) {
      const mappedChapters = spChapters.map((chapter: any) => mapChapterDataToChapter(chapter));
      Object.assign(db, { chapters: mappedChapters });
    }
    const { data: spLocations } = await supabase.from('locations').select('*');
    if (spLocations) {
      const mappedLocations = spLocations.map(mapLocationDataToLocation);
      Object.assign(db, { locations: mappedLocations });
    }
  } catch (err) {
    console.error('Failed to load data from Supabase', err);
  }
}

loadSupabaseData();

/* ---------- Generic add ---------- */
function addEntity<T extends BaseEntity>(
  collection: T[], payload: Omit<T, 'id'>
): T {
  const entity = { id: nextId++, ...payload } as T;
  collection.push(entity);
  return entity;
}

/* ---------- Safe updaters ---------- */
function updateEntity<T extends BaseEntity>(
  collection: T[], id: number, patch: Partial<Omit<T,'id'>>
): T {
  const idx = collection.findIndex(e => e.id === id);
  if (idx === -1) throw new Error(`Entity ${id} not found`);
  collection[idx] = { ...collection[idx], ...patch };
  return collection[idx];
}

/* ---------- Generic getters ---------- */
function getEntity<T extends BaseEntity>(
  collection: T[], id: number
): T | undefined {
  return collection.find(e => e.id === id);
}

function getEntitiesByIds<T extends BaseEntity>(
  collection: T[], ids: number[]
): T[] {
  return collection.filter(e => ids.includes(e.id));
}

/* ---------- Specialised APIs ---------- */
export const CharacterAPI = {
  add: (p: Omit<Character,'id'>) => addEntity(db.characters, p),
  update: (id: number, patch: Partial<Omit<Character,'id'>>) =>
    updateEntity(db.characters, id, patch),
  get: (id: number) => getEntity(db.characters, id),
  getByIds: (ids: number[]) => getEntitiesByIds(db.characters, ids),
  getAll: () => db.characters,
  getChapters: (characterId: number) => {
    const character = getEntity(db.characters, characterId) as Character | undefined;
    return character ? getEntitiesByIds(db.chapters, character.chapterAppearances) : [];
  },
  getLocations: (characterId: number) => {
    const character = getEntity(db.characters, characterId) as Character | undefined;
    return character ? getEntitiesByIds(db.locations, character.locationConnections) : [];
  },
  getCases: (characterId: number) => {
    const character = getEntity(db.characters, characterId) as Character | undefined;
    return character ? getEntitiesByIds(db.cases, character.caseInvolvement) : [];
  }
};

export const ChapterAPI = {
  add: (p: Omit<Chapter,'id'>) => addEntity(db.chapters, p),
  update: (id: number, patch: Partial<Omit<Chapter,'id'>>) =>
    updateEntity(db.chapters, id, patch),
  get: (id: number) => getEntity(db.chapters, id),
  getByIds: (ids: number[]) => getEntitiesByIds(db.chapters, ids),
  getAll: () => db.chapters,
  getCharacters: (chapterId: number) => {
    const chapter = getEntity(db.chapters, chapterId) as Chapter | undefined;
    return chapter ? getEntitiesByIds(db.characters, chapter.charactersAppearing) : [];
  },
  getLocations: (chapterId: number) => {
    const chapter = getEntity(db.chapters, chapterId) as Chapter | undefined;
    return chapter ? getEntitiesByIds(db.locations, chapter.locationsVisited) : [];
  },
  getCases: (chapterId: number) => {
    const chapter = getEntity(db.chapters, chapterId) as Chapter | undefined;
    return chapter ? getEntitiesByIds(db.cases, chapter.casesReferenced) : [];
  }
};

export const CaseAPI = {
  add: (p: Omit<CaseFile,'id'>) => addEntity(db.cases, p),
  update: (id: number, patch: Partial<Omit<CaseFile,'id'>>) =>
    updateEntity(db.cases, id, patch),
  get: (id: number) => getEntity(db.cases, id),
  getByIds: (ids: number[]) => getEntitiesByIds(db.cases, ids),
  getAll: () => db.cases,
  getCharacters: (caseId: number) => {
    const caseFile = getEntity(db.cases, caseId) as CaseFile | undefined;
    return caseFile ? getEntitiesByIds(db.characters, caseFile.charactersInvolved) : [];
  },
  getLocations: (caseId: number) => {
    const caseFile = getEntity(db.cases, caseId) as CaseFile | undefined;
    return caseFile ? getEntitiesByIds(db.locations, caseFile.locationsInvolved) : [];
  },
  getChapters: (caseId: number) => {
    const caseFile = getEntity(db.cases, caseId) as CaseFile | undefined;
    return caseFile ? getEntitiesByIds(db.chapters, caseFile.chaptersReferenced) : [];
  }
};

export const LocationAPI = {
  add: (p: Omit<Location,'id'>) => addEntity(db.locations, p),
  update: (id: number, patch: Partial<Omit<Location,'id'>>) =>
    updateEntity(db.locations, id, patch),
  get: (id: number) => getEntity(db.locations, id),
  getByIds: (ids: number[]) => getEntitiesByIds(db.locations, ids),
  getAll: () => db.locations,
  getCharacters: (locationId: number) => {
    const location = getEntity(db.locations, locationId) as Location | undefined;
    return location ? getEntitiesByIds(db.characters, location.charactersPresent) : [];
  },
  getChapters: (locationId: number) => {
    const location = getEntity(db.locations, locationId) as Location | undefined;
    return location ? getEntitiesByIds(db.chapters, location.chaptersVisited) : [];
  },
  getCases: (locationId: number) => {
    const location = getEntity(db.locations, locationId) as Location | undefined;
    return location ? getEntitiesByIds(db.cases, location.casesOccurred) : [];
  }
};

export const MultimediaAPI = {
  add: (p: Omit<MultimediaItem,'id'>) => addEntity(db.multimedia, p),
  update: (id: number, patch: Partial<Omit<MultimediaItem,'id'>>) =>
    updateEntity(db.multimedia, id, patch),
  get: (id: number) => getEntity(db.multimedia, id),
  getByIds: (ids: number[]) => getEntitiesByIds(db.multimedia, ids),
  getAll: () => db.multimedia,
  getByType: (type: string) => db.multimedia.filter(m => m.type === type),
  getByCategory: (category: string) => db.multimedia.filter(m => m.category === category)
};

/* ---------- Cross-entity relationships ---------- */
export function getRelated(entity: { kind: string; data: BaseEntity }) {
  switch (entity.kind) {
    case 'character': {
      const character = entity.data as Character;
      return {
        chapters: ChapterAPI.getByIds(character.chapterAppearances),
        locations: LocationAPI.getByIds(character.locationConnections),
        cases: CaseAPI.getByIds(character.caseInvolvement)
      };
    }
    case 'chapter': {
      const chapter = entity.data as Chapter;
      return {
        characters: CharacterAPI.getByIds(chapter.charactersAppearing),
        locations: LocationAPI.getByIds(chapter.locationsVisited),
        cases: CaseAPI.getByIds(chapter.casesReferenced)
      };
    }
    case 'case': {
      const caseFile = entity.data as CaseFile;
      return {
        characters: CharacterAPI.getByIds(caseFile.charactersInvolved),
        locations: LocationAPI.getByIds(caseFile.locationsInvolved),
        chapters: ChapterAPI.getByIds(caseFile.chaptersReferenced)
      };
    }
    case 'location': {
      const location = entity.data as Location;
      return {
        characters: CharacterAPI.getByIds(location.charactersPresent),
        chapters: ChapterAPI.getByIds(location.chaptersVisited),
        cases: CaseAPI.getByIds(location.casesOccurred)
      };
    }
    default:
      return {};
  }
}