import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Users, 
  MapPin, 
  Clock,
  FileText,
  BookOpen,
  FolderOpen,
  Image,
  Home,
  Lightbulb
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Stories', href: '/portfolio/stories', icon: BookOpen },
  { title: 'Characters', href: '/characters', icon: Users },
  { title: 'Locations', href: '/locations', icon: MapPin },
  { title: 'Timeline', href: '/timeline', icon: Clock },
  { title: 'Cases', href: '/cases', icon: FolderOpen },
  { title: 'Multimedia', href: '/multimedia', icon: Image },
  { title: 'Brainstorm', href: '/portfolio/brainstorm', icon: Lightbulb },
  { title: 'Codex', href: '/codex', icon: FileText },
];

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Auto-scroll to active item on mount/route change
  useEffect(() => {
    const activeIndex = navItems.findIndex(item => isActive(item.href));
    if (activeIndex !== -1 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [location.pathname]);

  return (
    <div className="lg:hidden w-full">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-4 py-2 gap-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex-shrink-0 snap-center flex flex-col items-center justify-center",
                "min-w-[80px] h-16 px-3 py-2 rounded-lg transition-all duration-200",
                "text-xs mono-font border border-transparent",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                "hover:bg-accent/10 hover:border-accent/20 hover:scale-105",
                active 
                  ? "bg-accent/20 border-accent/30 text-accent shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              tabIndex={0}
              role="button"
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-transform duration-200",
                active ? "text-accent scale-110" : ""
              )} />
              <span className={cn(
                "text-[10px] text-center leading-tight whitespace-nowrap",
                "max-w-[70px] overflow-hidden text-ellipsis",
                active ? "font-medium" : ""
              )}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavBar;