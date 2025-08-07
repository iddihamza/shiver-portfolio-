import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Image, Headphones, FileVideo, Palette } from "lucide-react";


// Multimedia data
const multimedia: any[] = [];

const Multimedia = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Visual Art": return Image;
      case "Audio": return Headphones;
      case "Video": return FileVideo;
      default: return Palette;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "text-green-400";
      case "Coming Soon": return "text-yellow-400";
      case "In Production": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Palette className="w-12 h-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
              Multimedia
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Concept art, audio logs, and motion pieces that breathe life into the lore. Experience Shiver through multiple senses and dimensions.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {["All", "Concept Art", "Environment Art", "Atmosphere", "Narrative", "Animation", "Reference"].map((category) => (
              <Button 
                key={category} 
                variant={category === "All" ? "default" : "outline"} 
                className="mono-font"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Multimedia Grid */}
      <section className="py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {multimedia.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={item.id} className="bg-card hover:bg-card/80 transition-colors border-2 hover:border-accent/50 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-5 h-5 text-accent" />
                        <span className="text-sm mono-font text-muted-foreground">{item.type}</span>
                      </div>
                      <span className={`text-sm mono-font ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <CardTitle className="text-xl mono-font text-foreground">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-accent mono-font">
                      {item.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Thumbnail */}
                    <div className="w-full h-48 bg-gradient-to-b from-muted/20 to-card rounded-lg mb-4 overflow-hidden relative group-hover:scale-105 transition-transform">
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <TypeIcon className="w-16 h-16 text-accent/50 mx-auto mb-2" />
                            <p className="text-accent mono-font text-sm">Content Preview</p>
                            <p className="text-accent mono-font text-sm">{item.status}</p>
                          </div>
                        </div>
                      )}
                      {item.status === "Available" && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm mono-font text-foreground">
                        {item.items} items
                      </span>
                      {item.status === "Available" && (
                        <Button size="sm" variant="outline" className="mono-font">
                          View Collection
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 px-8 bg-card/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 mono-font text-foreground">
            Featured Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-accent mono-font">Latest Addition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-32 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
                  <Image className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-foreground font-medium mono-font mb-2">Alexander's Investigation Notes</h3>
                <p className="text-muted-foreground text-sm">Hand-drawn sketches and case notes from the detective's personal journal.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-accent mono-font">Coming Next</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-lg mb-4 flex items-center justify-center">
                  <Headphones className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-foreground font-medium mono-font mb-2">Rookwick Night Ambience</h3>
                <p className="text-muted-foreground text-sm">A 30-minute audio journey through the city's most atmospheric locations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 mono-font text-foreground">
            Experience Shiver
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dive deeper into the world through art, sound, and motion. Each piece adds another layer to the mystery.
          </p>
          <Link to="/">
            <Button size="lg" className="mono-font font-bold">
              Return to Shiver World
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Multimedia;