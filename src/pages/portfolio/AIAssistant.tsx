import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bot, Send, Sparkles, Lightbulb, MessageSquare, FileText, Users, MapPin, RefreshCw, Download, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  promptType?: string;
}

interface ExtractedItem {
  type: 'character' | 'location' | 'story' | 'chapter';
  confidence: 'extracted' | 'inferred';
  data: Record<string, any>;
  inferred_fields?: string[];
  missing_fields?: string[];
  source: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiPromptsUsed, setAiPromptsUsed] = useState(0);
  const [selectedPromptType, setSelectedPromptType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  
  // Story Extraction states
  const [content, setContent] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['character', 'location', 'story']);
  const [extractedData, setExtractedData] = useState<ExtractedItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const { toast } = useToast();
  
  const dailyPromptLimit = 5;

  // Load saved data
  useEffect(() => {
    const savedPrompts = localStorage.getItem('shiver_ai_prompts_used');
    const savedMessages = localStorage.getItem('shiver_ai_messages');
    
    if (savedPrompts) {
      const { count, date } = JSON.parse(savedPrompts);
      const today = new Date().toDateString();
      if (date === today) {
        setAiPromptsUsed(count);
      } else {
        // Reset for new day
        localStorage.setItem('shiver_ai_prompts_used', JSON.stringify({ count: 0, date: today }));
        setAiPromptsUsed(0);
      }
    }
    
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    }
  }, []);

  const saveMessages = (updatedMessages: ChatMessage[]) => {
    localStorage.setItem('shiver_ai_messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const updatePromptCount = () => {
    const newCount = aiPromptsUsed + 1;
    const today = new Date().toDateString();
    localStorage.setItem('shiver_ai_prompts_used', JSON.stringify({ count: newCount, date: today }));
    setAiPromptsUsed(newCount);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || aiPromptsUsed >= dailyPromptLimit || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      promptType: selectedPromptType || undefined
    };

    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (in real implementation, this would call your AI service)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantResponse = generateMockResponse(userMessage.content, selectedPromptType);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      saveMessages(finalMessages);
      updatePromptCount();
      
      toast({
        title: "AI assistance provided",
        description: `${dailyPromptLimit - aiPromptsUsed - 1} prompts remaining today.`
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSelectedPromptType(null);
    }
  };

  const generateMockResponse = (prompt: string, promptType: string | null): string => {
    // Mock AI responses based on prompt type and content
    const responses = {
      'theme': [
        "Based on your content, I see themes of redemption, the weight of legacy, and the thin line between justice and corruption. Consider exploring how Alexander's struggle with the Enigma mirrors the city's own moral decay.",
        "The recurring motif of frost and cold in your work suggests themes of isolation and emotional distance. This could represent how trauma freezes people in time.",
        "Your characters seem to grapple with inherited sins and chosen paths. A central theme might be whether we can escape our origins or if we're doomed to repeat cycles."
      ],
      'dialogue': [
        "Try making this dialogue more specific to the character's background. Alexander might reference his street upbringing, while Sera could speak with more formal, strategic language.",
        "Consider adding subtext—what are they really saying beneath the words? In noir, characters often talk around their true feelings.",
        "This exchange could benefit from more distinctive voice patterns. Each character should sound unique even without dialogue tags."
      ],
      'character': [
        "This character needs a defining contradiction—something that makes them both relatable and complex. What do they want vs. what do they need?",
        "Consider their relationship to power and how they've been shaped by trauma. In the Shiver universe, everyone carries scars.",
        "What's their fatal flaw? In noir, characters are often undone by their own nature rather than external forces."
      ],
      'plot': [
        "This plot point could be strengthened by tying it more closely to character motivation. What personal stakes drive this conflict?",
        "Consider the noir tradition of moral ambiguity—there might not be clear heroes and villains here.",
        "Think about how this development affects the power dynamics in Rookwick. Every action should ripple through the established order."
      ],
      'default': [
        "Interesting concept! In the context of your Shiver universe, consider how this fits with the established tone of noir-fantasy and cosmic horror.",
        "This has potential. How does it connect to your existing character relationships and the overall mystery of Rookwick?",
        "Good foundation. Think about how you can deepen this with the structural JSON approach—what are the key data points that define this element?"
      ]
    };

    const responseSet = responses[promptType as keyof typeof responses] || responses.default;
    return responseSet[Math.floor(Math.random() * responseSet.length)];
  };

  const promptTemplates = [
    {
      id: 'theme',
      title: 'Suggest a Theme',
      description: 'Get thematic insights for your story',
      icon: Lightbulb,
      template: 'Based on my story content about [describe your scene/chapter], what themes should I explore?'
    },
    {
      id: 'dialogue',
      title: 'Check Dialogue',
      description: 'Improve character conversations',
      icon: MessageSquare,
      template: 'Please review this dialogue and suggest improvements: "[paste your dialogue]"'
    },
    {
      id: 'character',
      title: 'Character Development',
      description: 'Enhance character depth',
      icon: Users,
      template: 'I have a character who [describe character]. How can I make them more compelling?'
    },
    {
      id: 'plot',
      title: 'Plot Assistance',
      description: 'Strengthen story structure',
      icon: FileText,
      template: 'I\'m working on a plot where [describe situation]. What should happen next?'
    },
    {
      id: 'world',
      title: 'Worldbuilding',
      description: 'Expand your universe',
      icon: MapPin,
      template: 'I need help developing [location/concept] in my noir-fantasy world. What details should I add?'
    }
  ];

  const applyTemplate = (template: string, type: string) => {
    setInputMessage(template);
    setSelectedPromptType(type);
  };

  const canSendMessage = inputMessage.trim() && aiPromptsUsed < dailyPromptLimit && !isLoading;

  // Story Extraction Functions
  const handleExtractContent = async () => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please enter some content to extract",
        variant: "destructive"
      });
      return;
    }

    if (selectedTemplates.length === 0) {
      toast({
        title: "No templates selected",
        description: "Please select at least one template",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep(2);
    setIsExtracting(true);

    // Simulate extraction processing
    setTimeout(() => {
      const results = simulateExtraction(content, selectedTemplates);
      setExtractedData(results);
      setCurrentStep(3);
      setIsExtracting(false);
      updatePromptCount(); // Count as AI usage
      
      toast({
        title: "Extraction complete",
        description: `Found ${results.length} items. ${dailyPromptLimit - aiPromptsUsed - 1} prompts remaining today.`
      });
    }, 2000);
  };

  const simulateExtraction = (content: string, templates: string[]): ExtractedItem[] => {
    const results: ExtractedItem[] = [];
    const contentLower = content.toLowerCase();

    // Character extraction - look for character patterns
    if (templates.includes('character')) {
      // Simple pattern matching for names (capitalized words)
      const nameMatches = content.match(/[A-Z][a-z]+ [A-Z][a-z]+/g);
      if (nameMatches) {
        nameMatches.slice(0, 3).forEach((name, index) => {
          results.push({
            type: 'character',
            confidence: 'extracted',
            data: {
              id: `char_${name.toLowerCase().replace(/\s+/g, '_')}`,
              name: name,
              title: '',
              age: '',
              species: 'Human',
              role: index === 0 ? 'Protagonist' : 'Supporting Character',
              background: `Character mentioned in the narrative`,
              personality: {
                core_traits: ['mysterious', 'complex'],
                flaws: ['unknown'],
                emotional_tone: 'neutral'
              },
              visual_design: {
                silhouette: 'distinctive figure',
                style_notes: 'classic design',
                accessories: []
              },
              abilities: {
                core_skills: [],
                powers: []
              },
              relationships: {
                allies: [],
                rivals: [],
                mentor: '',
                affiliations: []
              },
              appearance_in_chapters: [1],
              tags: ['character', 'story-element'],
              quote: ''
            },
            inferred_fields: ['personality', 'visual_design', 'abilities', 'role'],
            missing_fields: ['age', 'title', 'quote'],
            source: `Extracted from: "${content.substring(0, 100)}..."`
          });
        });
      }
    }

    // Location extraction - look for place patterns
    if (templates.includes('location')) {
      // Look for capitalized location words or "in/at/to" patterns
      const locationWords = ['university', 'city', 'forest', 'castle', 'tower', 'district', 'street', 'building', 'temple', 'academy'];
      locationWords.forEach(locType => {
        if (contentLower.includes(locType)) {
          const locMatch = content.match(new RegExp(`([A-Z][a-z]+ )?${locType}`, 'i'));
          if (locMatch) {
            results.push({
              type: 'location',
              confidence: 'extracted',
              data: {
                id: `loc_${locMatch[0].toLowerCase().replace(/\s+/g, '_')}`,
                name: locMatch[0],
                type: locType.charAt(0).toUpperCase() + locType.slice(1),
                region: 'Unknown Region',
                description: `A significant ${locType} mentioned in the story`,
                history: 'Rich historical background',
                important_events: [],
                notable_residents: [],
                themes: ['mystery', 'significance'],
                visual_features: [`characteristic ${locType} architecture`],
                chapter_appearances: [1],
                connected_locations: []
              },
              inferred_fields: ['description', 'history', 'themes', 'visual_features'],
              missing_fields: ['region'],
              source: `Extracted from: "${content.substring(0, 100)}..."`
            });
          }
        }
      });
    }

    // Story extraction
    if (templates.includes('story')) {
      results.push({
        type: 'story',
        confidence: 'extracted',
        data: {
          title: 'Extracted Narrative',
          summary: 'A compelling story extracted from the provided content',
          themes: ['adventure', 'mystery', 'character development'],
          genre: 'Fiction',
          world_rules: {
            magic_system: 'Unknown',
            technology_level: 'Variable',
            governing_bodies: [],
            factions: []
          },
          core_conflict: 'Character faces challenges and obstacles',
          main_characters: [],
          timeline: ['Beginning', 'Development', 'Resolution'],
          chapter_order: [1],
          author_notes: 'Extracted narrative structure'
        },
        inferred_fields: ['title', 'summary', 'themes', 'world_rules', 'author_notes'],
        source: 'Overall narrative structure extracted from content'
      });
    }

    // Chapter extraction
    if (templates.includes('chapter')) {
      results.push({
        type: 'chapter',
        confidence: 'extracted',
        data: {
          id: 'ch_extracted_scene',
          title: 'Extracted Scene',
          chapter_number: 1,
          summary: 'Scene or chapter extracted from the content',
          events: ['Scene unfolds', 'Characters interact', 'Plot develops'],
          POV_character: 'Unknown',
          locations: [],
          characters_present: [],
          themes: ['narrative progression'],
          narrative_function: 'Story development',
          conflict: 'Internal or external challenges',
          tone: 'Contextual',
          word_count: content.length
        },
        inferred_fields: ['title', 'summary', 'events', 'narrative_function'],
        missing_fields: ['POV_character'],
        source: 'Chapter structure extracted from content'
      });
    }

    return results;
  };

  const handleApproveAll = () => {
    toast({
      title: "Items approved",
      description: `${extractedData.length} items approved and saved to respective categories`,
    });
  };

  const handleExportData = () => {
    const jsonData = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_story_data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Story data has been downloaded as JSON file"
    });
  };

  const handleReset = () => {
    setContent('');
    setExtractedData([]);
    setCurrentStep(1);
    toast({
      title: "Reset complete",
      description: "Extraction tool has been reset"
    });
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'character': '👤',
      'location': '📍',
      'story': '📚',
      'chapter': '📖'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const toggleTemplate = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      setSelectedTemplates(selectedTemplates.filter(t => t !== templateId));
    } else {
      setSelectedTemplates([...selectedTemplates, templateId]);
    }
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
            <span className="mono-font font-bold text-xl tracking-wide">AI Creative Assistant</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant={aiPromptsUsed >= dailyPromptLimit ? "destructive" : "secondary"} className="mono-font">
              {aiPromptsUsed}/{dailyPromptLimit} prompts used today
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('shiver_ai_messages');
                setMessages([]);
                toast({
                  title: "Chat cleared",
                  description: "Your conversation history has been reset."
                });
              }}
              className="mono-font"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-24 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Bot className="w-12 h-12 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
                AI Creative Assistant
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get creative guidance, extract story elements, and organize your universe. 
              Free Phase One includes 5 daily prompts for AI-assisted tasks.
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="mono-font">💬 Chat Assistant</TabsTrigger>
              <TabsTrigger value="extract" className="mono-font">🔍 Story Extraction</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              {/* Prompt Templates */}
              {messages.length === 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mono-font text-foreground mb-4">Quick Start Templates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {promptTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <Card key={template.id} className="cursor-pointer hover:bg-card/80 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-5 h-5 text-accent" />
                              <CardTitle className="text-sm mono-font">{template.title}</CardTitle>
                            </div>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Button 
                              variant="outline" 
                              size="sm" 
                                onClick={() => applyTemplate(template.template, template.id)}
                              disabled={aiPromptsUsed >= dailyPromptLimit}
                              className="w-full mono-font text-xs"
                            >
                              Use Template
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="bg-card/20 rounded-lg p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2 mono-font">Ready to assist your creativity</h3>
                    <p className="text-muted-foreground">
                      Ask for thematic insights, dialogue improvements, character development, or any creative guidance.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user' 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-card border'
                        }`}>
                          {message.type === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-accent" />
                              <span className="text-xs mono-font text-accent">AI Assistant</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-card border rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-accent animate-pulse" />
                            <span className="text-xs mono-font text-accent">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                {selectedPromptType && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="mono-font">
                      Using: {promptTemplates.find(t => t.id === selectedPromptType)?.title}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedPromptType(null)}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={aiPromptsUsed >= dailyPromptLimit 
                      ? "Daily prompt limit reached. Come back tomorrow!" 
                      : "Ask for creative guidance, thematic insights, dialogue help, or any story assistance..."
                    }
                    disabled={aiPromptsUsed >= dailyPromptLimit || isLoading}
                    className="mono-font resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && canSendMessage) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!canSendMessage}
                    className="mono-font self-end"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {aiPromptsUsed >= dailyPromptLimit && (
                  <div className="text-center">
                    <Badge variant="destructive" className="mono-font">
                      Daily limit reached - Upgrade to Phase 2 for unlimited AI assistance
                    </Badge>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Story Extraction Tab */}
            <TabsContent value="extract" className="space-y-6">
              {/* Process Indicator */}
              <div className="flex justify-center gap-5 mb-8">
                {[
                  { id: 1, icon: '📝', label: 'Input Content' },
                  { id: 2, icon: '🔍', label: 'Extract & Parse' },
                  { id: 3, icon: '📋', label: 'Review & Approve' },
                ].map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm transition-all duration-300 ${
                      currentStep === step.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card border'
                    }`}
                  >
                    <span className="text-base">{step.icon}</span>
                    <span className="mono-font">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Content Input Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font">
                      <FileText className="w-5 h-5 text-accent" />
                      Content Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste your story content here... (chapters, scenes, character descriptions, world lore, etc.)"
                      className="mono-font min-h-[200px] resize-none"
                      disabled={isExtracting}
                    />
                    
                    {/* Template Selection */}
                    <div className="space-y-3">
                      <h3 className="font-semibold mono-font text-sm">Extract Elements:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'character', label: '👤 Characters', description: 'People & beings' },
                          { id: 'location', label: '📍 Locations', description: 'Places & settings' },
                          { id: 'story', label: '📚 Story Info', description: 'Plot & themes' },
                          { id: 'chapter', label: '📖 Chapters', description: 'Scenes & events' },
                        ].map((template) => (
                          <Button
                            key={template.id}
                            variant={selectedTemplates.includes(template.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleTemplate(template.id)}
                            className="h-auto p-3 text-left justify-start"
                            disabled={isExtracting}
                          >
                            <div>
                              <div className="font-semibold text-xs">{template.label}</div>
                              <div className="text-xs opacity-70">{template.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleExtractContent}
                        disabled={!content.trim() || selectedTemplates.length === 0 || isExtracting || aiPromptsUsed >= dailyPromptLimit}
                        className="mono-font flex-1"
                      >
                        {isExtracting ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4 mr-2" />
                            Extract Content
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        disabled={isExtracting}
                        className="mono-font"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mono-font">
                      <Eye className="w-5 h-5 text-accent" />
                      Extracted Results ({extractedData.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extractedData.length === 0 ? (
                      <div className="text-center py-12">
                        <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mono-font">
                          Extracted elements will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-[300px] overflow-y-auto space-y-3">
                          {extractedData.map((item, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                                  <Badge variant="outline" className="mono-font text-xs">
                                    {item.type}
                                  </Badge>
                                  {item.confidence === 'inferred' && (
                                    <Badge variant="secondary" className="text-xs">
                                      AI Inferred
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <h4 className="font-semibold text-sm mono-font">
                                {item.data.name || item.data.title || 'Unnamed'}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.data.summary || item.data.description || item.data.background || 'No description'}
                              </p>
                              {item.missing_fields && item.missing_fields.length > 0 && (
                                <div className="mt-2">
                                  <Badge variant="destructive" className="text-xs">
                                    Missing: {item.missing_fields.join(', ')}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleApproveAll}
                            size="sm" 
                            className="mono-font flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve All
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleExportData}
                            size="sm" 
                            className="mono-font"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export JSON
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
