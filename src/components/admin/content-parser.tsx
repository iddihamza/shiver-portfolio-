import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Brain, CheckCircle, AlertCircle, Eye, 
  Loader2, FileText, Tag, User, MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedContent {
  id: string;
  fileName: string;
  contextLabel: string;
  rawContent: string;
  parsedData: any;
  mappedTemplate: any;
  confidence: number;
  suggestions: string[];
  status: 'uploaded' | 'parsed' | 'mapped' | 'reviewed' | 'saved';
}

interface ContentParserProps {
  content: ExtractedContent[];
  onContentUpdate: (content: ExtractedContent[]) => void;
  onComplete: () => void;
}

export const ContentParser = ({ content, onContentUpdate, onComplete }: ContentParserProps) => {
  const { toast } = useToast();
  const [parsingProgress, setParsingProgress] = useState(0);
  const [currentlyParsing, setCurrentlyParsing] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Basic NLP parsing functions
  const extractEntities = (text: string, contextLabel: string) => {
    const entities = {
      characters: [] as string[],
      locations: [] as string[],
      keywords: [] as string[],
      emotions: [] as string[],
      actions: [] as string[]
    };

    // Simple pattern matching for different content types
    switch (contextLabel) {
      case 'character-description':
      case 'character-backstory':
        entities.characters = extractCharacterNames(text);
        entities.keywords = extractCharacterTraits(text);
        entities.emotions = extractEmotions(text);
        break;
      
      case 'location-description':
      case 'scene-setting':
        entities.locations = extractLocationNames(text);
        entities.keywords = extractLocationFeatures(text);
        break;
      
      case 'dialogue-scene':
        entities.characters = extractSpeakers(text);
        entities.emotions = extractEmotions(text);
        entities.actions = extractActions(text);
        break;
      
      case 'plot-summary':
      case 'conflict-description':
        entities.characters = extractCharacterNames(text);
        entities.locations = extractLocationNames(text);
        entities.actions = extractPlotPoints(text);
        break;
      
      default:
        entities.keywords = extractGeneralKeywords(text);
    }

    return entities;
  };

  const extractCharacterNames = (text: string): string[] => {
    // Look for proper nouns that might be names
    const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    const matches = text.match(namePattern) || [];
    
    // Filter out common words that aren't names
    const commonWords = ['The', 'This', 'That', 'Then', 'When', 'Where', 'What', 'Who', 'How', 'Why'];
    return [...new Set(matches.filter(name => !commonWords.includes(name)))];
  };

  const extractLocationNames = (text: string): string[] => {
    const locationKeywords = ['city', 'town', 'village', 'street', 'avenue', 'road', 'building', 'house', 'room', 'forest', 'mountain', 'river', 'ocean', 'beach', 'park', 'school', 'hospital', 'store', 'restaurant', 'cafe'];
    const locations = [];
    
    // Look for location indicators
    const words = text.toLowerCase().split(/\W+/);
    for (let i = 0; i < words.length; i++) {
      if (locationKeywords.includes(words[i])) {
        // Look for proper nouns before the location keyword
        const prevWords = text.split(/\W+/).slice(Math.max(0, i-2), i);
        const properNouns = prevWords.filter(word => /^[A-Z][a-z]+$/.test(word));
        if (properNouns.length > 0) {
          locations.push(`${properNouns.join(' ')} ${words[i]}`);
        }
      }
    }
    
    return [...new Set(locations)];
  };

  const extractCharacterTraits = (text: string): string[] => {
    const traitWords = [
      'brave', 'cowardly', 'kind', 'cruel', 'intelligent', 'foolish', 'strong', 'weak',
      'tall', 'short', 'young', 'old', 'beautiful', 'ugly', 'confident', 'shy',
      'honest', 'deceitful', 'loyal', 'treacherous', 'calm', 'angry', 'happy', 'sad'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    return traitWords.filter(trait => words.includes(trait));
  };

  const extractLocationFeatures = (text: string): string[] => {
    const features = [
      'dark', 'bright', 'large', 'small', 'crowded', 'empty', 'noisy', 'quiet',
      'modern', 'ancient', 'clean', 'dirty', 'safe', 'dangerous', 'hidden', 'obvious'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    return features.filter(feature => words.includes(feature));
  };

  const extractSpeakers = (text: string): string[] => {
    // Look for dialogue patterns like "Name said" or "Name:"
    const speakerPattern = /([A-Z][a-z]+)(?:\s+said|\s*:)/g;
    const matches = text.match(speakerPattern) || [];
    return [...new Set(matches.map(match => match.replace(/\s+said|\s*:/, '')))];
  };

  const extractEmotions = (text: string): string[] => {
    const emotions = [
      'happy', 'sad', 'angry', 'scared', 'excited', 'nervous', 'calm', 'worried',
      'confused', 'surprised', 'disappointed', 'proud', 'embarrassed', 'guilty'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    return emotions.filter(emotion => words.includes(emotion));
  };

  const extractActions = (text: string): string[] => {
    const actionWords = [
      'run', 'walk', 'jump', 'climb', 'fall', 'sit', 'stand', 'lie', 'fight', 'dance',
      'sing', 'cry', 'laugh', 'whisper', 'shout', 'look', 'search', 'find', 'lose'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    return actionWords.filter(action => words.includes(action));
  };

  const extractPlotPoints = (text: string): string[] => {
    const plotKeywords = [
      'conflict', 'resolution', 'mystery', 'secret', 'discovery', 'betrayal',
      'alliance', 'enemy', 'friend', 'quest', 'journey', 'battle', 'victory', 'defeat'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    return plotKeywords.filter(keyword => words.includes(keyword));
  };

  const extractGeneralKeywords = (text: string): string[] => {
    // Extract the most frequent meaningful words
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    const meaningfulWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    // Count frequency and return top words
    const frequency: Record<string, number> = {};
    meaningfulWords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  };

  const calculateConfidence = (parsedData: any, contextLabel: string): number => {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on extracted entities
    if (parsedData.characters?.length > 0) confidence += 0.2;
    if (parsedData.locations?.length > 0) confidence += 0.1;
    if (parsedData.keywords?.length > 0) confidence += 0.1;
    if (parsedData.emotions?.length > 0) confidence += 0.1;
    
    // Context-specific confidence adjustments
    switch (contextLabel) {
      case 'character-description':
        if (parsedData.characters?.length > 0 && parsedData.keywords?.length > 0) {
          confidence += 0.2;
        }
        break;
      case 'location-description':
        if (parsedData.locations?.length > 0) {
          confidence += 0.2;
        }
        break;
      case 'dialogue-scene':
        if (parsedData.characters?.length > 1) {
          confidence += 0.2;
        }
        break;
    }
    
    return Math.min(confidence, 1.0);
  };

  const generateSuggestions = (parsedData: any, contextLabel: string): string[] => {
    const suggestions = [];
    
    // Context-specific suggestions
    switch (contextLabel) {
      case 'character-description':
        if (parsedData.characters?.length === 0) {
          suggestions.push("No character names detected. Consider adding character names to improve extraction.");
        }
        if (parsedData.keywords?.length < 3) {
          suggestions.push("Few character traits detected. Consider adding more descriptive words.");
        }
        break;
      
      case 'location-description':
        if (parsedData.locations?.length === 0) {
          suggestions.push("No specific locations detected. Consider adding location names or references.");
        }
        break;
      
      case 'dialogue-scene':
        if (parsedData.characters?.length < 2) {
          suggestions.push("Dialogue scenes typically involve multiple characters. Consider reviewing the content.");
        }
        break;
    }
    
    // General suggestions
    if (parsedData.keywords?.length === 0) {
      suggestions.push("No significant keywords detected. The content might be too short or lack descriptive elements.");
    }
    
    return suggestions;
  };

  const parseContent = async (contentItem: ExtractedContent): Promise<ExtractedContent> => {
    setCurrentlyParsing(contentItem.id);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const entities = extractEntities(contentItem.rawContent, contentItem.contextLabel);
    
    const parsedData = {
      entities,
      wordCount: contentItem.rawContent.split(/\s+/).length,
      readingTime: Math.ceil(contentItem.rawContent.split(/\s+/).length / 200),
      contentType: contentItem.contextLabel,
      extractedAt: new Date().toISOString()
    };
    
    const confidence = calculateConfidence(parsedData, contentItem.contextLabel);
    const suggestions = generateSuggestions(parsedData, contentItem.contextLabel);
    
    return {
      ...contentItem,
      parsedData,
      confidence,
      suggestions,
      status: 'parsed'
    };
  };

  const parseAllContent = async () => {
    setIsProcessing(true);
    const unparsedContent = content.filter(item => item.status === 'uploaded');
    
    if (unparsedContent.length === 0) {
      toast({
        title: "No content to parse",
        description: "All uploaded content has already been parsed.",
      });
      setIsProcessing(false);
      return;
    }
    
    const updatedContent = [...content];
    
    for (let i = 0; i < unparsedContent.length; i++) {
      const item = unparsedContent[i];
      const parsedItem = await parseContent(item);
      
      // Update the content array
      const index = updatedContent.findIndex(c => c.id === item.id);
      if (index !== -1) {
        updatedContent[index] = parsedItem;
        onContentUpdate([...updatedContent]);
      }
      
      // Update progress
      setParsingProgress(((i + 1) / unparsedContent.length) * 100);
    }
    
    setCurrentlyParsing(null);
    setIsProcessing(false);
    
    toast({
      title: "Parsing complete",
      description: `Successfully parsed ${unparsedContent.length} content items.`,
    });
  };

  const parsedContent = content.filter(item => item.status === 'parsed');
  const unparsedContent = content.filter(item => item.status === 'uploaded');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Content Parsing & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unparsedContent.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {unparsedContent.length} content items ready for parsing
                </p>
                <Button onClick={parseAllContent} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Parse All Content
                    </>
                  )}
                </Button>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={parsingProgress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {Math.round(parsingProgress)}% complete
                  </p>
                </div>
              )}
            </div>
          )}

          {parsedContent.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Parsed Content</h3>
                <Button onClick={onComplete} variant="default">
                  Continue to Template Mapping
                </Button>
              </div>
              
              <div className="grid gap-4">
                {parsedContent.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{item.fileName}</span>
                          <Badge variant="secondary">{item.contextLabel}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Confidence: {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Characters ({item.parsedData?.entities?.characters?.length || 0})
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.parsedData?.entities?.characters?.slice(0, 3)?.map((char: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                            {(item.parsedData?.entities?.characters?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(item.parsedData?.entities?.characters?.length || 0) - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Locations ({item.parsedData?.entities?.locations?.length || 0})
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.parsedData?.entities?.locations?.slice(0, 3)?.map((loc: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {loc}
                              </Badge>
                            ))}
                            {(item.parsedData?.entities?.locations?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(item.parsedData?.entities?.locations?.length || 0) - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Keywords ({item.parsedData?.entities?.keywords?.length || 0})
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.parsedData?.entities?.keywords?.slice(0, 3)?.map((keyword: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {(item.parsedData?.entities?.keywords?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(item.parsedData?.entities?.keywords?.length || 0) - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {item.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-orange-600">Suggestions:</Label>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {item.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 mt-0.5 text-orange-500 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};