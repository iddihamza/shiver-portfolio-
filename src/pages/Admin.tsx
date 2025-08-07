import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, Users, BookOpen, MapPin, 
  Image, LogOut, User, Clock, FileText, Download, ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChapters } from "@/hooks/useChapters";
import { useCharacterProfiles } from "@/hooks/useCharacters";
import { useLocations } from "@/hooks/useLocations";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("chapters");
  const { user, profile, signOut } = useAuth();
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const { data: characters = [], isLoading: charactersLoading } = useCharacterProfiles();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const getPublicUrl = (path: string, bucket: string = 'documents') => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setDocumentsLoading(true);
        const { data, error } = await supabase.storage.from('documents').list('', {
          limit: 100,
          offset: 0,
        });

        if (error) {
          console.error('Error fetching documents:', error);
        } else {
          setDocuments(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setDocumentsLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        setImagesLoading(true);
        // Try to fetch from common image bucket names
        const buckets = ['images', 'uploads', 'media', 'assets'];
        let allImages: any[] = [];

        for (const bucket of buckets) {
          try {
            const { data, error } = await supabase.storage.from(bucket).list('', {
              limit: 100,
              offset: 0,
            });

            if (!error && data) {
              const imagesWithBucket = data.map(file => ({ ...file, bucket }));
              allImages = [...allImages, ...imagesWithBucket];
            }
          } catch (bucketError) {
            // Bucket doesn't exist, continue to next one
            console.log(`Bucket '${bucket}' not found`);
          }
        }

        setImages(allImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setImagesLoading(false);
      }
    };

    fetchDocuments();
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold mono-font text-foreground">
              Shiver Admin
            </Link>
            <Badge variant="outline" className="bg-accent/10 text-accent">
              Supabase Data
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                {profile?.username || user?.email}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card/20 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeSection === "chapters" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("chapters")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Chapters ({chapters.length})
            </Button>
            <Button
              variant={activeSection === "characters" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("characters")}
            >
              <Users className="w-4 h-4 mr-2" />
              Characters ({characters.length})
            </Button>
            <Button
              variant={activeSection === "locations" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("locations")}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Locations ({locations.length})
            </Button>
            <Button
              variant={activeSection === "documents" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("documents")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents ({documents.length})
            </Button>
            <Button
              variant={activeSection === "images" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("images")}
            >
              <Image className="w-4 h-4 mr-2" />
              Images ({images.length})
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === "chapters" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mono-font">Chapters</h1>
                <Badge variant="secondary">{chapters.length} Total</Badge>
              </div>

              {chaptersLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading chapters...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {chapters.map((chapter: any) => (
                    <Card key={chapter.id} className="tech-card-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mono-font">{chapter.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              ID: {chapter.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(chapter.created_at)}
                            </Badge>
                            {chapter.cover_image_url && (
                              <Badge variant="secondary">
                                <Image className="w-3 h-3 mr-1" />
                                Has Cover
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {chapter.summary && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {chapter.summary}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Last updated: {formatDate(chapter.updated_at)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "characters" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mono-font">Characters</h1>
                <Badge variant="secondary">{characters.length} Total</Badge>
              </div>

              {charactersLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading characters...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {characters.map((character: any) => (
                    <Card key={character.id} className="tech-card-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mono-font">{character.full_name}</CardTitle>
                            {character.title && (
                              <p className="text-sm text-accent mt-1">{character.title}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              ID: {character.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(character.created_at)}
                            </Badge>
                            {character.img_url && (
                              <Badge variant="secondary">
                                <Image className="w-3 h-3 mr-1" />
                                Has Image
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {character.summary_tagline && (
                          <p className="text-sm text-muted-foreground mb-2 italic">
                            "{character.summary_tagline}"
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {character.species_race && (
                            <Badge variant="outline" className="text-xs">
                              {character.species_race}
                            </Badge>
                          )}
                          {character.age && (
                            <Badge variant="outline" className="text-xs">
                              Age: {character.age}
                            </Badge>
                          )}
                          {character.role_in_story && (
                            <Badge variant="secondary" className="text-xs">
                              {character.role_in_story}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {formatDate(character.updated_at)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "locations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mono-font">Locations</h1>
                <Badge variant="secondary">{locations.length} Total</Badge>
              </div>

              {locationsLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading locations...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {locations.map((location: any) => (
                    <Card key={location.id} className="tech-card-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mono-font">{location.name}</CardTitle>
                            {location.location_type && (
                              <p className="text-sm text-accent mt-1">{location.location_type}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              ID: {location.id}
                            </p>
                          </div>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(location.created_at)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {location.summary && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {location.summary}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Last updated: {formatDate(location.updated_at)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mono-font">Documents</h1>
                <Badge variant="secondary">{documents.length} Files</Badge>
              </div>

              {documentsLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading documents...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.filter(file => file.name !== '.emptyFolderPlaceholder').map((file: any) => (
                    <Card key={file.id} className="tech-card-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-accent" />
                              </div>
                            </div>
                            <div>
                              <CardTitle className="mono-font text-base">{file.name}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatFileSize(file.metadata?.size || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getFileExtension(file.name)}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(file.updated_at || file.created_at)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            <p>ID: {file.id}</p>
                            <p>Last modified: {formatDate(file.updated_at || file.created_at)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(getPublicUrl(file.name), '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const url = getPublicUrl(file.name);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = file.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {documents.filter(file => file.name !== '.emptyFolderPlaceholder').length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
                      <p className="text-sm text-muted-foreground">Upload files to the documents bucket to see them here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "images" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mono-font">Images</h1>
                <Badge variant="secondary">{images.length} Images</Badge>
              </div>

              {imagesLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading images...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group images by bucket */}
                  {Array.from(new Set(images.map(img => img.bucket))).map(bucket => {
                    const bucketImages = images.filter(img => img.bucket === bucket && img.name !== '.emptyFolderPlaceholder');
                    
                    if (bucketImages.length === 0) return null;

                    return (
                      <div key={bucket} className="space-y-4">
                        <h2 className="text-xl font-semibold mono-font text-accent capitalize">{bucket} Bucket</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {bucketImages.map((image: any) => (
                            <Card key={`${image.bucket}-${image.id}`} className="tech-card-glow overflow-hidden">
                              <div className="relative group">
                                <div className="aspect-square bg-card/50 flex items-center justify-center">
                                  {isImageFile(image.name) ? (
                                    <img
                                      src={getPublicUrl(image.name, image.bucket)}
                                      alt={image.name}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyVjdIMTlMMTggNUg2TDUgN0gzVjE5SDIxVjEyWiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                      }}
                                    />
                                  ) : (
                                    <Image className="w-8 h-8 text-muted-foreground" />
                                  )}
                                </div>
                                
                                {/* Hover overlay with actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => window.open(getPublicUrl(image.name, image.bucket), '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      const url = getPublicUrl(image.name, image.bucket);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = image.name;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <CardContent className="p-3">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium mono-font truncate" title={image.name}>
                                    {image.name}
                                  </p>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                      {getFileExtension(image.name)}
                                    </Badge>
                                    <span>{formatFileSize(image.metadata?.size || 0)}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(image.updated_at || image.created_at)}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {images.filter(img => img.name !== '.emptyFolderPlaceholder').length === 0 && (
                    <div className="text-center py-12">
                      <Image className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No images found</p>
                      <p className="text-sm text-muted-foreground">Upload images to storage buckets to see them here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;