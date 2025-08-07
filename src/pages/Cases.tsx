import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Clock, AlertTriangle } from "lucide-react";
import { useCases } from "@/hooks/useCases";


const Cases = () => {
  const { data: cases = [], isLoading, error } = useCases();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed": return "text-green-400";
      case "Ongoing": return "text-yellow-400";
      case "Cold": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Paranormal": return "text-purple-400";
      case "Supernatural": return "text-red-400";
      case "Dimensional": return "text-cyan-400";
      case "Classified": return "text-orange-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="w-12 h-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
              Case Files
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Unsolved incidents, encrypted witness logs, and classified Agency notes. Each case represents a tear in the fabric of reality—carefully documented and filed away from public view.
          </p>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading cases...</div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">Failed to load cases.</div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cases.map((caseFile) => (
              <Card key={caseFile.id} className="bg-card hover:bg-card/80 transition-colors border-2 hover:border-accent/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-accent" />
                      <span className="text-sm mono-font text-muted-foreground">Case #{caseFile.id.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm mono-font text-muted-foreground">{caseFile.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mono-font text-foreground">
                    {caseFile.title}
                  </CardTitle>
                  <div className="flex gap-4 text-sm">
                    <span className="mono-font">
                      Status: <span className={getStatusColor(caseFile.status)}>{caseFile.status}</span>
                    </span>
                    <span className="mono-font">
                      Classification: <span className={getClassificationColor(caseFile.classification)}>{caseFile.classification}</span>
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {caseFile.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 mono-font">Evidence:</h4>
                      <ul className="space-y-1">
                        {caseFile.evidence.map((evidence, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <span className="text-sm font-medium text-foreground mono-font">Outcome: </span>
                      <span className="text-sm text-muted-foreground">{caseFile.outcome}</span>
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
            More Cases Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            The Agency's files run deep. As new incidents surface and old cases are declassified, this archive will continue to grow.
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

export default Cases;