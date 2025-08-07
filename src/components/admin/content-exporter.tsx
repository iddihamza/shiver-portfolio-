import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, FileJson, FileText, Package, Database, 
  CheckCircle, FileType, Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CharacterAPI, ChapterAPI, CaseAPI, LocationAPI, MultimediaAPI } from "@/data/db-utils";

export const ContentExporter = () => {
  const { toast } = useToast();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['characters']);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportScope, setExportScope] = useState('all');
  const [includeRelations, setIncludeRelations] = useState(true);
  const [exporting, setExporting] = useState(false);

  const contentTypes = [
    { id: 'characters', label: 'Characters', count: CharacterAPI.getAll().length, icon: '👤' },
    { id: 'chapters', label: 'Chapters', count: ChapterAPI.getAll().length, icon: '📖' },
    { id: 'cases', label: 'Cases', count: CaseAPI.getAll().length, icon: '🗂️' },
    { id: 'locations', label: 'Locations', count: LocationAPI.getAll().length, icon: '📍' },
    { id: 'multimedia', label: 'Multimedia', count: MultimediaAPI.getAll().length, icon: '🎬' }
  ];

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const collectExportData = () => {
    const data: any = {};

    if (selectedTypes.includes('characters')) {
      data.characters = CharacterAPI.getAll();
    }
    if (selectedTypes.includes('chapters')) {
      data.chapters = ChapterAPI.getAll();
    }
    if (selectedTypes.includes('cases')) {
      data.cases = CaseAPI.getAll();
    }
    if (selectedTypes.includes('locations')) {
      data.locations = LocationAPI.getAll();
    }
    if (selectedTypes.includes('multimedia')) {
      data.multimedia = MultimediaAPI.getAll();
    }

    // Add metadata
    data._metadata = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      format: exportFormat,
      scope: exportScope,
      includeRelations,
      totalItems: Object.values(data).reduce((acc: number, arr: any) => 
        Array.isArray(arr) ? acc + arr.length : acc, 0
      )
    };

    return data;
  };

  const exportData = async () => {
    setExporting(true);
    
    try {
      const data = collectExportData();
      
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          filename = `shiver-export-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          // Convert to CSV format (simplified)
          content = convertToCSV(data);
          filename = `shiver-export-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'markdown':
          content = convertToMarkdown(data);
          filename = `shiver-export-${Date.now()}.md`;
          mimeType = 'text/markdown';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Downloaded ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
    
    setExporting(false);
  };

  const convertToCSV = (data: any): string => {
    // Simplified CSV conversion - in a real app you'd want more sophisticated handling
    let csv = '';
    
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        csv += `\n--- ${key.toUpperCase()} ---\n`;
        if (data[key].length > 0) {
          const headers = Object.keys(data[key][0]).join(',');
          csv += headers + '\n';
          data[key].forEach((item: any) => {
            const values = Object.values(item).map(v => 
              typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
            ).join(',');
            csv += values + '\n';
          });
        }
      }
    });
    
    return csv;
  };

  const convertToMarkdown = (data: any): string => {
    let md = '# Shiver Content Export\n\n';
    md += `Exported on: ${new Date().toISOString()}\n\n`;
    
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        md += `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n\n`;
        data[key].forEach((item: any) => {
          md += `### ${item.title || item.name || 'Unnamed'}\n\n`;
          if (item.description) {
            md += `${item.description}\n\n`;
          }
          md += '---\n\n';
        });
      }
    });
    
    return md;
  };

  const exportBackup = async () => {
    setExporting(true);
    
    // Create full backup
    const fullData = {
      characters: CharacterAPI.getAll(),
      chapters: ChapterAPI.getAll(),
      cases: CaseAPI.getAll(),
      locations: LocationAPI.getAll(),
      multimedia: MultimediaAPI.getAll(),
      _backup: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        type: 'full_backup'
      }
    };
    
    const content = JSON.stringify(fullData, null, 2);
    const filename = `shiver-backup-${Date.now()}.json`;
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup Complete",
      description: `Full backup saved as ${filename}`,
    });
    
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card className="tech-card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Types */}
          <div>
            <h3 className="font-semibold mb-3">Select Content Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {contentTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2 p-3 border rounded">
                  <Checkbox
                    id={type.id}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => handleTypeToggle(type.id)}
                  />
                  <label
                    htmlFor={type.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <span>{type.icon} {type.label}</span>
                      <Badge variant="secondary" className="ml-2">{type.count}</Badge>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Export Scope</label>
              <Select value={exportScope} onValueChange={setExportScope}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="recent">Recent Only</SelectItem>
                  <SelectItem value="published">Published Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-relations"
                    checked={includeRelations}
                    onCheckedChange={(checked) => setIncludeRelations(checked === true)}
                />
                <label
                  htmlFor="include-relations"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Relations
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="tech-card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Custom Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export selected content types in your chosen format
            </p>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Selected:</strong> {selectedTypes.length} type(s)
              </div>
              <div className="text-sm">
                <strong>Format:</strong> {exportFormat.toUpperCase()}
              </div>
              <div className="text-sm">
                <strong>Scope:</strong> {exportScope}
              </div>
            </div>
            <Button 
              onClick={exportData} 
              disabled={selectedTypes.length === 0 || exporting}
              className="w-full"
            >
              {exporting ? (
                <>Processing...</>
              ) : (
                <>
                  <FileJson className="w-4 h-4 mr-2" />
                  Export Selected
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="tech-card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Full Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a complete backup of all content and data
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                All content types
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                All relationships
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Metadata included
              </div>
            </div>
            <Button 
              onClick={exportBackup} 
              disabled={exporting}
              variant="outline"
              className="w-full"
            >
              {exporting ? (
                <>Creating Backup...</>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Create Full Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Templates */}
      <Card className="tech-card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileType className="w-5 h-5" />
            Quick Export Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              Story Bible Export
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Database className="w-6 h-6 mb-2" />
              Character Database
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Archive className="w-6 h-6 mb-2" />
              World Guide Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};