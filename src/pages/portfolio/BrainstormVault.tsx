import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Brain, Search, Lightbulb, FileText, MessageSquare, Zap, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrainstormIdea {
  id: string;
  title: string;
  content: string;
  category: 'scene' | 'character' | 'plot' | 'dialogue' | 'world' | 'theme';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BrainstormVault = () => {
  const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingIdea, setIsAddingIdea] = useState(false);
  const [editingIdea, setEditingIdea] = useState<BrainstormIdea | null>(null);
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All Ideas', icon: Brain },
    { id: 'scene', label: 'Scenes', icon: FileText },
    { id: 'character', label: 'Characters', icon: MessageSquare },
    { id: 'plot', label: 'Plot Twists', icon: Zap },
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare },
    { id: 'world', label: 'Worldbuilding', icon: Lightbulb },
    { id: 'theme', label: 'Themes', icon: Brain }
  ];

  // Load ideas from localStorage
  useEffect(() => {
    const savedIdeas = localStorage.getItem('shiver_brainstorm_vault');
    if (savedIdeas) {
      const parsedIdeas = JSON.parse(savedIdeas).map((idea: any) => ({
        ...idea,
        createdAt: new Date(idea.createdAt),
        updatedAt: new Date(idea.updatedAt)
      }));
      setIdeas(parsedIdeas);
    }
  }, []);

  // Save ideas to localStorage
  const saveIdeas = (updatedIdeas: BrainstormIdea[]) => {
    localStorage.setItem('shiver_brainstorm_vault', JSON.stringify(updatedIdeas));
    setIdeas(updatedIdeas);
  };

  const addIdea = (newIdea: Omit<BrainstormIdea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const idea: BrainstormIdea = {
      ...newIdea,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedIdeas = [...ideas, idea];
    saveIdeas(updatedIdeas);
    
    toast({
      title: "Idea added to vault",
      description: "Your creative spark has been safely stored."
    });
  };

  const updateIdea = (updatedIdea: BrainstormIdea) => {
    const updatedIdeas = ideas.map(idea => 
      idea.id === updatedIdea.id 
        ? { ...updatedIdea, updatedAt: new Date() }
        : idea
    );
    saveIdeas(updatedIdeas);
    
    toast({
      title: "Idea updated",
      description: "Your creative vision has been refined."
    });
  };

  const deleteIdea = (ideaId: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== ideaId);
    saveIdeas(updatedIdeas);
    
    toast({
      title: "Idea removed",
      description: "The idea has been deleted from your vault."
    });
  };

  // Filter ideas based on search and category
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Lightbulb;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      scene: 'bg-blue-500/10 text-blue-500',
      character: 'bg-green-500/10 text-green-500',
      plot: 'bg-purple-500/10 text-purple-500',
      dialogue: 'bg-yellow-500/10 text-yellow-500',
      world: 'bg-cyan-500/10 text-cyan-500',
      theme: 'bg-pink-500/10 text-pink-500'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  };

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
              <li><Link to="/portfolio" className="text-accent hover:underline">Portfolio</Link></li>
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

      {/* Sub Header */}
      <header className="fixed top-20 left-0 w-full bg-card/60 backdrop-blur-sm z-40 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/portfolio" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="mono-font font-bold text-xl tracking-wide">Brainstorming Vault</span>
          </Link>
          <Dialog open={isAddingIdea} onOpenChange={setIsAddingIdea}>
            <DialogTrigger asChild>
              <Button className="mono-font">
                <Plus className="w-4 h-4 mr-2" />
                Add Idea
              </Button>
            </DialogTrigger>
            <IdeaDialog 
              onSubmit={addIdea}
              onClose={() => setIsAddingIdea(false)}
            />
          </Dialog>
        </div>
      </header>

      <div className="pt-40 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="w-12 h-12 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
                Brainstorming Vault
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Capture every creative spark—scenes, plot twists, character quirks, and dialogue snippets. 
              Your vault of raw ideas that can later be referenced and developed into your stories.
            </p>
            <Badge variant="secondary" className="mono-font">
              {ideas.length} ideas stored
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search ideas, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 mono-font"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="mono-font"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                    {category.id !== 'all' && (
                      <Badge variant="secondary" className="ml-2">
                        {ideas.filter(idea => idea.category === category.id).length}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Ideas Grid */}
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2 mono-font">
                {ideas.length === 0 ? "Your vault awaits creative sparks" : "No ideas match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {ideas.length === 0 
                  ? "Start capturing your creative ideas—scenes, characters, plot twists, and more."
                  : "Try adjusting your search or category filters."
                }
              </p>
              {ideas.length === 0 && (
                <Button onClick={() => setIsAddingIdea(true)} className="mono-font">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Idea
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => {
                const CategoryIcon = getCategoryIcon(idea.category);
                return (
                  <Card key={idea.id} className="bg-card hover:bg-card/80 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-accent" />
                          <Badge variant="outline" className={getCategoryColor(idea.category)}>
                            {idea.category}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingIdea(idea)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteIdea(idea.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg mono-font text-foreground line-clamp-2">
                        {idea.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {idea.content}
                      </p>
                      
                      {idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {idea.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {idea.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{idea.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mono-font">
                        Created {idea.createdAt.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingIdea && (
        <Dialog open={!!editingIdea} onOpenChange={() => setEditingIdea(null)}>
          <IdeaDialog 
            idea={editingIdea}
            onSubmit={(updatedData) => {
              updateIdea({ ...editingIdea, ...updatedData });
              setEditingIdea(null);
            }}
            onClose={() => setEditingIdea(null)}
          />
        </Dialog>
      )}
    </div>
  );
};

// Idea Dialog Component
interface IdeaDialogProps {
  idea?: BrainstormIdea;
  onSubmit: (idea: Omit<BrainstormIdea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const IdeaDialog: React.FC<IdeaDialogProps> = ({ idea, onSubmit, onClose }) => {
  const [title, setTitle] = useState(idea?.title || '');
  const [content, setContent] = useState(idea?.content || '');
  const [category, setCategory] = useState<BrainstormIdea['category']>(idea?.category || 'scene');
  const [tagsInput, setTagsInput] = useState(idea?.tags.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags
    });
    
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="mono-font">
          {idea ? 'Edit Idea' : 'Add New Idea'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your idea a catchy title..."
            className="mono-font"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['scene', 'character', 'plot', 'dialogue', 'world', 'theme'] as const).map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className="mono-font capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Content
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your idea in detail..."
            rows={6}
            className="mono-font"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mono-font block mb-2">
            Tags (comma-separated)
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="noir, mystery, dialogue, character-development..."
            className="mono-font"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="mono-font">
            {idea ? 'Update Idea' : 'Add to Vault'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="mono-font">
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default BrainstormVault;