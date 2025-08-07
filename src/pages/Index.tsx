import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { memo, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lightbulb, ArrowRight, Code, Zap, Database, Bot, Search, Shuffle, Users, Plus, MapPin } from "lucide-react";
import UniversalSearch from "@/components/universal-search";
import RandomDiscovery from "@/components/random-discovery";
import FadeIn from "@/components/animations/FadeIn";
import { PeekCarousel } from "@/components/PeekCarousel";

import ChapterCarousel from "@/components/ui/chapter-carousel";
import { useAuth } from "@/contexts/AuthContext";
import { useChapters } from "@/hooks/useChapters";
import { useCharacterProfiles } from "@/hooks/useCharacters";
import { useLocations } from "@/hooks/useLocations";
import { mapChapterDataToChapter, mapCharacterProfileToCharacter } from "@/utils/dataMapping";

/* -------------------------------------------------------------------------- */
/*  Static Data: Shiver‑canon chapters & characters lifted out of component    */
/* -------------------------------------------------------------------------- */

const Index = memo(() => {
  const navigate = useNavigate();
  const {
    hasRole
  } = useAuth();
  const isAdmin = hasRole('admin');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [characterSearch, setCharacterSearch] = useState("");
  const {
    data: chapters = []
  } = useChapters();
  const {
    data: characters = []
  } = useCharacterProfiles();
  const {
    data: locations = []
  } = useLocations();
  const mappedChapters = chapters.map(mapChapterDataToChapter);
  const mappedCharacters = characters.map(mapCharacterProfileToCharacter);

  /* --------------------------- Handlers (memoised) ------------------------- */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: replace with real endpoint / email.js / Make scenario
  }, [formData]);

  // Filter characters based on search
  const filteredCharacters = mappedCharacters.filter(character => character && character.name && (character.name.toLowerCase().includes(characterSearch.toLowerCase()) || character.title && character.title.toLowerCase().includes(characterSearch.toLowerCase())));

  /* -------------------------------- Render --------------------------------- */

  return <div className="min-h-screen bg-background pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative text-center text-white bg-black snap-section pt-16 md:pt-24 lg:pt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />

        <div className="relative max-w-6xl px-4 z-10 w-full">
          {/* Chapter Navigation - Mobile Carousel / Desktop Scroll */}
          <div className="mb-4">
            {/* Mobile: Single card carousel */}
            <div className="lg:hidden">
              <ChapterCarousel chapters={chapters} isAdmin={isAdmin} />
            </div>
            
            {/* Desktop: Horizontal scroll gallery */}
            <div className="hidden lg:block">
              <div className="scroll-gallery">
                {chapters.map(chapter => {
                const coverImageUrl = chapter.cover_image_url || '';
                return <Link key={chapter.id} to={`/story/${chapter.id}`} className="scroll-card chapter-card">
                      <div className="relative w-full h-full">
                        {coverImageUrl ? <img src={coverImageUrl} alt={chapter.title} loading="lazy" className="w-full h-full object-cover rounded-lg" /> : <div className="w-full h-full bg-gradient-to-b from-muted/20 to-card rounded-lg flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <div className="w-12 h-16 bg-foreground/20 rounded mx-auto mb-2" />
                              <p className="text-xs mono-font">Cover Coming Soon</p>
                            </div>
                          </div>}
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-end justify-center pb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold mb-1">{chapter.title}</div>
                            {chapter.summary && <div className="text-xs opacity-80">Click to read</div>}
                          </div>
                        </div>
                        <div className="chapter-glow-overlay" />
                      </div>
                    </Link>;
              })}
                {isAdmin && <Link to="/portfolio/new-chapter" className="scroll-card flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="mono-font">Add Chapter</span>
                  </Link>}
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <FadeIn delay={0.2} className="mt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 neon-pink mono-font tracking-tight transition-base">
              Secrets Lurk in Rookwick
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed">Shiver is a serialized noir-fantasy saga set in frostbitten Rookwick—a city where neon lights mask ancient blood rituals and the dead don't stay buried. Each chapter drags its haunted cast deeper into the underworld of mana-soaked streets, yokai politics, and fractured memories, all under the watchful eye of the Enigma</p>
            {mappedChapters.length > 0 && <Button size="lg" asChild className="hero-button text-accent-foreground hover:bg-accent/90 mono-font font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 md:py-4 button-hover">
                <Link to={`/story/${mappedChapters[0].route}`}>Start Reading Chapter 1</Link>
              </Button>}
          </FadeIn>
        </div>
      </section>

      {/* Character Gallery */}
      <section id="characters" className="py-12 md:py-24 px-4 md:px-8 bg-card/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 mono-font text-foreground" data-content-id="characters-title" data-page-id="index">
            Meet the Cast
          </h2>
          <p className="text-center text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed" data-content-id="characters-description" data-page-id="index">
            Every soul in Rookwick carries a secret—click a dossier to dig into theirs.
          </p>

          {/* Character Search - Mobile Optimized */}
          <div className="max-w-md mx-auto mb-8 md:mb-12 bounce-in px-4 md:px-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 md:w-4 md:h-4 transition-transform duration-200 hover:scale-110" />
              <Input 
                type="text" 
                placeholder="Search characters..." 
                value={characterSearch} 
                onChange={e => setCharacterSearch(e.target.value)} 
                className="pl-10 mono-font bg-card/50 border-border hover-glow transition-all duration-200 focus:border-accent text-base md:text-sm h-12 md:h-10 touch-friendly" 
              />
            </div>
          </div>

          {/* Mobile Character Grid - Better for Touch */}
          <div className="block md:hidden">
            {filteredCharacters.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 px-4">
                {filteredCharacters.map((character, index) => (
                  <FadeIn key={character.id} delay={index * 0.1}>
                    <Link 
                      to={character.route} 
                      className="mobile-character-card bg-card border border-border rounded-lg overflow-hidden touch-friendly group block"
                    >
                      {/* Character Image - Larger and more prominent */}
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-muted/20 to-card">
                        {character.image ? (
                          <img 
                            src={character.image} 
                            alt={character.name} 
                            loading="lazy" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-accent/10 to-accent/5">
                            <div className="text-center">
                              <div className="w-12 h-16 bg-foreground/20 rounded-full mx-auto mb-2" />
                              <p className="text-accent mono-font text-xs">Soon</p>
                            </div>
                          </div>
                        )}
                        {/* Mobile-friendly overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="mono-font text-white font-medium text-sm mb-1">
                            {character.name}
                          </h3>
                          {character.title && (
                            <p className="text-xs text-white/80 mono-font">
                              {character.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
                {/* Add Character Button for Mobile */}
                {isAdmin && (
                  <Link 
                    to="/portfolio/characters/new" 
                    className="mobile-character-card border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center aspect-[3/4] touch-friendly"
                  >
                    <Plus className="w-8 h-8 mb-2 text-accent" />
                    <span className="mono-font text-sm text-accent">Add Character</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="mono-font text-lg mb-2">No characters found</p>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your search</p>
                {isAdmin && (
                  <Link 
                    to="/portfolio/characters/new" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg mono-font font-medium touch-friendly"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Character
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Desktop Horizontal Scroll - Original Layout */}
          <div className="hidden md:block scroll-gallery">
            {filteredCharacters.length > 0 ? <>
                {filteredCharacters.map((character, index) => <FadeIn key={character.id} delay={index * 0.1}>
                  <Link to={character.route} className="scroll-card character-card bg-card border border-border card-hover will-change-transform group block hover-lift-scale hover-glow-intense stagger-item">
                    <div className="p-4">
                      <div className="relative w-full h-48 bg-gradient-to-b from-muted/20 to-card rounded-lg overflow-hidden mb-4">
                        {character.image ? <img src={character.image} alt={character.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" /> : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-accent/10 to-accent/5 shimmer-effect">
                            <div className="text-center">
                              <div className="w-16 h-24 bg-foreground/20 rounded-full mx-auto mb-2 pulse-glow" />
                              <p className="text-accent mono-font text-xs hover-lift">Character Reveal Coming Soon</p>
                            </div>
                          </div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <div className="text-center text-white">
                            <div className="text-xs mono-font opacity-90">Click to explore</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="mono-font text-foreground font-medium text-xs sm:text-sm mb-1 group-hover:text-accent transition-all duration-200 hover-lift">
                          {character.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 mono-font">
                          {character.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {character.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </FadeIn>)}
                {isAdmin && <Link to="/portfolio/characters/new" className="scroll-card flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border hover-lift hover-glow transition-all duration-200">
                    <Plus className="w-8 h-8 mb-2 transition-transform duration-200 hover:scale-110" />
                    <span className="mono-font">Add Character</span>
                  </Link>}
              </> : <div className="text-muted-foreground text-center py-12 min-w-full">
                <div className="text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="mono-font mb-4">No characters found matching your search.</p>
                  {isAdmin && <Link to="/portfolio/characters/new" className="inline-flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border px-4 py-2 hover:bg-muted/20">
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="mono-font text-sm">Add Character</span>
                    </Link>}
                </div>
              </div>}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-12 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 mono-font text-foreground">
            Explore Locations
          </h2>
          <p className="text-center text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            From the Veil-touched alleyways to Yakoshima Temple—pinpoint the world of Shiver. Each location holds secrets and dangers that only the initiated understand.
          </p>

          {/* Mobile Locations Grid */}
          <div className="block md:hidden">
            {locations.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 px-4">
                {locations.map((location, index) => (
                  <FadeIn key={location.id} delay={index * 0.1}>
                    <Link 
                      to="/locations" 
                      className="mobile-character-card bg-card border border-border rounded-lg overflow-hidden touch-friendly group flex"
                    >
                      <div className="w-24 h-20 bg-gradient-to-b from-accent/10 to-accent/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-8 h-8 text-accent/70" />
                      </div>
                      <div className="flex-1 p-3">
                        <h3 className="mono-font text-foreground font-medium text-sm mb-1">
                          {location.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mono-font mb-1">
                          {location.location_type || 'Unknown Type'}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {location.summary || 'No description available.'}
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
                {isAdmin && (
                  <Link 
                    to="/portfolio/locations/new" 
                    className="mobile-character-card border-2 border-dashed border-border rounded-lg flex items-center justify-center p-6 touch-friendly"
                  >
                    <Plus className="w-6 h-6 mr-2 text-accent" />
                    <span className="mono-font text-sm text-accent">Add Location</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="mono-font text-lg mb-2">No locations yet</p>
                <p className="text-sm text-muted-foreground mb-6">Locations will appear here</p>
                {isAdmin && (
                  <Link 
                    to="/portfolio/locations/new" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg mono-font font-medium touch-friendly"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Location
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Desktop Locations Horizontal Scroll */}
          <div className="hidden md:block scroll-gallery">
            {locations.length > 0 ? <>
                {locations.map((location, index) => <FadeIn key={location.id} delay={index * 0.1}>
                    <Link to="/locations" className="scroll-card bg-card border border-border card-hover will-change-transform group block">
                      <div className="p-4">
                        <div className="relative w-full h-48 bg-gradient-to-b from-muted/20 to-card rounded-lg overflow-hidden mb-4">
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-accent/10 to-accent/5">
                            <div className="text-center">
                              <MapPin className="w-16 h-16 text-accent/50 mx-auto mb-2" />
                              <p className="text-accent mono-font text-xs">Location Visual Coming Soon</p>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                            <div className="text-center text-white">
                              <div className="text-xs mono-font opacity-90">Click to explore</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="mono-font text-foreground font-medium text-xs sm:text-sm mb-1 group-hover:text-accent transition-colors">
                            {location.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 mono-font">
                            {location.location_type || 'Unknown Type'}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {location.summary || 'No description available.'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>)}
                {isAdmin && <Link to="/portfolio/locations/new" className="scroll-card flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="mono-font">Add Location</span>
                  </Link>}
              </> : <div className="text-muted-foreground text-center py-12 min-w-full">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="mono-font mb-4">No locations discovered yet.</p>
                    {isAdmin && <Link to="/portfolio/locations/new" className="inline-flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border px-4 py-2 hover:bg-muted/20">
                        <Plus className="w-5 h-5 mb-1" />
                        <span className="mono-font text-sm">Add Location</span>
                      </Link>}
                  </div>
                </div>}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 snap-section">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 mono-font text-foreground">The Shiver Files</h2>
          </FadeIn>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8">
            {isAdmin && <FadeIn delay={0.1}>
                <Link to="/characters">
                  <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                  <CardHeader className="text-center">
                    <CardTitle className="text-accent mono-font">Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Dive into detailed dossiers—powers, pasts, and prognosis.</p>
                  </CardContent>
                </Card>
              </Link>

              </FadeIn>}
            <FadeIn delay={0.2}>
              <Link to="/cases">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                <CardHeader className="text-center"><CardTitle className="text-accent mono-font">Cases</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Unsolved incidents, encrypted witness logs, and classified Agency notes.</p></CardContent>
              </Card>
            </Link>

            </FadeIn>
            <FadeIn delay={0.3}>
              <Link to="/locations">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                <CardHeader className="text-center"><CardTitle className="text-accent mono-font">Locations</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">From the Veil‑touched alleyways to Yakoshima Temple—pinpoint the world of Shiver.</p></CardContent>
              </Card>
            </Link>

            </FadeIn>
            {isAdmin && <FadeIn delay={0.4}>
                <Link to="/multimedia">
                  <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                  <CardHeader className="text-center"><CardTitle className="text-accent mono-font">Multimedia</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">Concept art, audio logs, and motion pieces that breathe life into the lore.</p></CardContent>
                </Card>
              </Link>

              </FadeIn>}
            {isAdmin && <FadeIn delay={0.5}>
                <Link to="/admin">
                  <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer border-accent/30 will-change-transform">
                  <CardHeader className="text-center"><CardTitle className="text-accent mono-font">CMS Admin</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">Manage content, import files, and oversee the entire Shiver universe.</p></CardContent>
                  </Card>
                </Link>
              </FadeIn>}
          </div>
          {/* Mobile carousel */}
          <PeekCarousel>
            {isAdmin && <FadeIn delay={0.1}>
                <Link to="/characters">
                  <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                    <CardHeader className="text-center">
                      <CardTitle className="text-accent mono-font">Characters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Dive into detailed dossiers—powers, pasts, and prognosis.</p>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>}
            <FadeIn delay={0.2}>
              <Link to="/cases">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                  <CardHeader className="text-center"><CardTitle className="text-accent mono-font">Cases</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">Unsolved incidents, encrypted witness logs, and classified Agency notes.</p></CardContent>
                </Card>
              </Link>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Link to="/locations">
                <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                  <CardHeader className="text-center"><CardTitle className="text-accent mono-font">Locations</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">From the Veil‑touched alleyways to Yakoshima Temple—pinpoint the world of Shiver.</p></CardContent>
                </Card>
              </Link>
            </FadeIn>
            {isAdmin && <FadeIn delay={0.4}>
                <Link to="/multimedia">
                  <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer will-change-transform">
                    <CardHeader className="text-center"><CardTitle className="text-accent mono-font">Multimedia</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">Concept art, audio logs, and motion pieces that breathe life into the lore.</p></CardContent>
                  </Card>
                </Link>
              </FadeIn>}
            {isAdmin && <FadeIn delay={0.5}>
                <Link to="/admin">
                  <Card className="tech-card-glow bg-card/60 hover:bg-card/80 card-hover cursor-pointer border-accent/30 will-change-transform">
                    <CardHeader className="text-center"><CardTitle className="text-accent mono-font">CMS Admin</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">Manage content, import files, and oversee the entire Shiver universe.</p></CardContent>
                  </Card>
                </Link>
              </FadeIn>}
          </PeekCarousel>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8 bg-card/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 mono-font text-foreground">What is Shiver?</h2>
          <p className="text-lg text-foreground leading-relaxed">
            Born from late‑night lore sessions and neon‑rimmed sketches, Shiver blends detective grit with cosmic horror. It’s an ever‑expanding playground where structured data meets AI‑assisted creation—letting story and art evolve hand‑in‑hand.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 mono-font text-foreground">How It Works</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto">Your story, your control, your universe</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ORGANIZE */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"><Database className="w-8 h-8 text-accent" /></div>
              <h3 className="text-xl font-bold mb-4 mono-font text-foreground">1. ORGANIZE</h3>
              <h4 className="text-sm font-medium mb-3 text-accent">Centralize your world</h4>
              <p className="text-muted-foreground">Gather stories, characters & locations in one living library. Build your portfolio from the ground up—chapter by chapter, profile by profile, setting by setting—so you always see the big picture.</p>
            </div>
            {/* REFINE */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"><Bot className="w-8 h-8 text-accent" /></div>
              <h3 className="text-xl font-bold mb-4 mono-font text-foreground">2. REFINE</h3>
              <h4 className="text-sm font-medium mb-3 text-accent">AI-powered critique & editing</h4>
              <p className="text-muted-foreground">Get on-demand grammar fixes, style feedback and deep narrative coaching. Your personal 24/7 editor suggests plot improvements, polishes prose, and helps you stay true to your voice.</p>
            </div>
            {/* ILLUMINATE */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-accent" /></div>
              <h3 className="text-xl font-bold mb-4 mono-font text-foreground">3. ILLUMINATE</h3>
              <h4 className="text-sm font-medium mb-3 text-accent">Worldbuilding intelligence</h4>
              <p className="text-muted-foreground">Discover connections, arcs and themes automatically. Map relationships and timelines, run semantic searches, and receive context-aware story prompts that spark your next great idea.</p>
            </div>
          </div>

          <div className="flex justify-center mt-12 gap-2 text-accent mono-font text-sm font-medium">
            <span>Your Story</span><ArrowRight className="w-5 h-5" /><span>Your Control</span><ArrowRight className="w-5 h-5" /><span>Your Universe</span>
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section id="tech" className="py-24 px-8 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 mono-font text-foreground">Powered by Kiazen</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto">Continuous improvement meets narrative experimentation.</p>

          {/* Desktop grid */}
          
          {/* Mobile carousel */}
          <PeekCarousel>
            {[{
            emoji: "📐",
            title: "Schema Blueprints",
            copy: "Robust JSON scaffolds for characters, settings, scenes—guaranteeing every worldbuilding drop lands in exactly the right shape."
          }, {
            emoji: "⚡",
            title: "Workflow Automations",
            copy: "Automate creation & delivery with drag-&-drop triggers—generate new drafts, push updates, or ping collaborators exactly when you need them."
          }, {
            emoji: "📝",
            title: "Collaborative Canvas",
            copy: "Real-time plotting & drafting hub—outline, write, and get feedback in one living document, versioned for you and your team."
          }, {
            emoji: "🤖",
            title: "AI Intelligence",
            copy: "LLM-powered narrative assistant for prose polishing, image generation, semantic searches and story-arc suggestions on demand."
          }].map(({
            emoji,
            title,
            copy
          }, idx) => <Card key={idx} className="tech-card-glow bg-card/60">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{emoji}</span>
                  </div>
                  <CardTitle className="text-accent mono-font">{title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{copy}</p></CardContent>
              </Card>)}
          </PeekCarousel>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 mono-font text-foreground">Reach Out</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required className="mono-font" />
            <Input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} required className="mono-font" />
            <textarea name="message" placeholder="Tell us what you're thinking" rows={5} value={formData.message} onChange={handleInputChange} className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mono-font" />
            <Button type="submit" size="lg" className="w-full tech-box-glow bg-accent text-accent-foreground hover:bg-accent/90 mono-font font-bold">Send Message</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 text-center">
        <p className="text-muted-foreground mono-font text-sm">© 2025 Shiver Project. All rights reserved.</p>
      </footer>
    </div>;
});
export default Index;