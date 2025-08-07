import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, BookOpen, FileText, MapPin, Image, 
  TrendingUp, TrendingDown, Activity, Database
} from "lucide-react";
import { CharacterAPI, ChapterAPI, CaseAPI, LocationAPI, MultimediaAPI } from "@/data/db-utils";

export const AdminStats = () => {
  // Get current data counts
  const characterCount = CharacterAPI.getAll().length;
  const chapterCount = ChapterAPI.getAll().length;
  const caseCount = CaseAPI.getAll().length;
  const locationCount = LocationAPI.getAll().length;
  const mediaCount = MultimediaAPI.getAll().length;

  // Calculate total content items
  const totalContent = characterCount + chapterCount + caseCount + locationCount + mediaCount;

  // Mock some analytics data (in a real app, this would come from actual usage analytics)
  const mockAnalytics = {
    weeklyGrowth: 12,
    monthlyViews: 2847,
    popularContent: "Characters",
    lastUpdated: "2 hours ago"
  };

  const stats = [
    {
      title: "Characters",
      value: characterCount,
      icon: Users,
      change: "+3",
      changeType: "increase" as const,
      description: "Active character profiles"
    },
    {
      title: "Story Chapters", 
      value: chapterCount,
      icon: BookOpen,
      change: "+1",
      changeType: "increase" as const,
      description: "Published chapters"
    },
    {
      title: "Case Files",
      value: caseCount,
      icon: FileText,
      change: "0",
      changeType: "neutral" as const,
      description: "Documented cases"
    },
    {
      title: "Locations",
      value: locationCount,
      icon: MapPin,
      change: "+2",
      changeType: "increase" as const,
      description: "World locations"
    },
    {
      title: "Media Items",
      value: mediaCount,
      icon: Image,
      change: "+5",
      changeType: "increase" as const,
      description: "Images, videos, audio"
    },
    {
      title: "Total Content",
      value: totalContent,
      icon: Database,
      change: `+${mockAnalytics.weeklyGrowth}`,
      changeType: "increase" as const,
      description: "All content items"
    }
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="tech-card-glow bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {getChangeIcon(stat.changeType)}
                <span className={getChangeColor(stat.changeType)}>
                  {stat.change} this week
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="tech-card-glow bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Characters</span>
                <span>{characterCount} ({Math.round((characterCount / totalContent) * 100)}%)</span>
              </div>
              <Progress value={(characterCount / totalContent) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Chapters</span>
                <span>{chapterCount} ({Math.round((chapterCount / totalContent) * 100)}%)</span>
              </div>
              <Progress value={(chapterCount / totalContent) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cases</span>
                <span>{caseCount} ({Math.round((caseCount / totalContent) * 100)}%)</span>
              </div>
              <Progress value={(caseCount / totalContent) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Locations</span>
                <span>{locationCount} ({Math.round((locationCount / totalContent) * 100)}%)</span>
              </div>
              <Progress value={(locationCount / totalContent) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Media</span>
                <span>{mediaCount} ({Math.round((mediaCount / totalContent) * 100)}%)</span>
              </div>
              <Progress value={(mediaCount / totalContent) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    New
                  </Badge>
                  <span className="text-sm">Character added</span>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                    Edit
                  </Badge>
                  <span className="text-sm">Chapter updated</span>
                </div>
                <span className="text-xs text-muted-foreground">4h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                    Upload
                  </Badge>
                  <span className="text-sm">Media uploaded</span>
                </div>
                <span className="text-xs text-muted-foreground">6h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                    Import
                  </Badge>
                  <span className="text-sm">Bulk import completed</span>
                </div>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent">{mockAnalytics.monthlyViews}</div>
                  <div className="text-xs text-muted-foreground">Monthly Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{mockAnalytics.weeklyGrowth}%</div>
                  <div className="text-xs text-muted-foreground">Weekly Growth</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};