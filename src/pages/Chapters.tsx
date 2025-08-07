import { Link } from "react-router-dom";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import FadeIn from "@/components/animations/FadeIn";
import { useChapters, useDeleteChapter } from "@/hooks/useChapters";
import { useState } from "react";
import { PeekCarousel } from "@/components/PeekCarousel";
import { useIsMobile } from "@/hooks/use-mobile";

const Chapters = () => {
  const { data: chapters = [], isLoading, error } = useChapters();
  const { mutate: deleteChapter, isPending } = useDeleteChapter();
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 9; // 3x3 grid
  const isMobile = useIsMobile();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      deleteChapter(id);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);
  const startIndex = (currentPage - 1) * chaptersPerPage;
  const endIndex = startIndex + chaptersPerPage;
  const paginatedChapters = chapters.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/" className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors">
            Shiver
          </Link>
          <nav>
            <ul className="flex gap-6 mono-font">
              <li><Link to="/portfolio" className="text-accent hover:underline">Portfolio</Link></li>
              <li><Link to="/characters" className="text-accent hover:underline">Characters</Link></li>
              <li><Link to="/chapters" className="text-accent hover:underline font-bold">Chapters</Link></li>
              <li><Link to="/timeline" className="text-accent hover:underline">Timeline</Link></li>
              <li><Link to="/locations" className="text-accent hover:underline">Locations</Link></li>
              <li><Link to="/cases" className="text-accent hover:underline">Cases</Link></li>
              <li><Link to="/multimedia" className="text-accent hover:underline">Multimedia</Link></li>
              <li><Link to="/admin" className="text-accent hover:underline">Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-12 h-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold mono-font text-foreground">
              Chapters
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore every chapter of the Shiver story. Select a chapter to read or edit its details.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/portfolio/chapters/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Chapter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              <p className="text-muted-foreground mt-4">Loading chapters...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error loading chapters. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>
              {isMobile ? (
                chapters.length > 0 ? (
                  <PeekCarousel slidePercent={85}>
                    {paginatedChapters.map((chapter, index) => (
                      <FadeIn key={chapter.id} delay={index * 0.1}>
                        <Card className="tech-card-glow bg-card hover:bg-card/80 transition-colors border-2 overflow-hidden">
                          {chapter.cover_image_url && (
                            <img
                              src={chapter.cover_image_url}
                              alt={chapter.title}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          )}
                          <CardHeader>
                            <CardTitle className="mono-font text-foreground">
                              Chapter {chapter.chapter_number}: {chapter.title}
                            </CardTitle>
                            {chapter.summary && (
                              <CardDescription>{chapter.summary}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="flex gap-2 pt-4">
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/story/${chapter.id}`}>View</Link>
                            </Button>
                            <Button asChild size="sm">
                              <Link to={`/portfolio/chapter/${chapter.id}/edit`}>Edit</Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isPending}
                              onClick={() => handleDelete(chapter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                  </PeekCarousel>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Chapters Yet</h3>
                    <p className="text-muted-foreground mb-6">Start by creating your first chapter.</p>
                    <Button asChild>
                      <Link to="/portfolio/chapters/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Chapter
                      </Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {chapters.length > 0 ? (
                    paginatedChapters.map((chapter, index) => (
                      <FadeIn key={chapter.id} delay={index * 0.1}>
                        <Card className="tech-card-glow bg-card hover:bg-card/80 transition-colors border-2 overflow-hidden">
                          {chapter.cover_image_url && (
                            <img
                              src={chapter.cover_image_url}
                              alt={chapter.title}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          )}
                          <CardHeader>
                            <CardTitle className="mono-font text-foreground">
                              Chapter {chapter.chapter_number}: {chapter.title}
                            </CardTitle>
                            {chapter.summary && (
                              <CardDescription>{chapter.summary}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="flex gap-2 pt-4">
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/story/${chapter.id}`}>View</Link>
                            </Button>
                            <Button asChild size="sm">
                              <Link to={`/portfolio/chapter/${chapter.id}/edit`}>Edit</Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isPending}
                              onClick={() => handleDelete(chapter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No Chapters Yet</h3>
                      <p className="text-muted-foreground mb-6">Start by creating your first chapter.</p>
                      <Button asChild>
                        <Link to="/portfolio/chapters/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Chapter
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pagination Controls */}
              {chapters.length > chaptersPerPage && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Chapters;