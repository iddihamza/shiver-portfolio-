import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Edit, Settings, Eye, EyeOff, Save, X, Users, MapPin, Bookmark, Highlight, Type, Palette, BarChart3, Moon, Sun, Zap, Quote, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChapter, useChapters } from "@/hooks/useChapters";
import { useMemo, useState, useEffect } from "react";
const ChapterPage = () => {
  const {
    chapterId
  } = useParams<{
    chapterId: string;
  }>();
  const {
    data: chapter,
    isLoading
  } = useChapter(chapterId || "");
  const { hasRole } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 500; // Fixed words per page
  const isAdmin = hasRole('admin');

  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());
  const [editedData, setEditedData] = useState<any>({});
  const [sectionVisibility, setSectionVisibility] = useState({
    metadata: true,
    content: true,
    navigation: true,
    privateNotes: false
  });
  const [privateNotes, setPrivateNotes] = useState('');

  // Reading experience state
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [readingTime, setReadingTime] = useState(0);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Admin mode helper functions
  const toggleEditing = (sectionId: string) => {
    const newEditing = new Set(editingSections);
    if (newEditing.has(sectionId)) {
      newEditing.delete(sectionId);
      const newEditedData = { ...editedData };
      delete newEditedData[sectionId];
      setEditedData(newEditedData);
    } else {
      newEditing.add(sectionId);
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
    console.log('Saving section:', sectionId, editedData[sectionId]);
    toggleEditing(sectionId);
    // TODO: Implement actual save functionality
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

  // Reading progress tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate reading progress based on current page
  useEffect(() => {
    const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
    setReadingProgress(progress);
  }, [currentPage]);

  const readTime = chapter?.word_count ? `${Math.ceil(chapter.word_count / 250)} min read` : "";
  const {
    data: allChapters = []
  } = useChapters(chapter?.story_id);
  const sortedChapters = useMemo(() => [...allChapters].sort((a, b) => a.chapter_number - b.chapter_number), [allChapters]);

  // Split content into word-based pages
  const contentPages = useMemo(() => {
    const content = chapter?.content_plain || "";
    const words = content.split(/\s+/).filter(word => word.trim());
    const pages = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pages.push(words.slice(i, i + wordsPerPage).join(' '));
    }
    return pages;
  }, [chapter?.content_plain]);
  const totalPages = contentPages.length;
  const currentPageContent = contentPages[currentPage - 1] || "";
  const currentIndex = sortedChapters.findIndex(c => c.id === chapter?.id);
  const prevChapterId = currentIndex > 0 ? sortedChapters[currentIndex - 1].id : null;
  const nextChapterId = currentIndex >= 0 && currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1].id : null;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 400,
      behavior: 'smooth'
    });
  };

  // Reset to page 1 when chapter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [chapterId]);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>;
  }
  if (!chapter) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Chapter Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Enhanced Header with Admin Controls */}
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="mono-font font-bold text-xl tracking-wide">Shiver</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Reading Progress */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm mono-font">{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300" 
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>

            {/* Reading Stats */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm mono-font">{readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm mono-font">
                  Chapter {chapter?.chapter_number}
                  {totalPages > 1 && <span className="text-accent ml-2">
                      (Page {currentPage} of {totalPages})
                    </span>}
                </span>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Switch 
                  checked={isAdminMode} 
                  onCheckedChange={setIsAdminMode}
                  className="data-[state=checked]:bg-accent"
                />
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Admin</span>
              </div>
            )}

            {/* Edit Button */}
            {isAdmin && (
              <Button asChild size="sm" variant="outline">
                <Link to={`/portfolio/chapter/${chapter?.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Chapter Content */}
      <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        
        {/* 📖 Enhanced Chapter Header Section */}
        {sectionVisibility.metadata && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-card/80 to-card/60 rounded-xl p-6 md:p-8 border border-border">
              {/* Admin Controls */}
              {isAdminMode && (
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={editingSections.has('metadata') ? 'default' : 'outline'}
                      onClick={() => toggleEditing('metadata')}
                      className="h-8"
                    >
                      {editingSections.has('metadata') ? (
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
                    {editingSections.has('metadata') && (
                      <Button
                        size="sm"
                        onClick={() => saveSection('metadata')}
                        className="h-8 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <Switch 
                      checked={sectionVisibility.metadata}
                      onCheckedChange={() => toggleSectionVisibility('metadata')}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                </div>
              )}

              {/* Chapter Title & Metadata */}
              <div className="text-center mb-8">
                {editingSections.has('metadata') ? (
                  <Input
                    value={getEditableValue('metadata', 'title', chapter?.title || '')}
                    onChange={(e) => updateFieldValue('metadata', 'title', e.target.value)}
                    className="text-4xl md:text-5xl font-bold mono-font text-foreground text-center bg-transparent border-dashed border-accent/50 focus:border-accent mb-4"
                    placeholder="Chapter Title"
                  />
                ) : (
                  <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground mb-4">
                    {chapter?.title}
                  </h1>
                )}

                {/* Chapter Summary */}
                {(chapter?.summary || editingSections.has('metadata')) && (
                  editingSections.has('metadata') ? (
                    <Textarea
                      value={getEditableValue('metadata', 'summary', chapter?.summary || '')}
                      onChange={(e) => updateFieldValue('metadata', 'summary', e.target.value)}
                      className="text-xl text-accent mono-font bg-transparent border-dashed border-accent/50 focus:border-accent text-center resize-none mb-6"
                      placeholder="Chapter summary or tagline..."
                      rows={2}
                    />
                  ) : (
                    <p className="text-xl text-accent mb-6 mono-font">
                      {chapter?.summary}
                    </p>
                  )
                )}


                <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
              </div>
            </div>
          </section>
        )}

        {/* ⚙️ Reading Settings Section */}
        {sectionVisibility.settings && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
                <Settings className="w-6 h-6 text-accent" />
                Reading Settings
              </h3>
              
              {isAdminMode && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <Switch 
                    checked={sectionVisibility.settings}
                    onCheckedChange={() => toggleSectionVisibility('settings')}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Typography Settings */}
              <Card className="tech-card-glow">
                <CardHeader>
                  <CardTitle className="mono-font text-foreground flex items-center gap-2">
                    <Type className="w-5 h-5 text-accent" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Font Size Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">Font Size</label>
                      <span className="text-xs text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={([value]) => setFontSize(value)}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Line Height Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">Line Height</label>
                      <span className="text-xs text-muted-foreground">{lineHeight.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[lineHeight]}
                      onValueChange={([value]) => setLineHeight(value)}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Reading Actions */}
              <Card className="tech-card-glow">
                <CardHeader>
                  <CardTitle className="mono-font text-foreground flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-accent" />
                    Reading Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newBookmarks = new Set(bookmarks);
                      if (newBookmarks.has(currentPage)) {
                        newBookmarks.delete(currentPage);
                      } else {
                        newBookmarks.add(currentPage);
                      }
                      setBookmarks(newBookmarks);
                    }}
                    className="w-full"
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${bookmarks.has(currentPage) ? 'fill-current' : ''}`} />
                    {bookmarks.has(currentPage) ? 'Remove Bookmark' : 'Bookmark Page'}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/40 rounded-lg p-3 border border-border/50 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Reading Time</div>
                      <div className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readingTime}m
                      </div>
                    </div>
                    <div className="bg-background/40 rounded-lg p-3 border border-border/50 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Bookmarks</div>
                      <div className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        {bookmarks.size}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Progress */}
              <Card className="tech-card-glow bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="mono-font text-accent flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">{Math.round(readingProgress)}%</div>
                    <div className="text-xs text-muted-foreground mb-3">Chapter Complete</div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300" 
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Current Page</div>
                    <div className="text-sm font-medium text-foreground">{currentPage} of {totalPages}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Cover Image */}
        {chapter?.cover_image_url && (
          <div className="mb-8 tech-card-glow overflow-hidden rounded-lg">
            <img 
              src={chapter.cover_image_url} 
              alt={chapter.title} 
              className="w-full h-64 object-cover" 
              onError={e => {
                e.currentTarget.src = "/placeholder.svg";
              }} 
            />
          </div>
        )}

        {/* 📚 Enhanced Chapter Content Section */}
        {sectionVisibility.content && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
                <Quote className="w-6 h-6 text-accent" />
                Chapter Content
              </h3>
              
              {isAdminMode && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <Switch 
                      checked={sectionVisibility.content}
                      onCheckedChange={() => toggleSectionVisibility('content')}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant={editingSections.has('content') ? 'default' : 'outline'}
                    onClick={() => toggleEditing('content')}
                  >
                    {editingSections.has('content') ? (
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
                  {editingSections.has('content') && (
                    <Button
                      size="sm"
                      onClick={() => saveSection('content')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <Card className="tech-card-glow bg-card/50 backdrop-blur-sm">
              <CardContent 
                className="p-8 md:p-12" 
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight
                }}
              >
                <div className="prose prose-lg max-w-none text-foreground">
                  {currentPageContent ? (
                    editingSections.has('content') ? (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground mb-2">Editing page {currentPage} content</div>
                        <Textarea
                          value={getEditableValue('content', `page_${currentPage}`, currentPageContent)}
                          onChange={(e) => updateFieldValue('content', `page_${currentPage}`, e.target.value)}
                          className="text-foreground leading-relaxed bg-transparent border-dashed border-accent/50 focus:border-accent min-h-[400px] font-serif"
                          placeholder="Chapter content..."
                          style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="leading-relaxed text-foreground whitespace-pre-line font-serif selection:bg-accent/20"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: lineHeight
                        }}
                      >
                        {currentPageContent}
                      </div>
                    )
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No content available for this chapter.
                    </p>
                  )}
                </div>
                
                {/* Reading Progress Bar */}
                <div className="mt-8 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Reading Progress</span>
                    <span>{Math.round(readingProgress)}% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-300" 
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Enhanced Content Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Card className="tech-card-glow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground mono-font">
                      Page {currentPage} of {totalPages}
                    </div>
                    {bookmarks.has(currentPage) && (
                      <Badge variant="secondary" className="text-xs">
                        <Bookmark className="w-3 h-3 mr-1 fill-current" />
                        Bookmarked
                      </Badge>
                    )}
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover-lift"} 
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              onClick={() => handlePageChange(pageNum)} 
                              isActive={currentPage === pageNum} 
                              className={`cursor-pointer hover-lift ${
                                bookmarks.has(pageNum) ? 'ring-2 ring-accent/30' : ''
                              }`}
                            >
                              {pageNum}
                              {bookmarks.has(pageNum) && (
                                <Bookmark className="w-2 h-2 ml-1 fill-current" />
                              )}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} 
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover-lift"} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 🧢 Enhanced Navigation Section */}
        {sectionVisibility.navigation && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mono-font text-foreground flex items-center gap-2">
                <MapPin className="w-6 h-6 text-accent" />
                Chapter Navigation
              </h3>
              
              {isAdminMode && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <Switch 
                    checked={sectionVisibility.navigation}
                    onCheckedChange={() => toggleSectionVisibility('navigation')}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Previous Chapter */}
              <Card className="tech-card-glow hover-glow-intense">
                <CardContent className="p-6">
                  {prevChapterId ? (
                    <Link to={`/story/${prevChapterId}`} className="block">
                      <div className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <div>
                          <div className="text-xs mono-font mb-1">Previous</div>
                          <div className="font-medium">Chapter {sortedChapters[currentIndex - 1]?.chapter_number}</div>
                          <div className="text-sm truncate mt-1">{sortedChapters[currentIndex - 1]?.title}</div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground/50">
                      <ArrowLeft className="w-5 h-5" />
                      <div>
                        <div className="text-xs mono-font mb-1">Previous</div>
                        <div className="font-medium">No Previous Chapter</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Chapter Info */}
              <Card className="tech-card-glow bg-accent/5 border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="text-accent mono-font text-sm mb-2">Currently Reading</div>
                  <div className="font-bold text-lg mb-1">Chapter {chapter?.chapter_number}</div>
                  <div className="text-sm text-muted-foreground truncate">{chapter?.title}</div>
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-muted-foreground">{Math.round(readingProgress)}% Complete</div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300" 
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Chapter */}
              <Card className="tech-card-glow hover-glow-intense">
                <CardContent className="p-6">
                  {nextChapterId ? (
                    <Link to={`/story/${nextChapterId}`} className="block">
                      <div className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                        <div className="flex-1 text-right">
                          <div className="text-xs mono-font mb-1">Next</div>
                          <div className="font-medium">Chapter {sortedChapters[currentIndex + 1]?.chapter_number}</div>
                          <div className="text-sm truncate mt-1">{sortedChapters[currentIndex + 1]?.title}</div>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                  ) : (
                    <Link to="/characters" className="block">
                      <div className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                        <div className="flex-1 text-right">
                          <div className="text-xs mono-font mb-1">Next</div>
                          <div className="font-medium">Meet the Characters</div>
                          <div className="text-sm mt-1">Explore character profiles</div>
                        </div>
                        <Users className="w-5 h-5" />
                      </div>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

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
                    Chapter Development Notes
                    <Badge variant="destructive" className="text-xs">
                      Not Publicly Visible
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingSections.has('privateNotes') ? (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Private notes for chapter development, plot points, character moments, etc.
                      </div>
                      <Textarea
                        value={getEditableValue('privateNotes', 'notes', privateNotes)}
                        onChange={(e) => {
                          updateFieldValue('privateNotes', 'notes', e.target.value);
                          setPrivateNotes(e.target.value);
                        }}
                        className="text-foreground leading-relaxed bg-transparent border-dashed border-red-500/50 focus:border-red-500 min-h-[150px]"
                        placeholder="Private development notes, plot reminders, character development notes, reader feedback, revision ideas, etc. This content is never shown to readers..."
                      />
                    </div>
                  ) : (
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {privateNotes || (
                        <div className="text-center py-8 text-muted-foreground/70">
                          <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No private notes yet</p>
                          <p className="text-xs">Click Edit to add chapter development notes</p>
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

      {/* 🔧 Floating Reading Settings Menu */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {/* Settings Panel */}
          {showSettingsMenu && (
            <div className="absolute bottom-16 right-0 w-80 bg-card border border-border rounded-xl shadow-2xl p-6 tech-card-glow animate-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold mono-font text-foreground">Reading Settings</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettingsMenu(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Font Size
                    </label>
                    <Badge variant="secondary" className="text-xs">{fontSize}px</Badge>
                  </div>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                {/* Line Height */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Line Height
                    </label>
                    <Badge variant="secondary" className="text-xs">{lineHeight.toFixed(1)}</Badge>
                  </div>
                  <Slider
                    value={[lineHeight]}
                    onValueChange={([value]) => setLineHeight(value)}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                
                {/* Quick Actions */}
                <div className="pt-4 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newBookmarks = new Set(bookmarks);
                      if (newBookmarks.has(currentPage)) {
                        newBookmarks.delete(currentPage);
                      } else {
                        newBookmarks.add(currentPage);
                      }
                      setBookmarks(newBookmarks);
                    }}
                    className="w-full hover-lift button-hover"
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${bookmarks.has(currentPage) ? 'fill-current' : ''}`} />
                    {bookmarks.has(currentPage) ? 'Remove Bookmark' : 'Bookmark Page'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Toggle Button */}
          <Button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            size="lg"
            className={`rounded-full w-14 h-14 shadow-xl hover-lift tech-card-glow transition-all duration-200 border-2 ${
              showSettingsMenu 
                ? 'bg-accent text-accent-foreground border-accent shadow-accent/30' 
                : 'bg-foreground/90 text-background hover:bg-accent hover:text-accent-foreground border-foreground/20 hover:border-accent'
            }`}
          >
            <Settings className={`w-6 h-6 transition-transform duration-200 ${
              showSettingsMenu ? 'rotate-90' : ''
            }`} />
          </Button>
        </div>
      </div>
    </div>;
};
export default ChapterPage;