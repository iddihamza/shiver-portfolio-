import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

/** Props for PeekCarousel component */
export type PeekCarouselProps = {
  /** Carousel slides as React nodes (your tech‐cards) */
  children: React.ReactNode[];
  /** Tailwind breakpoint at which to switch back to grid behavior */
  mobileBreakpoint?: string; // e.g. "md"
  /** Percentage of slide width to show (e.g. 80 means 80% width + 20% peek) */
  slidePercent?: number;
};

/**
 * A carousel that shows a peek of the next slide on smaller breakpoints.
 */
export function PeekCarousel({
  children,
  mobileBreakpoint = "md",
  slidePercent = 80,
}: PeekCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start", // start align: first slide flush to left
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false,
  });

  // ensure resize updates peek
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onResize = () => emblaApi?.reInit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emblaApi]);

  return (
    <div
      // On mobile (< md) use embla; >= md just flex-wrap grid
      className={`block ${mobileBreakpoint}:hidden overflow-hidden`}
      ref={emblaRef}
    >
      <div className="flex gap-4">
        {children.map((child, i) => (
          <div
            // slide width 80% of container => 20% peek
            key={i}
            className="flex-shrink-0"
            style={{ flex: `0 0 ${slidePercent}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
