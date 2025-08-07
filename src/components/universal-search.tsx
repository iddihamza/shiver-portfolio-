import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Filter, Tag, User, MapPin, FileText, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { searchContent, getAllTags, SearchableContent } from '@/data/shiver-database';

interface UniversalSearchProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
}

const UniversalSearch: React.FC<UniversalSearchProps> = ({ 
  className = '', 
  placeholder = 'Search characters, stories, locations, cases...',
  showFilters = true 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchableContent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags] = useState(getAllTags());

  useEffect(() => {
    if (query.trim() || selectedTags.length > 0) {
      const searchResults = searchContent(query, {
        type: selectedType || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, selectedType, selectedTags]);

  const handleClearSearch = () => {
    setQuery('');
    setSelectedType('');
    setSelectedTags([]);
    setResults([]);
    setIsOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <User className="w-4 h-4" />;
      case 'chapter': return <Book className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'case': return <FileText className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
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

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 bg-background/50 border-border hover:border-accent/50 focus:border-accent"
          />
          {(query || selectedTags.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {showFilters && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedType || selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-2 h-4 text-xs">
                    {(selectedType ? 1 : 0) + selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Content Type</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedType('')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('character')}>
                <User className="w-4 h-4 mr-2" />
                Characters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('chapter')}>
                <Book className="w-4 h-4 mr-2" />
                Chapters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('location')}>
                <MapPin className="w-4 h-4 mr-2" />
                Locations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('case')}>
                <FileText className="w-4 h-4 mr-2" />
                Cases
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              <div className="max-h-32 overflow-y-auto">
                {availableTags.slice(0, 10).map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  >
                    <Tag className="w-3 h-3 mr-2" />
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              {availableTags.length > 10 && (
                <div className="text-xs text-muted-foreground p-2 text-center">
                  +{availableTags.length - 10} more tags
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedType || selectedTags.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedType && (
            <Badge variant="secondary" className="text-xs">
              Type: {selectedType}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => setSelectedType('')}
              />
            </Badge>
          )}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-sm border-border">
          <CardContent className="p-0">
            {results.map((result, index) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.route || '#'}
                onClick={() => setIsOpen(false)}
                className="block hover:bg-muted/50 transition-colors"
              >
                <div className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-start gap-3">
                    {result.image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTypeColor(result.type)}`}
                        >
                          {getTypeIcon(result.type)}
                          <span className="ml-1 capitalize">{result.type}</span>
                        </Badge>
                      </div>
                      <h4 className="font-medium text-foreground truncate">
                        {result.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {result.description}
                      </p>
                      {result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {result.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{result.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.trim() && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-background/95 backdrop-blur-sm border-border">
          <CardContent className="p-4 text-center">
            <div className="text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or adjust your filters</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversalSearch;