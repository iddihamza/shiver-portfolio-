import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  CreditCard,
  Play,
  FolderOpen,
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MainNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      title: 'Explore',
      items: [
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
          title: 'Codex',
          href: '/codex',
          description: 'Lore and glossary',
          icon: FileText
        }
      ]
    },
    {
      title: 'Story',
      items: [
        {
          title: 'Chapters',
          href: '/portfolio/stories',
          description: 'Read the story chapters',
          icon: BookOpen
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
        },
        {
          title: 'Interactive',
          href: '/play',
          description: 'Choice-driven narratives',
          icon: Play
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

  const quickLinks = [
    { title: 'Cards', href: '/cards', icon: CreditCard },
    { title: 'Timeline', href: '/timeline', icon: Clock },
    { title: 'Codex', href: '/codex', icon: FileText }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6">
        <NavigationMenu>
          <NavigationMenuList>
            {navigationItems.map((section) => (
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
                      className="mono-font gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {link.title}
                    </Button>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden">
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-50">
          <div className="container mx-auto px-6 py-6">
            <div className="space-y-6">
              {navigationItems.map((section) => (
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
              
              {/* Quick Links for Mobile */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 mono-font uppercase tracking-wide">
                  Quick Access
                </h3>
                <div className="grid gap-2">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent/10",
                          isActive(link.href) && "bg-accent/20"
                        )}
                      >
                        <Icon className="w-5 h-5 text-accent" />
                        <span className="font-medium mono-font text-foreground">
                          {link.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavigation;