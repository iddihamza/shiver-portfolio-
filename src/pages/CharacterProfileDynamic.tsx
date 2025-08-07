import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCharacterProfile } from '@/hooks/useCharacters';
import EnhancedCharacterAbilities from '@/components/character/EnhancedCharacterAbilities';
import EnhancedCharacterRelationships from '@/components/character/EnhancedCharacterRelationships';
import { User, Crown, Shield, Skull, Heart, Edit, MapPin, BookOpen, Users, Zap, Sword, Brain, Quote, Save, X, Settings, Eye, EyeOff, Lock } from 'lucide-react';

const CharacterProfileDynamic = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const { data: character, isLoading, error } = useCharacterProfile(characterId || '');
  
  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());
  const [editedData, setEditedData] = useState<any>({});
  const [sectionVisibility, setSectionVisibility] = useState({
    coreIdentity: true,
    backstory: true,
    storyIntegration: true,
    abilities: true,
    privateNotes: false
  });
  const [privateNotes, setPrivateNotes] = useState('');

  // Admin mode helper functions
  const toggleEditing = (sectionId: string) => {
    const newEditing = new Set(editingSections);
    if (newEditing.has(sectionId)) {
      newEditing.delete(sectionId);
      // Clear any unsaved changes for this section
      const newEditedData = { ...editedData };
      delete newEditedData[sectionId];
      setEditedData(newEditedData);
    } else {
      newEditing.add(sectionId);
      // Initialize section data if not exists
      if (!editedData[sectionId]) {
        setEditedData(prev => ({ ...prev, [sectionId]: {} }));
      }
    }
    setEditingSections(newEditing);
  };

  const updateFieldValue = (sectionId: string, fieldName: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldName]: value
      }
    }));
  };

  const saveSection = (sectionId: string) => {
    // Here you would typically make an API call to save the data
    console.log('Saving section:', sectionId, editedData[sectionId]);
    
    // For now, just remove from editing state
    toggleEditing(sectionId);
    
    // TODO: Implement actual save functionality
    // await updateCharacter(characterId, editedData[sectionId]);
  };

  const toggleSectionVisibility = (sectionId: keyof typeof sectionVisibility) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getEditableValue = (sectionId: string, fieldName: string, originalValue: string) => {
    return editedData[sectionId]?.[fieldName] ?? originalValue ?? '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive">Character not found.</p>
          <Button asChild>
            <Link to="/characters">Back to Characters</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Character status badge configuration
  const getStatusBadge = (role: string) => {
    const statusMap: Record<string, { color: string; icon: any }> = {
      'protagonist': { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: Crown },
      'antagonist': { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: Skull },
      'supporting': { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Users },
      'enigma': { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Brain },
      'love interest': { color: 'bg-pink-500/10 text-pink-500 border-pink-500/20', icon: Heart },
    };
    return statusMap[role?.toLowerCase()] || { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: User };
  };

  const statusInfo = getStatusBadge(character.role_in_story || '');
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/" className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors">
            Shiver
          </Link>
          <nav>
            <ul className="flex gap-6 mono-font items-center">
              <li>
                <Link to="/characters" className="text-accent hover:underline">
                  Characters
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={isAdminMode} 
                    onCheckedChange={setIsAdminMode}
                    className="data-[state=checked]:bg-accent"
                  />
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Admin</span>
                </div>
              </li>
              <li>
                <Link to={`/portfolio/character/${character.id}/edit`} className="text-accent hover:underline">
                  Edit
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-6 max-w-7xl mx-auto">
        
        {/* 🖼️ Clean Responsive Hero Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-card/80 to-card/60 rounded-xl p-6 md:p-8 border border-border">
            {/* Admin Controls & Status Badges */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Admin Controls */}
              {isAdminMode && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={editingSections.has('header') ? 'default' : 'outline'}
                    onClick={() => toggleEditing('header')}
                    className="h-8"
                  >
                    {editingSections.has('header') ? (
                      <>
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </>
                    )}
                  </Button>
                  {editingSections.has('header') && (
                    <Button
                      size="sm"
                      onClick={() => saveSection('header')}
                      className="h-8 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              )}

              {/* Status Badges */}
              <div className="flex gap-2 ml-auto">
                <Badge variant="outline" className={`${statusInfo.color} border font-medium`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {character.role_in_story}
                </Badge>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  Confirmed
                </Badge>
              </div>
            </div>

            {/* Hero Content - Responsive Flex Layout */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Character Image - Stacks above on mobile, left on desktop */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                {character.img_url ? (
                  <div className="w-48 h-64 sm:w-56 sm:h-72 lg:w-64 lg:h-80 bg-gradient-to-b from-muted/20 to-card rounded-xl overflow-hidden border-2 border-border shadow-xl">
                    <img
                      src={character.img_url}
                      alt={character.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-64 sm:w-56 sm:h-72 lg:w-64 lg:h-80 bg-gradient-to-b from-muted/20 to-card rounded-xl border-2 border-border shadow-xl flex items-center justify-center">
                    <div className="text-center">
                      <User className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">No Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Character Info - Max width container to prevent overflow */}
              <div className="flex-1 max-w-3xl">
                {/* Full Name - Large and Bold */}
                {editingSections.has('header') ? (
                  <Input
                    value={getEditableValue('header', 'full_name', character.full_name)}
                    onChange={(e) => updateFieldValue('header', 'full_name', e.target.value)}
                    className="mono-font text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 tracking-tight bg-transparent border-dashed border-accent/50 focus:border-accent"
                    placeholder="Character Name"
                  />
                ) : (
                  <h1 className="mono-font text-foreground text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 tracking-tight leading-tight">
                    {character.full_name}
                  </h1>
                )}

                {/* Title/Role - Distinct color (sky-400 equivalent) */}
                {(character.title || editingSections.has('header')) && (
                  editingSections.has('header') ? (
                    <Input
                      value={getEditableValue('header', 'title', character.title || '')}
                      onChange={(e) => updateFieldValue('header', 'title', e.target.value)}
                      className="text-sky-400 mono-font text-lg sm:text-xl lg:text-2xl mb-4 font-medium bg-transparent border-dashed border-accent/50 focus:border-accent"
                      placeholder="Character Title/Role"
                    />
                  ) : (
                    <h2 className="text-sky-400 mono-font text-lg sm:text-xl lg:text-2xl mb-4 font-medium">
                      {character.title}
                    </h2>
                  )
                )}

                {/* Tagline/Quote - Clean spacing */}
                {(character.summary_tagline || editingSections.has('header')) && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                    {editingSections.has('header') ? (
                      <Textarea
                        value={getEditableValue('header', 'summary_tagline', character.summary_tagline || '')}
                        onChange={(e) => updateFieldValue('header', 'summary_tagline', e.target.value)}
                        className="text-foreground text-base lg:text-lg leading-relaxed italic bg-transparent border-dashed border-accent/50 focus:border-accent resize-none"
                        placeholder="Character tagline or essence..."
                        rows={2}
                      />
                    ) : (
                      <blockquote className="text-foreground text-base lg:text-lg leading-relaxed italic">
                        "{character.summary_tagline}"
                      </blockquote>
                    )}
                  </div>
                )}

                {/* Quick Stats Grid - Clean spacing */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  {character.species_race && (
                    <div className="bg-background/40 rounded-lg p-3 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Species
                      </div>
                      <div className="text-sm font-medium text-foreground">{character.species_race}</div>
                    </div>
                  )}
                  {character.age && (
                    <div className="bg-background/40 rounded-lg p-3 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Age</div>
                      <div className="text-sm font-medium text-foreground">{character.age}</div>
                    </div>
                  )}
                  {character.gender && (
                    <div className="bg-background/40 rounded-lg p-3 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Gender</div>
                      <div className="text-sm font-medium text-foreground">{character.gender}</div>
                    </div>
                  )}
                  {character.affiliations_array && character.affiliations_array.length > 0 && (
                    <div className="bg-background/40 rounded-lg p-3 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Affiliation</div>
                      <div className="text-sm font-medium text-foreground truncate">
                        {character.affiliations_array[0]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📘 Section 1: Core Identity (Card Block) */}
        {sectionVisibility.coreIdentity && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
                <User className="w-6 h-6 text-accent" />
                Core Identity
              </h3>
              
              {isAdminMode && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <Switch 
                      checked={sectionVisibility.coreIdentity}
                      onCheckedChange={() => toggleSectionVisibility('coreIdentity')}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant={editingSections.has('coreIdentity') ? 'default' : 'outline'}
                    onClick={() => toggleEditing('coreIdentity')}
                  >
                    {editingSections.has('coreIdentity') ? (
                      <>
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </>
                    )}
                  </Button>
                  {editingSections.has('coreIdentity') && (
                    <Button
                      size="sm"
                      onClick={() => saveSection('coreIdentity')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              )}
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Aliases */}
              {character.aliases_nicknames && (
                <Card className="tech-card-glow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm mono-font flex items-center gap-2">
                      <User className="w-4 h-4 text-accent" />
                      Aliases
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-foreground font-medium">{character.aliases_nicknames}</p>
                  </CardContent>
                </Card>
              )}

              {/* Physical Stats */}
              {(character.height || character.weight) && (
                <Card className="tech-card-glow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm mono-font flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" />
                      Physical
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {character.height && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Height:</span>
                        <span className="text-foreground font-medium">{character.height}</span>
                      </div>
                    )}
                    {character.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="text-foreground font-medium">{character.weight}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notable Traits */}
              {character.notable_traits_array && character.notable_traits_array.length > 0 && (
                <Card className="tech-card-glow md:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm mono-font flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Notable Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {character.notable_traits_array.slice(0, 6).map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                      {character.notable_traits_array.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{character.notable_traits_array.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Affiliations */}
              {character.affiliations_array && character.affiliations_array.length > 0 && (
                <Card className="tech-card-glow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm mono-font flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      Affiliations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {character.affiliations_array.slice(0, 3).map((affiliation) => (
                        <div key={affiliation} className="text-sm text-foreground">
                          {affiliation}
                        </div>
                      ))}
                      {character.affiliations_array.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{character.affiliations_array.length - 3} more
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* 📖 Section 2: Backstory & Motivation (Full Width Block) */}
        {(sectionVisibility.backstory && (character.backstory || character.core_motivation || editingSections.has('backstory'))) && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" />
                Backstory & Motivation
              </h3>
              
              {isAdminMode && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <Switch 
                      checked={sectionVisibility.backstory}
                      onCheckedChange={() => toggleSectionVisibility('backstory')}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant={editingSections.has('backstory') ? 'default' : 'outline'}
                    onClick={() => toggleEditing('backstory')}
                  >
                    {editingSections.has('backstory') ? (
                      <>
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </>
                    )}
                  </Button>
                  {editingSections.has('backstory') && (
                    <Button
                      size="sm"
                      onClick={() => saveSection('backstory')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Backstory */}
              {(character.backstory || editingSections.has('backstory')) && (
                <Card className="tech-card-glow lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="mono-font text-foreground">Backstory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingSections.has('backstory') ? (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Supports Markdown formatting</div>
                        <Textarea
                          value={getEditableValue('backstory', 'backstory', character.backstory || '')}
                          onChange={(e) => updateFieldValue('backstory', 'backstory', e.target.value)}
                          className="text-muted-foreground leading-relaxed bg-transparent border-dashed border-accent/50 focus:border-accent min-h-[200px]"
                          placeholder="Character's background story, history, and past events..."
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {character.backstory}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Core Motivation - Styled as Quote Block */}
              {(character.core_motivation || editingSections.has('backstory')) && (
                <Card className="tech-card-glow bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="mono-font text-accent flex items-center gap-2">
                      <Quote className="w-5 h-5" />
                      Core Motivation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingSections.has('backstory') ? (
                      <Textarea
                        value={getEditableValue('backstory', 'core_motivation', character.core_motivation || '')}
                        onChange={(e) => updateFieldValue('backstory', 'core_motivation', e.target.value)}
                        className="text-foreground font-medium text-lg leading-relaxed italic bg-transparent border-dashed border-accent/50 focus:border-accent resize-none"
                        placeholder="What drives this character? Their main goal or desire..."
                        rows={3}
                      />
                    ) : (
                      <blockquote className="text-foreground font-medium text-lg leading-relaxed italic">
                        "{character.core_motivation}"
                      </blockquote>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* 🔗 Section 3: Story Integration (Split Block) */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mono-font text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-accent" />
            Story Integration
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Connections */}
            <Card className="tech-card-glow">
              <CardHeader>
                <CardTitle className="mono-font text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Story Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Story connections will be displayed here</p>
                  <p className="text-xs">Chapters • Locations • Story Arcs</p>
                </div>
              </CardContent>
            </Card>

            {/* Right: Related Characters */}
            <Card className="tech-card-glow">
              <CardHeader>
                <CardTitle className="mono-font text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Related Characters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedCharacterRelationships 
                  characterId={characterId || ''} 
                  editable={isAdminMode}
                  showAddButton={isAdminMode}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 🧠 Section 4: Abilities (Unified Block) */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Abilities
            </h3>
            
            {isAdminMode && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <Switch 
                    checked={sectionVisibility.abilities}
                    onCheckedChange={() => toggleSectionVisibility('abilities')}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
                <Button
                  size="sm"
                  variant={editingSections.has('abilities') ? 'default' : 'outline'}
                  onClick={() => toggleEditing('abilities')}
                >
                  {editingSections.has('abilities') ? (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
                {editingSections.has('abilities') && (
                  <Button
                    size="sm"
                    onClick={() => saveSection('abilities')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <EnhancedCharacterAbilities 
            characterId={characterId || ''} 
            editable={isAdminMode}
            showAddButton={isAdminMode}
          />
        </section>

        {/* 🔒 Private Notes Section (Admin Only) */}
        {isAdminMode && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
                <Lock className="w-6 h-6 text-red-500" />
                Private Notes
                <Badge variant="destructive" className="text-xs">
                  Admin Only
                </Badge>
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <EyeOff className="w-4 h-4" />
                  <Switch 
                    checked={sectionVisibility.privateNotes}
                    onCheckedChange={() => toggleSectionVisibility('privateNotes')}
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
                <Button
                  size="sm"
                  variant={editingSections.has('privateNotes') ? 'default' : 'outline'}
                  onClick={() => toggleEditing('privateNotes')}
                >
                  {editingSections.has('privateNotes') ? (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
                {editingSections.has('privateNotes') && (
                  <Button
                    size="sm"
                    onClick={() => saveSection('privateNotes')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                )}
              </div>
            </div>
            
            {sectionVisibility.privateNotes && (
              <Card className="tech-card-glow border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="mono-font text-red-500 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Internal Notes & Development Ideas
                    <Badge variant="destructive" className="text-xs">
                      Not Publicly Visible
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingSections.has('privateNotes') ? (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Private development notes, plot ideas, or character reminders
                      </div>
                      <Textarea
                        value={getEditableValue('privateNotes', 'notes', privateNotes)}
                        onChange={(e) => {
                          updateFieldValue('privateNotes', 'notes', e.target.value);
                          setPrivateNotes(e.target.value);
                        }}
                        className="text-foreground leading-relaxed bg-transparent border-dashed border-red-500/50 focus:border-red-500 min-h-[150px]"
                        placeholder="Private notes about character development, plot ideas, reminders, etc. This content is never shown to the public..."
                      />
                    </div>
                  ) : (
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {privateNotes || (
                        <div className="text-center py-8 text-muted-foreground/70">
                          <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No private notes yet</p>
                          <p className="text-xs">Click Edit to add development notes or reminders</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </section>
        )}

      </main>
    </div>
  );
};

export default CharacterProfileDynamic;