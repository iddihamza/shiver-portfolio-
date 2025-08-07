import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Eye, AlertTriangle, Plus } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";


const Locations = () => {
  const { data: locations = [], isLoading, error } = useLocations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sacred Ground": return "text-yellow-400";
      case "Quarantined": return "text-red-400";
      case "Under Investigation": return "text-orange-400";
      case "Monitored": return "text-blue-400";
      case "Active Research Site": return "text-green-400";
      case "Public with Restrictions": return "text-purple-400";
      default: return "text-muted-foreground";
    }
  };

  const getAccessibilityColor = (accessibility: string) => {
    if (accessibility.includes("Forbidden") || accessibility.includes("Restricted")) return "text-red-400";
    if (accessibility.includes("Public")) return "text-green-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin className="w-12 h-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
              Locations
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            From the Veil-touched alleyways to Yakoshima Temple—pinpoint the world of Shiver. Each location holds secrets and dangers that only the initiated understand.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/portfolio/locations/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Location
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading locations...</div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">Failed to load locations.</div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {locations.map((location) => (
              <Card key={location.id} className="bg-card hover:bg-card/80 transition-colors border-2 hover:border-accent/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      <span className="text-sm mono-font text-muted-foreground">{location.location_type || 'Unknown'}</span>
                    </div>
                    <span className={`text-sm mono-font ${getStatusColor('Active')}`}>
                      Active
                    </span>
                  </div>
                  <CardTitle className="text-xl mono-font text-foreground">
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Location Image */}
                  <div className="w-full h-48 bg-gradient-to-b from-muted/20 to-card rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-accent/10 to-accent/5">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-foreground/20 rounded-full mx-auto mb-2" />
                        <p className="text-accent mono-font text-xs">Visual Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {location.summary || 'No description available.'}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-foreground mono-font">Significance: </span>
                      <span className="text-sm text-muted-foreground">{location.story_importance || 'Unknown'}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 mono-font">Location Type:</h4>
                      <span className="text-sm text-muted-foreground">{location.location_type || 'Unknown'}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-border flex items-center gap-2">
                      <Eye className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-foreground mono-font">Status: </span>
                      <span className={`text-sm ${getAccessibilityColor('accessible')}`}>
                        Active
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-8 bg-card/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 mono-font text-foreground">
            Explore Rookwick
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Each location in Rookwick holds secrets waiting to be uncovered. Navigate carefully—some doors once opened can never be closed.
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

export default Locations;