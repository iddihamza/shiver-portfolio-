/** ---------- Base "entity" ------------- */
export interface BaseEntity {
  id: number;              // globally unique
  title: string;           // display title
  tags: string[];          // semantic tags for search / filters
  route: string;           // `/characters/…`, `/multimedia/…`, etc.
}

/** ---------- Specific entities ---------- */
export interface Character extends BaseEntity {
  name: string;
  color: string;
  image: string | null;
  description: string;
  stats: Record<string, number>;
  background: string;
  quote: string;
  traits: string[];
  dynamic?: string;
  chapterAppearances: number[];
  locationConnections: number[];
  caseInvolvement: number[];
}

export interface Chapter extends BaseEntity {
  name: string;
  color: string;
  image: string;
  description?: string;
  summary?: string;
  content?: string;              // Markdown or HTML
  charactersAppearing: number[];
  locationsVisited: number[];
  casesReferenced: number[];
}

export interface CaseFile extends BaseEntity {
  status: string;
  classification: string;
  date: string;
  description: string;
  evidence: string[];
  outcome: string;
  summary?: string;
  suspectIds?: number[];
  charactersInvolved: number[];
  locationsInvolved: number[];
  chaptersReferenced: number[];
}

export interface Location extends BaseEntity {
  name: string;
  district: string;
  status: string;
  description: string;
  significance: string;
  dangers: string[];
  accessibility: string;
  image: string;
  coordinates?: [number, number]; // if you ever add maps
  charactersPresent: number[];
  chaptersVisited: number[];
  casesOccurred: number[];
}

export interface MultimediaItem extends BaseEntity {
  type: 'image' | 'video' | 'audio' | 'document' | 'Visual Art' | 'Audio' | 'Video';
  category: string;         // "promo-art", "OST", etc.
  description: string;
  thumbnail: string | null;
  src?: string;              // URL or import()
  items?: number;           // number of items in collection
  status?: string;          // "Available", "Coming Soon", etc.
}

/** ---------- Discriminated union -------- */
export type Entity =
  | { kind: 'character'; data: Character }
  | { kind: 'chapter';   data: Chapter }
  | { kind: 'case';      data: CaseFile }
  | { kind: 'location';  data: Location }
  | { kind: 'media';     data: MultimediaItem };

/** ---------- Legacy compatibility -------- */
export interface SearchableContent {
  type: 'character' | 'chapter' | 'location' | 'case' | 'media';
  id: number;
  title: string;
  description: string;
  tags: string[];
  route?: string;
  image?: string | null;
}