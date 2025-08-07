import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Brain, 
  Bot, 
  Upload, 
  Plus, 
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  FileText,
  Image,
  Calendar,
  Activity
} from 'lucide-react';
import { useStories } from '@/hooks/useStories';
import { useChapters } from '@/hooks/useChapters';
import { useCharacterProfiles } from '@/hooks/useCharacters';
import { useLocations } from '@/hooks/useLocations';

const Dashboard = () => {
  const [aiPromptsUsed, setAiPromptsUsed] = useState(0);
  const [brainstormIdeas, setBrainstormIdeas] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: string;
    title: string;
    timestamp: string;
    icon: typeof BookOpen;
  }>>([]);

  const dailyPromptLimit = 5;
  const weeklyGoal = 10000; // words

  // Fetch real data from Supabase
  const { data: stories = [], isLoading: storiesLoading } = useStories();
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters();
  const { data: characters = [], isLoading: charactersLoading } = useCharacterProfiles();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();

  // Calculate current word count from chapters
  const currentWordCount = chapters.reduce((total, chapter) => total + (chapter.word_count || 0), 0);

  useEffect(() => {
    // Load saved data from localStorage
    const savedPrompts = localStorage.getItem('shiver_ai_prompts_used');
    const savedIdeas = localStorage.getItem('shiver_brainstorm_vault');

    if (savedPrompts) {
      const { count, date } = JSON.parse(savedPrompts);
      const today = new Date().toDateString();
      if (date === today) {
        setAiPromptsUsed(count);
      }
    }

    if (savedIdeas) {
      setBrainstormIdeas(JSON.parse(savedIdeas));
    }

    // Generate recent activity from real data
    const activities = [];

    // Recent chapters
    const recentChapters = chapters
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 2);

    recentChapters.forEach(chapter => {
      activities.push({
        type: 'chapter',
        title: `Chapter: "${chapter.title}" updated`,
        timestamp: new Date(chapter.updated_at).toLocaleDateString(),
        icon: BookOpen
      });
    });

    // Recent characters
    const recentCharacters = characters
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 1);

    recentCharacters.forEach(character => {
      activities.push({
        type: 'character',
        title: `${character.full_name} profile updated`,
        timestamp: new Date(character.updated_at).toLocaleDateString(),
        icon: Users
      });
    });

    // Recent locations
    const recentLocations = locations
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 1);

    recentLocations.forEach(location => {
      activities.push({
        type: 'location',
        title: `${location.name} location expanded`,
        timestamp: new Date(location.updated_at).toLocaleDateString(),
        icon: MapPin
      });
    });

    setRecentActivity(activities.slice(0, 4));
  }, [chapters, characters, locations]);

  const stats = {
    totalStories: stories.length,
    totalChapters: chapters.length,
    totalCharacters: characters.length,
    totalLocations: locations.length,
    visualReferences: 12, // Mock data for visual references
    brainstormIdeas: brainstormIdeas.length,
    weeklyWordCount: currentWordCount,
    weeklyGoal: weeklyGoal
  };

  const completionPercentage = Math.min((stats.weeklyWordCount / stats.weeklyGoal) * 100, 100);
  const isLoading = storiesLoading || chaptersLoading || charactersLoading || locationsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <span className="mono-font font-bold text-xl tracking-wide">Shiver</span>
          </Link>
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

      <div className="pt-24 max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mono-font text-foreground mb-2">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back to your creative universe. Here's your progress at a glance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="mono-font">
              AI Prompts: {aiPromptsUsed}/{dailyPromptLimit}
            </Badge>
            <Badge variant="outline" className="mono-font">
              Phase 1: Portfolio Builder
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="tech-card-glow bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalChapters}</p>
                      <p className="text-sm text-muted-foreground">Chapters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tech-card-glow bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalCharacters}</p>
                      <p className="text-sm text-muted-foreground">Characters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tech-card-glow bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalLocations}</p>
                      <p className="text-sm text-muted-foreground">Locations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tech-card-glow bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.brainstormIdeas}</p>
                      <p className="text-sm text-muted-foreground">Ideas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Weekly Progress */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font text-foreground">
                      <Target className="w-5 h-5 text-accent" />
                      Weekly Writing Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-mono text-foreground">
                        {stats.weeklyWordCount.toLocaleString()} / {stats.weeklyGoal.toLocaleString()} words
                      </span>
                    </div>
                    <Progress value={completionPercentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(completionPercentage)}% complete</span>
                      <span>{Math.max(0, stats.weeklyGoal - stats.weeklyWordCount).toLocaleString()} words remaining</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions - remaining code is the same */}
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="mono-font text-foreground">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button asChild className="h-16 flex-col gap-2">
                        <Link to="/portfolio/stories">
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
                        <Link to="/portfolio/new-character">
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
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* AI Assistant Status */}
                <Card className="tech-card-glow bg-card/60 border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font text-foreground">
                      <Bot className="w-5 h-5 text-accent" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-1">
                        {dailyPromptLimit - aiPromptsUsed}
                      </div>
                      <p className="text-sm text-muted-foreground">prompts remaining today</p>
                    </div>
                    <Button asChild className="w-full" disabled={aiPromptsUsed >= dailyPromptLimit}>
                      <Link to="/portfolio/ai-assistant">
                        Use AI Assistant
                      </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Resets daily. Get theme suggestions, dialogue critique, and more.
                    </p>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="tech-card-glow bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font text-foreground">
                      <Activity className="w-5 h-5 text-accent" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.slice(0, 4).map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mt-0.5">
                              <Icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground leading-tight">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity. Start creating content to see updates here.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Portfolio Navigation */}
            <Card className="tech-card-glow bg-card/60">
              <CardHeader>
                <CardTitle className="mono-font text-foreground">Explore Your Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  <Link to="/portfolio/stories" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors group">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm mono-font text-center">Stories</span>
                  </Link>

                  <Link to="/characters" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors group">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm mono-font text-center">Characters</span>
                  </Link>

                  <Link to="/locations" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors group">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm mono-font text-center">Locations</span>
                  </Link>

                  <Link to="/portfolio/brainstorm" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors group">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Brain className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm mono-font text-center">Brainstorm</span>
                  </Link>

                  <Link to="/portfolio/visual-references" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors group">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Image className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm mono-font text-center">Visual Refs</span>
                  </Link>

                  <Link to="/portfolio/assets" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors group">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-sm mono-font text-center">Assets</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
