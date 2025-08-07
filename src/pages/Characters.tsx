
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Plus } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { useCharacterProfiles } from "@/hooks/useCharacters";


const Characters = () => {
  const { data: characters = [], isLoading, error } = useCharacterProfiles();

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-12 h-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
              The Characters
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Meet the cast of your creative universe—each character with their own unique background, 
            motivations, and role in the unfolding story. Click on any character to explore their full profile.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/portfolio/characters/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Character
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Characters Grid */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading character profiles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error loading characters. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {characters.length > 0 ? (
                characters.map((character, index) => (
                  <FadeIn key={character.id} delay={index * 0.1}>
                    <Link to={`/character/${character.id}`}>
                      <Card className="character-card card-hover cursor-pointer bg-card hover:bg-card/80 border-2 hover:border-accent/50 will-change-transform">
                        <CardContent className="p-6">
                          {/* Character Image */}
                          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6 bg-gradient-to-b from-muted/30 to-card flex items-center justify-center">
                            {character.img_url ? (
                              <img
                                src={character.img_url}
                                alt={character.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <div className="w-20 h-32 bg-foreground/20 rounded-full mx-auto mb-4"></div>
                                <p className="text-accent mono-font text-sm">Character Profile</p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                              <div className="text-center text-white">
                                <div className="text-sm mono-font opacity-80">Click to explore</div>
                              </div>
                            </div>
                          </div>

                          {/* Character Info */}
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-foreground mb-2 mono-font">
                              {character.full_name}
                            </h3>
                            {character.title && (
                              <p className="text-accent text-sm mb-3 mono-font">
                                {character.title}
                              </p>
                            )}
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {character.summary_tagline || character.role_in_story || "A key character in the story"}
                            </p>
                            {character.notable_traits_array && character.notable_traits_array.length > 0 && (
                              <div className="flex flex-wrap gap-1 justify-center mt-3">
                                {character.notable_traits_array.slice(0, 3).map((trait, i) => (
                                  <span key={i} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </FadeIn>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Characters Yet</h3>
                  <p className="text-muted-foreground mb-6">Start building your creative universe by creating your first character profile.</p>
                  <Button asChild>
                    <Link to="/portfolio/characters/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Character
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-8 bg-card/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 mono-font text-foreground">
            Build Your Character Universe
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Each character profile includes detailed JSON-based data for backgrounds, motivations, 
            relationships, and visual references. Start creating rich, interconnected character profiles today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="mono-font font-bold">
                Return to Portfolio
              </Button>
            </Link>
            <Link to="/portfolio/characters/new">
              <Button size="lg" className="mono-font font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Create Character
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Characters;
