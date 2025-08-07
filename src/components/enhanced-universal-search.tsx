import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { search, searchWithTagsOr, getAllTags, getSearchSuggestions } from '@/data/search-utils';
import { Entity } from '@/data/types';

interface EnhancedUniversalSearchProps {
  placeholder?: string;
  className?: string;
  maxResults?: number;
  showFilters?: boolean;
}

export function EnhancedUniversalSearch({ 
  placeholder = "Search characters, chapters, cases, locations, and media...", 
  className = "",
  maxResults = 10,
  showFilters = true 
}: EnhancedUniversalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Entity['kind'][]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<'AND' | 'OR'>('AND');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Get all available tags - now synchronous
  const allTags = useMemo(() => getAllTags(), []);

  // Search results - now synchronous
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchFn = tagFilterMode === 'AND' ? search : searchWithTagsOr;
    const typeFilter = selectedTypes.length > 0 ? selectedTypes : undefined;
    const tagFilter = selectedTags.length > 0 ? selectedTags : undefined;
    
    return searchFn(query, typeFilter, tagFilter).slice(0, maxResults);
  }, [query, selectedTypes, selectedTags, tagFilterMode, maxResults]);

  // Update suggestions as user types - now synchronous
  useEffect(() => {
    if (query.length >= 2) {
      setSuggestions(getSearchSuggestions(query, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleTypeFilter = (type: Entity['kind'], checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, type]);
    } else {
      setSelectedTypes(prev => prev.filter(t => t !== type));
    }
  };

  const handleTagFilter = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags(prev => [...prev, tag]);
    } else {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
  };

  const getEntityIcon = (kind: Entity['kind']) => {
    switch (kind) {
      case 'character': return '👤';
      case 'chapter': return '📖';
      case 'case': return '🔍';
      case 'location': return '🏢';
      case 'media': return '🎨';
      default: return '📄';
    }
  };

  const getEntityTypeLabel = (kind: Entity['kind']) => {
    switch (kind) {
      case 'character': return 'Character';
      case 'chapter': return 'Chapter';
      case 'case': return 'Case';
      case 'location': return 'Location';
      case 'media': return 'Media';
      default: return 'Content';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-12"
        />
        
        {/* Filter Button */}
        {showFilters && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Type Filters */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Content Types</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {(['character', 'chapter', 'case', 'location', 'media'] as Entity['kind'][]).map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => handleTypeFilter(type, checked as boolean)}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm capitalize">
                          {getEntityIcon(type)} {getEntityTypeLabel(type)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tag Filters */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium">Tags</h5>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={tagFilterMode === 'AND' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTagFilterMode('AND')}
                        className="h-6 px-2 text-xs"
                      >
                        AND
                      </Button>
                      <Button
                        variant={tagFilterMode === 'OR' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTagFilterMode('OR')}
                        className="h-6 px-2 text-xs"
                      >
                        OR
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {allTags.slice(0, 20).map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => handleTagFilter(tag, checked as boolean)}
                        />
                        <label htmlFor={`tag-${tag}`} className="text-sm">
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedTypes.length > 0 || selectedTags.length > 0) && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Active Filters</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedTypes.map(type => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {getEntityTypeLabel(type)}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => handleTypeFilter(type, false)}
                          />
                        </Badge>
                      ))}
                      {selectedTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => handleTagFilter(tag, false)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (query.trim() || suggestions.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Suggestions */}
            {suggestions.length > 0 && !query.trim() && (
              <div className="p-3 border-b">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggestions</h4>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map(suggestion => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <Link
                    key={`${result.item.kind}-${result.item.data.id}`}
                    to={result.item.data.route}
                    className="block p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {getEntityIcon(result.item.kind)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium truncate">
                            {'name' in result.item.data ? result.item.data.name : result.item.data.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {getEntityTypeLabel(result.item.kind)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {'description' in result.item.data ? result.item.data.description : 
                           'summary' in result.item.data ? result.item.data.summary : ''}
                        </p>
                        {result.item.data.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.item.data.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {result.item.data.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{result.item.data.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Backdrop to close results */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}