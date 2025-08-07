import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shuffle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { characters, chapters, locations, cases, SearchableContent } from '@/data/shiver-database';

const RandomDiscovery: React.FC = () => {
  const [currentDiscovery, setCurrentDiscovery] = useState<SearchableContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomContent = (): SearchableContent => {
    const allContent: SearchableContent[] = [];

    // Add characters
    characters.forEach(character => {
      allContent.push({
        type: 'character',
        id: character.id,
        title: character.name,
        description: `${character.title} - ${character.description}`,
        tags: character.tags,
        route: `/character/${character.route}`,
        image: character.image
      });
    });

    // Add chapters
    chapters.forEach(chapter => {
      allContent.push({
        type: 'chapter',
        id: chapter.id,
        title: chapter.name,
        description: `${chapter.title} - ${chapter.summary || 'A chapter in the Shiver story'}`,
        tags: chapter.tags,
        route: `/story/${chapter.route}`,
        image: chapter.image
      });
    });

    // Add locations
    locations.forEach(location => {
      allContent.push({
        type: 'location',
        id: location.id,
        title: location.name,
        description: `${location.district} - ${location.description}`,
        tags: location.tags,
        route: '/locations',
        image: location.image
      });
    });

    // Add cases
    cases.forEach(caseFile => {
      allContent.push({
        type: 'case',
        id: caseFile.id,
        title: caseFile.title,
        description: `${caseFile.classification} case - ${caseFile.description}`,
        tags: caseFile.tags,
        route: '/cases'
      });
    });

    const randomIndex = Math.floor(Math.random() * allContent.length);
    return allContent[randomIndex];
  };

  const handleSurpriseMe = async () => {
    setIsLoading(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const randomContent = getRandomContent();
    setCurrentDiscovery(randomContent);
    setIsLoading(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'character': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'chapter': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'location': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'case': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button
          onClick={handleSurpriseMe}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-bold"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Shuffle className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Finding Something...' : 'Surprise Me!'}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Discover a random piece of the Shiver universe
        </p>
      </div>

      {currentDiscovery && (
        <Card className="bg-card/50 border-2 border-accent/20 hover:border-accent/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`text-sm ${getTypeColor(currentDiscovery.type)}`}
              >
                <span className="capitalize">{currentDiscovery.type}</span>
              </Badge>
              {currentDiscovery.route && (
                <Link to={currentDiscovery.route}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
            <CardTitle className="text-xl">
              {currentDiscovery.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {currentDiscovery.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img 
                    src={currentDiscovery.image} 
                    alt={currentDiscovery.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {currentDiscovery.description}
                </p>
                {currentDiscovery.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentDiscovery.tags.slice(0, 4).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {currentDiscovery.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{currentDiscovery.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            {currentDiscovery.route && (
              <div className="mt-4 pt-4 border-t border-border">
                <Link to={currentDiscovery.route}>
                  <Button variant="outline" className="w-full">
                    Explore Further
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RandomDiscovery;