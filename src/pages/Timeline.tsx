import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  BookOpen, 
  Users, 
  MapPin, 
  Calendar,
  Filter,
  ArrowRight,
  Eye,
  Heart,
  Zap
} from 'lucide-react';
import { useChapters } from '@/hooks/useChapters';
import { useCharacterProfiles } from '@/hooks/useCharacters';
import { useLocations } from '@/hooks/useLocations';
import { mapCharacterProfileToCharacter, mapChapterDataToChapter, mapLocationDataToLocation } from '@/utils/dataMapping';

interface TimelineEvent {
  id: string;
  type: 'chapter' | 'character' | 'location';
  title: string;
  subtitle?: string;
  description: string;
  chapter?: number;
  tags: string[];
  connections: string[];
  timestamp: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

const Timeline = () => {
  const [filter, setFilter] = useState<'all' | 'chapters' | 'characters' | 'locations'>('all');
  const [selectedImportance, setSelectedImportance] = useState<string[]>(['low', 'medium', 'high', 'critical']);

  const { data: chapterData = [] } = useChapters();
  const { data: characterData = [] } = useCharacterProfiles();
  const { data: locationData = [] } = useLocations();

  const chapters = chapterData.map(mapChapterDataToChapter);
  const characters = characterData.map(mapCharacterProfileToCharacter);
  const locations = locationData.map(mapLocationDataToLocation);

  // Create timeline events from existing data
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add chapter events
    chapters.forEach((chapter, index) => {
      events.push({
        id: `chapter-${chapter.id}`,
        type: 'chapter',
        title: chapter.title,
        subtitle: chapter.name,
        description: chapter.summary || chapter.description || "A significant chapter in the Shiver story.",
        chapter: index + 1,
        tags: chapter.tags || [],
        connections: [
          ...(chapter.charactersAppearing?.map(id => characters.find(c => c.id === id)?.name).filter(Boolean) || []),
          ...(chapter.locationsVisited?.map(id => locations.find(l => l.id === id)?.name).filter(Boolean) || [])
        ],
        timestamp: `Chapter ${index + 1}`,
        importance: chapter.title?.toLowerCase().includes('climax') ? 'critical' : 
                   chapter.title?.toLowerCase().includes('final') ? 'high' : 'medium'
      });
    });

    // Add character introduction events
    characters.forEach((character) => {
      const firstAppearance = chapters.find(ch => 
        ch.charactersAppearing?.includes(character.id)
      );
      
      events.push({
        id: `character-${character.id}`,
        type: 'character',
        title: `${character.name} Introduction`,
        subtitle: character.title,
        description: character.description || `${character.name} enters the story.`,
        chapter: firstAppearance ? chapters.indexOf(firstAppearance) + 1 : 1,
        tags: character.tags || [],
        connections: character.traits?.slice(0, 3) || [],
        timestamp: `Chapter ${firstAppearance ? chapters.indexOf(firstAppearance) + 1 : 1}`,
        importance: character.title?.toLowerCase().includes('main') ? 'high' : 'medium'
      });
    });

    // Add location events
    locations.forEach((location) => {
      const firstMention = chapters.find(ch => 
        ch.locationsVisited?.includes(location.id)
      );
      
      events.push({
        id: `location-${location.id}`,
        type: 'location',
        title: `${location.name} Revealed`,
        subtitle: location.district,
        description: location.description || `The location ${location.name} is introduced.`,
        chapter: firstMention ? chapters.indexOf(firstMention) + 1 : 1,
        tags: location.tags || [],
        connections: location.charactersPresent?.map(id => characters.find(c => c.id === id)?.name).filter(Boolean)?.slice(0, 3) || [],
        timestamp: `Chapter ${firstMention ? chapters.indexOf(firstMention) + 1 : 1}`,
        importance: location.significance?.toLowerCase().includes('high') ? 'high' : 
                   location.significance?.toLowerCase().includes('critical') ? 'critical' : 'medium'
      });
    });

    // Sort by chapter number
    return events.sort((a, b) => (a.chapter || 0) - (b.chapter || 0));
  }, [chapters, characters, locations]);

  const filteredEvents = timelineEvents.filter(event => {
    const typeMatch = filter === 'all' || 
      (filter === 'chapters' && event.type === 'chapter') ||
      (filter === 'characters' && event.type === 'character') ||
      (filter === 'locations' && event.type === 'location');
    
    const importanceMatch = selectedImportance.includes(event.importance);
    
    return typeMatch && importanceMatch;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'chapter': return BookOpen;
      case 'character': return Users;
      case 'location': return MapPin;
      default: return Clock;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'chapter': return 'bg-blue-500/10 border-blue-500/30 text-blue-700';
      case 'character': return 'bg-green-500/10 border-green-500/30 text-green-700';
      case 'location': return 'bg-purple-500/10 border-purple-500/30 text-purple-700';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-700';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-500/20 text-red-700';
      case 'high': return 'bg-orange-500/20 text-orange-700';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700';
      case 'low': return 'bg-gray-500/20 text-gray-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const toggleImportance = (importance: string) => {
    setSelectedImportance(prev => 
      prev.includes(importance) 
        ? prev.filter(i => i !== importance)
        : [...prev, importance]
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Content Header */}
      <header className="bg-card/60 border-b border-border mt-20 sticky top-20 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mono-font text-foreground mb-2">
                Story Timeline
              </h1>
              <p className="text-muted-foreground">
                Visual progression of characters, locations, and story events
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="mono-font">
                {filteredEvents.length} Events
              </Badge>
              <Badge variant="outline" className="mono-font">
                Shiver Universe
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Filters */}
        <Card className="tech-card-glow bg-card/60 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mono-font">
              <Filter className="w-5 h-5 text-accent" />
              Timeline Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Event Type</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Events' },
                  { value: 'chapters', label: 'Chapters' },
                  { value: 'characters', label: 'Characters' },
                  { value: 'locations', label: 'Locations' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filter === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(option.value as any)}
                    className="mono-font"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Importance Level</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedImportance.includes(option.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleImportance(option.value)}
                    className="mono-font"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-8">
            {filteredEvents.map((event, index) => {
              const Icon = getEventIcon(event.type);
              
              return (
                <div key={event.id} className="relative flex items-start gap-6">
                  {/* Timeline marker */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-card border-4 border-border rounded-full flex items-center justify-center z-10">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs mono-font ${getImportanceColor(event.importance)}`}
                      >
                        {event.importance}
                      </Badge>
                    </div>
                  </div>

                  {/* Event card */}
                  <Card className="flex-1 tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getEventColor(event.type)}>
                              {event.type}
                            </Badge>
                            <Badge variant="outline" className="mono-font">
                              {event.timestamp}
                            </Badge>
                          </div>
                          <CardTitle className="mono-font text-foreground">
                            {event.title}
                          </CardTitle>
                          {event.subtitle && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.subtitle}
                            </p>
                          )}
                        </div>
                        
                        {/* Action button */}
                        {event.type === 'chapter' && (
                          <Link to={`/story/${chapters.find(ch => ch.title === event.title)?.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                        {event.type === 'character' && (
                          <Link to={`/character/${characters.find(ch => ch.name.includes(event.title.split(' ')[0]))?.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                        {event.type === 'location' && (
                          <Link to={`/location/${locations.find(loc => event.title.includes(loc.name))?.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-foreground mb-4 leading-relaxed">
                        {event.description}
                      </p>
                      
                      {/* Tags */}
                      {event.tags.length > 0 && (
                        <div className="mb-4">
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">Tags</label>
                          <div className="flex flex-wrap gap-1">
                            {event.tags.slice(0, 4).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs mono-font">
                                {tag}
                              </Badge>
                            ))}
                            {event.tags.length > 4 && (
                              <Badge variant="secondary" className="text-xs mono-font">
                                +{event.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Connections */}
                      {event.connections.length > 0 && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">Connected To</label>
                          <div className="flex flex-wrap gap-1">
                            {event.connections.slice(0, 3).map((connection, connIndex) => (
                              <Badge key={connIndex} variant="outline" className="text-xs mono-font">
                                {connection}
                              </Badge>
                            ))}
                            {event.connections.length > 3 && (
                              <Badge variant="outline" className="text-xs mono-font">
                                +{event.connections.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <Card className="tech-card-glow bg-card/60">
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Events Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more timeline events.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Timeline Stats */}
        <Card className="tech-card-glow bg-card/60 mt-8">
          <CardHeader>
            <CardTitle className="mono-font text-foreground">Timeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{chapters.length}</div>
                <p className="text-sm text-muted-foreground">Total Chapters</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{characters.length}</div>
                <p className="text-sm text-muted-foreground">Characters</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{locations.length}</div>
                <p className="text-sm text-muted-foreground">Locations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {timelineEvents.filter(e => e.importance === 'critical').length}
                </div>
                <p className="text-sm text-muted-foreground">Critical Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;