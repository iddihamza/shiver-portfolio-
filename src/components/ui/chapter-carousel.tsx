import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface Chapter {
  id: string;
  title: string;
  summary?: string;
  cover_image_url?: string;
}
interface ChapterCarouselProps {
  chapters: Chapter[];
  isAdmin?: boolean;
  className?: string;
}
const ChapterCarousel: React.FC<ChapterCarouselProps> = ({
  chapters,
  isAdmin = false,
  className
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    skipSnaps: false,
    containScroll: 'trimSnaps'
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Fallback for when Embla is not available
  const FallbackCarousel = () => <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 snap-x snap-mandatory py-[50px]">
        {chapters.map(chapter => <ChapterCard key={chapter.id} chapter={chapter} />)}
        {isAdmin && <AddChapterCard />}
      </div>
    </div>;
  if (!emblaApi && chapters.length > 0) {
    return <FallbackCarousel />;
  }
  return <div className={cn("relative", className)}>
      {/* Embla Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {chapters.map(chapter => <div key={chapter.id} className="flex-[0_0_100%] min-w-0 px-4 my-[10px] py-[40px]">
              <ChapterCard chapter={chapter} />
            </div>)}
          {isAdmin && <div className="flex-[0_0_100%] min-w-0 px-4">
              <AddChapterCard />
            </div>}
        </div>
      </div>

      {/* Navigation Buttons */}
      {chapters.length > 1 && <>
          <Button variant="outline" size="icon" className={cn("absolute left-2 top-1/2 -translate-y-1/2 z-10", "w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm", "border-border/50 hover:bg-accent/10", !canScrollPrev && "opacity-50 cursor-not-allowed")} onClick={scrollPrev} disabled={!canScrollPrev} aria-label="Previous chapter">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="icon" className={cn("absolute right-2 top-1/2 -translate-y-1/2 z-10", "w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm", "border-border/50 hover:bg-accent/10", !canScrollNext && "opacity-50 cursor-not-allowed")} onClick={scrollNext} disabled={!canScrollNext} aria-label="Next chapter">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>}

      {/* Pagination Dots */}
      {chapters.length > 1 && <div className="flex justify-center gap-2 mt-4">
          {chapters.map((_, index) => <button key={index} className={cn("w-2 h-2 rounded-full transition-all duration-200", "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", index === selectedIndex ? "bg-accent scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50")} onClick={() => scrollTo(index)} aria-label={`Go to chapter ${index + 1}`} />)}
        </div>}
    </div>;
};
const ChapterCard: React.FC<{
  chapter: Chapter;
}> = ({
  chapter
}) => {
  return <Link to={`/story/${chapter.id}`} className={cn("block w-full max-w-sm mx-auto aspect-[3/4] rounded-xl overflow-hidden", "bg-card border border-border shadow-lg", "transition-all duration-300 hover:scale-105 hover:shadow-xl", "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", "snap-center")}>
      <div className="relative w-full h-full">
        {chapter.cover_image_url ? <img src={chapter.cover_image_url} alt={chapter.title} loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-b from-muted/20 to-card flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-12 h-16 bg-foreground/20 rounded mx-auto mb-2" />
              <p className="text-xs mono-font">Cover Coming Soon</p>
            </div>
          </div>}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg md:text-xl font-bold mb-2 mono-font">
              {chapter.title}
            </h3>
            {chapter.summary && <p className="text-sm md:text-base text-white/90 line-clamp-2">
                {chapter.summary}
              </p>}
            <div className="text-xs md:text-sm mt-2 text-white/80 mono-font">
              Click to read
            </div>
          </div>
        </div>
      </div>
    </Link>;
};
const AddChapterCard: React.FC = () => {
  return <Link to="/portfolio/new-chapter" className={cn("block w-full max-w-sm mx-auto aspect-[3/4] rounded-xl", "border-2 border-dashed border-border", "flex flex-col items-center justify-center", "text-muted-foreground hover:text-foreground", "transition-all duration-300 hover:scale-105 hover:border-accent/50", "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", "snap-center")}>
      <Plus className="w-8 h-8 mb-3" />
      <span className="mono-font text-sm md:text-base">Add Chapter</span>
    </Link>;
};
export default ChapterCarousel;