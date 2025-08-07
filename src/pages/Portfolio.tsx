
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, BookOpen, Users, MapPin, FileText, Lightbulb, Bot, Upload, Image, Brain } from 'lucide-react';
import { useStories } from '@/hooks/useStories';
import { useChapters } from '@/hooks/useChapters';
import { useCharacterProfiles } from '@/hooks/useCharacters';
import { useLocations } from '@/hooks/useLocations';

const Portfolio = () => {
  const [aiPromptsUsed, setAiPromptsUsed] = useState(0);
  const [brainstormIdeas, setBrainstormIdeas] = useState<string[]>([]);
  const dailyPromptLimit = 5;

  // Fetch real data from Supabase
  const { data: stories = [], isLoading: storiesLoading } = useStories();
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const { data: characters = [], isLoading: charactersLoading } = useCharacterProfiles();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();

  // Load saved data from localStorage
  useEffect(() => {
    const savedPrompts = localStorage.getItem('shiver_ai_prompts_used');
    const savedIdeas = localStorage.getItem('shiver_brainstorm_vault');
    
    if (savedPrompts) {
      const { count, date } = JSON.parse(savedPrompts);
      const today = new Date().toDateString();
      if (date === today) {
        setAiPromptsUsed(count);
      } else {
        // Reset for new day
        localStorage.setItem('shiver_ai_prompts_used', JSON.stringify({ count: 0, date: today }));
      }
    }
    
    if (savedIdeas) {
      setBrainstormIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  const stats = {
    stories: stories.length,
    chapters: chapters.length,
    characters: characters.length,
    locations: locations.length,
    visualReferences: 12, // Mock data for visual references (not yet in database)
    brainstormIdeas: brainstormIdeas.length
  };

  const isLoading = storiesLoading || chaptersLoading || charactersLoading || locationsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/" className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors">Shiver</Link>
          <nav>
            <ul className="flex gap-6 mono-font">
              <li><Link to="/portfolio" className="text-accent hover:underline font-bold">Portfolio</Link></li>
              <li><Link to="/characters" className="text-accent hover:underline">Characters</Link></li>
              <li><Link to="/timeline" className="text-accent hover:underline">Timeline</Link></li>
              <li><Link to="/locations" className="text-accent hover:underline">Locations</Link></li>
              <li><Link to="/cases" className="text-accent hover:underline">Cases</Link></li>
              <li><Link to="/multimedia" className="text-accent hover:underline">Multimedia</Link></li>
              <li><Link to="/admin" className="text-accent hover:underline">Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground mb-4">
              Your Creative Universe
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Welcome to Phase One of the Shiver Creator Platform. Organize, visualize, and enhance your story universe with structured JSON profiles, visual references, and AI assistance.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="mono-font">
                Phase 1: Portfolio Builder
              </Badge>
              <Badge variant="outline" className="mono-font">
                AI Prompts: {aiPromptsUsed}/{dailyPromptLimit} used today
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Overview Cards */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 mono-font text-foreground">
            Portfolio Overview
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading your creative universe...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Stories */}
              <Link to="/portfolio/stories">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-accent mono-font">Stories & Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">{stats.chapters}</div>
                      <p className="text-sm text-muted-foreground">Chapters from {stats.stories} stories, organized with XML semantic tags</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Characters */}
              <Link to="/characters">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-accent mono-font">Character Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">{stats.characters}</div>
                      <p className="text-sm text-muted-foreground">JSON-based profiles with stats, backgrounds, and visual references</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Locations */}
              <Link to="/locations">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-accent mono-font">Location Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">{stats.locations}</div>
                      <p className="text-sm text-muted-foreground">Structured locations with symbolic and narrative tags</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Visual References */}
              <Link to="/portfolio/visual-references">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <Image className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-accent mono-font">Visual References</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">{stats.visualReferences}</div>
                      <p className="text-sm text-muted-foreground">Concept art, inspirations, and visual notes for each profile</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Brainstorming Vault */}
              <Link to="/portfolio/brainstorm">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <Brain className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-accent mono-font">Brainstorming Vault</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">{stats.brainstormIdeas}</div>
                      <p className="text-sm text-muted-foreground">Raw ideas, scenes, plot twists, and dialogue snippets</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* AI Assistant */}
              <Link to="/portfolio/ai-assistant">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 transition-all duration-300 cursor-pointer group border-accent/30">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <Bot className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-accent mono-font">AI Assistant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">{dailyPromptLimit - aiPromptsUsed}</div>
                      <p className="text-sm text-muted-foreground">Free AI prompts remaining today for creative assistance</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mono-font text-foreground mb-6 text-center">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-16 flex-col gap-2">
                <Link to="/portfolio/stories/new">
                  <Upload className="w-5 h-5" />
                  <span className="mono-font">Stories &amp; Chapters</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex-col gap-2">
                <Link to="/portfolio/stories/new">
                  <Plus className="w-5 h-5" />
                  <span className="mono-font">New Story</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex-col gap-2">
                <Link to="/portfolio/characters/new">
                  <Plus className="w-5 h-5" />
                  <span className="mono-font">New Character</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex-col gap-2">
                <Link to="/portfolio/chapters/new">
                  <Plus className="w-5 h-5" />
                  <span className="mono-font">New Chapter</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex-col gap-2">
                <Link to="/portfolio/locations/new">
                  <Plus className="w-5 h-5" />
                  <span className="mono-font">New Location</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex-col gap-2">
                <Link to="/portfolio/ai-assistant">
                  <Bot className="w-5 h-5" />
                  <span className="mono-font">Ask AI</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 px-8 bg-card/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 mono-font text-foreground">
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle className="mono-font text-foreground">Latest Additions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapters.slice(0, 3).map((chapter) => (
                  <div key={chapter.id} className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Chapter: "{chapter.title}" updated</span>
                  </div>
                ))}
                {characters.slice(0, 2).map((character) => (
                  <div key={character.id} className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Character profile: {character.full_name} enhanced</span>
                  </div>
                ))}
                {locations.slice(0, 1).map((location) => (
                  <div key={location.id} className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Location profile: {location.name} updated</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle className="mono-font text-foreground">Creator Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Universe Entities:</span>
                  <span className="font-bold text-foreground">{stats.stories + stats.characters + stats.locations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Visual References:</span>
                  <span className="font-bold text-foreground">{stats.visualReferences}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Brainstorm Ideas:</span>
                  <span className="font-bold text-foreground">{stats.brainstormIdeas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AI Prompts Used Today:</span>
                  <span className="font-bold text-foreground">{aiPromptsUsed}/{dailyPromptLimit}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
