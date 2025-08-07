import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Clock,
  FileText,
  Image,
  Lightbulb,
  FolderOpen,
  Home,
  Menu,
  X,
  User,
  Settings,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const UnifiedNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { hasRole, user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAdmin = hasRole("admin");
  const isLoggedIn = !!user;

  const isActive = (path: string) => location.pathname === path;

  // Navigation structure for desktop dropdowns
  const navigationSections = [
    {
      title: 'Explore',
      items: [
        {
          title: 'Chapters',
          href: '/chapters',
          description: 'Read the story chapters',
          icon: BookOpen
        },
        {
          title: 'Characters',
          href: '/characters',
          description: 'Discover the cast of Shiver',
          icon: Users
        },
        {
          title: 'Locations', 
          href: '/locations',
          description: 'Explore the world and settings',
          icon: MapPin
        },
        {
          title: 'Timeline',
          href: '/timeline',
          description: 'Visual story progression',
          icon: Clock
        },
        {
          title: 'Cases',
          href: '/cases',
          description: 'Investigation files',
          icon: FolderOpen
        },
        {
          title: 'Multimedia',
          href: '/multimedia',
          description: 'Trailers and media',
          icon: Image
        }
      ]
    },
    {
      title: 'Create',
      items: [
        {
          title: 'Dashboard',
          href: '/portfolio/dashboard',
          description: 'Creator overview and stats',
          icon: Home
        },
        {
          title: 'Stories',
          href: '/portfolio/stories',
          description: 'Manage your stories',
          icon: BookOpen
        },
        {
          title: 'Brainstorm',
          href: '/portfolio/brainstorm',
          description: 'Ideas and inspiration vault',
          icon: Lightbulb
        },
        {
          title: 'Visual References',
          href: '/portfolio/visual-references',
          description: 'Concept art and mood boards',
          icon: Image
        }
      ]
    }
  ];

  // Flat navigation items for mobile
  const mobileNavItems = [
    { title: 'Home', href: '/', icon: Home },
    { title: 'Stories', href: '/portfolio/stories', icon: BookOpen },
    { title: 'Chapters', href: '/chapters', icon: FileText },
    { title: 'Characters', href: '/characters', icon: Users },
    { title: 'Locations', href: '/locations', icon: MapPin },
    { title: 'Timeline', href: '/timeline', icon: Clock },
    { title: 'Cases', href: '/cases', icon: FolderOpen },
    { title: 'Dashboard', href: '/portfolio/dashboard', icon: Home },
    { title: 'Brainstorm', href: '/portfolio/brainstorm', icon: Lightbulb },
    ...(isAdmin ? [{ title: 'Admin', href: '/admin', icon: Settings }] : [])
  ];

  // Quick access buttons for desktop
  const quickLinks = [
    { title: 'Timeline', href: '/timeline', icon: Clock },
    { title: 'Stories', href: '/portfolio/stories', icon: BookOpen },
    ...(isAdmin ? [{ title: 'Admin', href: '/admin', icon: Settings }] : [])
  ];

  // Auto-scroll to active item on mobile
  useEffect(() => {
    const activeIndex = mobileNavItems.findIndex(item => isActive(item.href));
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
    <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-between items-center px-8 py-4">
        <Link
          to="/"
          className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors"
        >
          Shiver
        </Link>

        <div className="flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationSections.map((section) => (
                <NavigationMenuItem key={section.title}>
                  <NavigationMenuTrigger className="mono-font">
                    {section.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-80">
                      <div className="grid gap-3">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActive(item.href) && "bg-accent/50"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4 text-accent" />
                                  <div className="text-sm font-medium leading-none mono-font">
                                    {item.title}
                                  </div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          );
                        })}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              
              {/* Quick Links */}
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavigationMenuItem key={link.href}>
                    <Link to={link.href}>
                      <Button 
                        variant={isActive(link.href) ? "secondary" : "ghost"} 
                        size="sm" 
                        className="mono-font gap-2 hover-lift button-hover transition-all duration-200"
                      >
                        <Icon className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                        {link.title}
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Button */}
          <Link to="/auth">
            <Button variant="outline" size="sm" className="mono-font gap-2 hover-lift button-hover transition-all duration-200">
              <User className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          <Link
            to="/"
            className="mono-font font-bold text-lg tracking-wide text-foreground hover:text-accent transition-colors"
          >
            Shiver
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/auth" className="text-sm mono-font text-accent hover:underline">
              Sign In
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation */}
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
          {mobileNavItems.map((item) => {
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
                onClick={() => setIsMobileMenuOpen(false)}
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

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-6">
                {navigationSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 mono-font uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <div className="grid gap-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-accent/10",
                              isActive(item.href) && "bg-accent/20"
                            )}
                          >
                            <Icon className="w-5 h-5 text-accent mt-0.5" />
                            <div>
                              <div className="font-medium mono-font text-foreground">
                                {item.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UnifiedNavigation;