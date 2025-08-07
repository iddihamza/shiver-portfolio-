import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Filter, Edit, Trash2, Plus, Eye, Users, 
  BookOpen, MapPin, FileText, Image, MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CharacterAPI, ChapterAPI, CaseAPI, LocationAPI, MultimediaAPI } from "@/data/db-utils";
import { useToast } from "@/hooks/use-toast";

export const ContentManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("characters");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  // Get all data
  const characters = CharacterAPI.getAll();
  const chapters = ChapterAPI.getAll();
  const cases = CaseAPI.getAll();
  const locations = LocationAPI.getAll();
  const multimedia = MultimediaAPI.getAll();

  // Filter and sort function
  const filterAndSort = (items: any[], searchFields: string[]) => {
    let filtered = items;

    // Apply search filter
    if (searchQuery) {
      filtered = items.filter(item =>
        searchFields.some(field =>
          item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || "";
      const bVal = b[sortBy] || "";
      return aVal.localeCompare(bVal);
    });

    return filtered;
  };

  const filteredCharacters = useMemo(
    () => filterAndSort(characters, ["name", "title", "description"]),
    [characters, searchQuery, filterStatus, sortBy]
  );

  const filteredChapters = useMemo(
    () => filterAndSort(chapters, ["name", "title", "description"]),
    [chapters, searchQuery, filterStatus, sortBy]
  );

  const filteredCases = useMemo(
    () => filterAndSort(cases, ["title", "description", "classification"]),
    [cases, searchQuery, filterStatus, sortBy]
  );

  const filteredLocations = useMemo(
    () => filterAndSort(locations, ["name", "title", "district", "description"]),
    [locations, searchQuery, filterStatus, sortBy]
  );

  const filteredMultimedia = useMemo(
    () => filterAndSort(multimedia, ["title", "description", "category"]),
    [multimedia, searchQuery, filterStatus, sortBy]
  );

  const handleEdit = (type: string, id: number) => {
    toast({
      title: "Edit Content",
      description: `Opening editor for ${type} ID: ${id}`,
    });
    // In a real app, this would open an edit modal or navigate to edit page
  };

  const handleDelete = (type: string, id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      switch (type) {
        case 'character':
          // CharacterAPI would need a delete method
          break;
        case 'chapter':
          // ChapterAPI would need a delete method
          break;
        // ... other cases
      }
      toast({
        title: "Item Deleted",
        description: `Deleted ${type} ID: ${id}`,
      });
    }
  };

  const handleView = (type: string, route: string) => {
    // Navigate to the item's page
    window.open(`/${type}/${route}`, '_blank');
  };

  const ContentTable = ({ items, type, icon: Icon }: { items: any[], type: string, icon: any }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <h3 className="text-lg font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <Badge variant="secondary">{items.length} items</Badge>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="border rounded-lg">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
          <div className="col-span-3">Title</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Tags</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-muted/20">
              {/* Mobile Layout */}
              <div className="md:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.title || item.name}</h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(type, item.route)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(type, item.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(type, item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description?.substring(0, 100)}...
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:contents">
                <div className="col-span-3">
                  <div className="font-medium">{item.title || item.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                  {item.description?.substring(0, 120)}...
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge variant="secondary">{item.status || "Active"}</Badge>
                </div>
                <div className="col-span-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(type, item.route)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(type, item.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(type, item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="tech-card-glow">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="updated">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="multimedia">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="characters">
          <ContentTable items={filteredCharacters} type="character" icon={Users} />
        </TabsContent>

        <TabsContent value="chapters">
          <ContentTable items={filteredChapters} type="chapter" icon={BookOpen} />
        </TabsContent>

        <TabsContent value="cases">
          <ContentTable items={filteredCases} type="case" icon={FileText} />
        </TabsContent>

        <TabsContent value="locations">
          <ContentTable items={filteredLocations} type="location" icon={MapPin} />
        </TabsContent>

        <TabsContent value="multimedia">
          <ContentTable items={filteredMultimedia} type="media" icon={Image} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
