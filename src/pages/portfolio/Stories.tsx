import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, BookOpen, Search, Edit, Trash2, FileText, Eye } from 'lucide-react';
import { useStories, useDeleteStory } from '@/hooks/useStories';
import { useChapters } from '@/hooks/useChapters';
import { useToast } from '@/hooks/use-toast';
import { SwipeCarousel } from '@/components/ui/mobile-components';
import { useIsMobile } from '@/hooks/use-mobile';

const Stories = () => {
  const { data: stories = [], isLoading: storiesLoading, error: storiesError } = useStories();
  const { data: allChapters = [], isLoading: chaptersLoading } = useChapters();
  const { mutate: deleteStory, isPending: deletePending } = useDeleteStory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const statusOptions = [
    { id: 'all', label: 'All Stories' },
    { id: 'draft', label: 'Draft' },
    { id: 'published', label: 'Published' },
    { id: 'on-hold', label: 'On Hold' }
  ];

  const handleDeleteStory = (storyId: string, storyTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${storyTitle}"? This action cannot be undone.`)) {
      deleteStory(storyId);
    }
  };

  // Filter stories
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (story.summary && story.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (story.genre && story.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (story.tags && story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesStatus = selectedStatus === 'all' || story.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      published: 'bg-green-500/10 text-green-500 border-green-500/20',
      'on-hold': 'bg-red-500/10 text-red-500 border-red-500/20',
      review: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  // Calculate stats
  const totalWordCount = stories.reduce((sum, story) => sum + (story.word_count || 0), 0);
  const publishedStories = stories.filter(story => story.status === 'published').length;
  const averageWordCount = stories.length > 0 ? Math.round(totalWordCount / stories.length) : 0;

  // Get chapter count for each story
  const getChapterCount = (storyId: string) => {
    return allChapters.filter(chapter => chapter.story_id === storyId).length;
  };

  if (storiesLoading || chaptersLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          <p className="text-muted-foreground ml-4">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (storiesError) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="text-center py-20">
          <p className="text-destructive mb-4">Error loading stories. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Sub Header */}
      <header className="fixed top-20 left-0 w-full bg-card/60 backdrop-blur-sm z-40 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/portfolio" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="mono-font font-bold text-xl tracking-wide">Stories</span>
          </Link>
          <Button asChild className="mono-font">
            <Link to="/portfolio/stories/new">
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Link>
          </Button>
        </div>
      </header>

      <div className="pt-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="w-12 h-12 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
                Your Stories
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Manage your creative universe. Each story contains chapters, characters, and locations
              that build your narrative world.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="mono-font">
                {stories.length} stories
              </Badge>
              <Badge variant="outline" className="mono-font">
                {totalWordCount.toLocaleString()} total words
              </Badge>
              <Badge variant="outline" className="mono-font">
                {allChapters.length} chapters
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card/60">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stories.length}</div>
                <div className="text-sm text-muted-foreground mono-font">Total Stories</div>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{publishedStories}</div>
                <div className="text-sm text-muted-foreground mono-font">Published</div>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{averageWordCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mono-font">Avg Words/Story</div>
              </CardContent>
            </Card>
            <Card className="bg-card/60">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{allChapters.length}</div>
                <div className="text-sm text-muted-foreground mono-font">Total Chapters</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search stories by title, summary, genre, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 mono-font"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const isActive = selectedStatus === status.id;
                const count = status.id === 'all' ? stories.length : stories.filter(story => story.status === status.id).length;
                return (
                  <Button
                    key={status.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status.id)}
                    className="mono-font"
                  >
                    {status.label}
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Stories Grid */}
          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2 mono-font">
                {stories.length === 0 ? "Start your first story" : "No stories match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {stories.length === 0 
                  ? "Create your first story and begin building your creative universe."
                  : "Try adjusting your search or status filters."
                }
              </p>
              {stories.length === 0 && (
                <Button asChild className="mono-font">
                  <Link to="/portfolio/stories/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Story
                  </Link>
                </Button>
              )}
            </div>
          ) : isMobile ? (
            <SwipeCarousel className="pb-4">
              {filteredStories.map((story) => {
                const chapterCount = getChapterCount(story.id);
                return (
                  <Card key={story.id} className="bg-card hover:bg-card/80 transition-colors group min-w-[280px] w-[280px]">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(story.status || 'draft')}>
                            {story.status || 'draft'}
                          </Badge>
                          {story.genre && (
                            <Badge variant="secondary" className="mono-font text-xs">
                              {story.genre}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link to={`/portfolio/stories/${story.id}`}>
                              <Eye className="w-3 h-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link to={`/portfolio/stories/${story.id}/edit`}>
                              <Edit className="w-3 h-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStory(story.id, story.title)}
                            disabled={deletePending}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg mono-font text-foreground line-clamp-2">
                        {story.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {story.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {story.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground mono-font">
                          {(story.word_count || 0).toLocaleString()} words
                        </span>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-accent" />
                          <span className="text-accent mono-font">{chapterCount} chapters</span>
                        </div>
                      </div>
                      
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {story.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {story.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{story.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mono-font">
                        Updated {new Date(story.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </SwipeCarousel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => {
                const chapterCount = getChapterCount(story.id);
                return (
                  <Card key={story.id} className="bg-card hover:bg-card/80 transition-colors group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(story.status || 'draft')}>
                            {story.status || 'draft'}
                          </Badge>
                          {story.genre && (
                            <Badge variant="secondary" className="mono-font text-xs">
                              {story.genre}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link to={`/portfolio/stories/${story.id}`}>
                              <Eye className="w-3 h-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link to={`/portfolio/stories/${story.id}/edit`}>
                              <Edit className="w-3 h-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStory(story.id, story.title)}
                            disabled={deletePending}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg mono-font text-foreground line-clamp-2">
                        {story.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {story.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {story.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground mono-font">
                          {(story.word_count || 0).toLocaleString()} words
                        </span>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-accent" />
                          <span className="text-accent mono-font">{chapterCount} chapters</span>
                        </div>
                      </div>
                      
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {story.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {story.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{story.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mono-font">
                        Updated {new Date(story.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stories;