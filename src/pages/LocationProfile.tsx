import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  BookOpen, 
  Eye,
  Thermometer,
  Cloud,
  Heart,
  Clock,
  Star,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { locations, characters, chapters } from '@/data/shiver-database';

const LocationProfile = () => {
  const { locationId } = useParams();
  const location = locations.find(loc => loc.id === parseInt(locationId || '0'));
  
  if (!location) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mono-font text-foreground mb-4">Location Not Found</h1>
          <Link to="/locations">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find connected characters and chapters
  const connectedCharacters = characters.filter(char => 
    location.charactersPresent?.includes(char.id) || 
    char.locationConnections?.includes(location.id)
  );
  
  const connectedChapters = chapters.filter(chapter => 
    chapter.locationsVisited?.includes(location.id)
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'dangerous': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'abandoned': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'restricted': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access?.toLowerCase()) {
      case 'public': return 'text-green-600';
      case 'restricted': return 'text-yellow-600';
      case 'forbidden': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/60 border-b border-border sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/locations" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="mono-font">Back to Locations</span>
            </Link>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(location.status || 'unknown')}>
                {location.status || 'Unknown'}
              </Badge>
              <Badge variant="outline" className="mono-font">
                Location
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mono-font text-foreground mb-2">
                {location.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {location.description || "A significant location in the Shiver universe."}
              </p>
              <div className="flex flex-wrap gap-2">
                {location.tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mono-font">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="overview" className="mono-font">Overview</TabsTrigger>
            <TabsTrigger value="atmosphere" className="mono-font">Atmosphere</TabsTrigger>
            <TabsTrigger value="symbolism" className="mono-font">Symbolism</TabsTrigger>
            <TabsTrigger value="connections" className="mono-font">Connections</TabsTrigger>
            <TabsTrigger value="scenes" className="mono-font">Key Scenes</TabsTrigger>
            <TabsTrigger value="timeline" className="mono-font">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font">
                      <Eye className="w-5 h-5 text-accent" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">District</label>
                        <p className="text-foreground">{location.district || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <p className="text-foreground">{location.status || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Accessibility</label>
                        <p className={getAccessColor(location.accessibility || 'unknown')}>
                          {location.accessibility || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Significance</label>
                        <p className="text-foreground">{location.significance || 'Moderate'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground leading-relaxed">{location.description}</p>
                    </div>
                    
                    {location.dangers && location.dangers.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dangers</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {location.dangers.map((danger: string, index: number) => (
                            <Badge key={index} variant="destructive" className="mono-font">
                              {danger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="mono-font text-foreground">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Connected Characters
                      </span>
                      <span className="font-bold text-foreground">{connectedCharacters.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Chapters Featured
                      </span>
                      <span className="font-bold text-foreground">{connectedChapters.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Significance
                      </span>
                      <span className="font-bold text-foreground">{location.significance || 'Standard'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="atmosphere" className="space-y-6">
            <Card className="tech-card-glow bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mono-font">
                  <Cloud className="w-5 h-5 text-accent" />
                  Location Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground leading-relaxed">{location.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Significance</label>
                  <p className="text-foreground leading-relaxed">{location.significance}</p>
                </div>
                {location.dangers && location.dangers.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Known Dangers</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {location.dangers.map((danger: string, index: number) => (
                        <Badge key={index} variant="destructive" className="mono-font">
                          {danger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symbolism" className="space-y-6">
            <Card className="tech-card-glow bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mono-font">
                  <Zap className="w-5 h-5 text-accent" />
                  Tags & Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {location.tags && location.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {location.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="mono-font">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {connectedCharacters.length > 0 && (
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font">
                      <Users className="w-5 h-5 text-accent" />
                      Connected Characters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {connectedCharacters.map((character, index) => (
                        <Link key={index} to={`/character/${character.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{character.name}</p>
                              <p className="text-sm text-muted-foreground">{character.title || 'Character'}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {connectedChapters.length > 0 && (
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font">
                      <BookOpen className="w-5 h-5 text-accent" />
                      Featured In Chapters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {connectedChapters.map((chapter, index) => (
                        <Link key={index} to={`/story/${chapter.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{chapter.title}</p>
                              <p className="text-sm text-muted-foreground">{chapter.name}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scenes" className="space-y-6">
            <Card className="tech-card-glow bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mono-font">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Connected Chapters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {connectedChapters.length > 0 ? (
                  <div className="space-y-4">
                    {connectedChapters.map((chapter, index) => (
                      <Link key={index} to={`/story/${chapter.id}`}>
                        <div className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                          <h4 className="font-medium text-foreground mb-2">{chapter.title}</h4>
                          <p className="text-sm text-muted-foreground">{chapter.description || chapter.summary}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No chapters feature this location prominently.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="tech-card-glow bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mono-font">
                  <Clock className="w-5 h-5 text-accent" />
                  Timeline Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className="text-foreground">{location.status}</p>
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Location appears in:</p>
                    <div className="space-y-2">
                      {connectedChapters.map((chapter, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="text-sm text-foreground">{chapter.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LocationProfile;