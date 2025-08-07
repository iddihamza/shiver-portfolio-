import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mobile-optimized layout wrapper
interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  padding = 'md'
}) => {
  const isMobile = useIsMobile();
  
  const paddingClasses = {
    none: '',
    sm: isMobile ? 'p-2' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-6' : 'p-8'
  };

  return (
    <div className={cn(
      'w-full',
      paddingClasses[padding],
      isMobile && 'mobile-layout',
      className
    )}>
      {children}
    </div>
  );
};

// Responsive grid that adapts to mobile
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridCols = `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

  return (
    <div className={cn(
      'grid',
      gridCols,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Touch-friendly button component
interface TouchButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled
}) => {
  const isMobile = useIsMobile();
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  const sizeClasses = {
    sm: isMobile ? 'h-11 px-4 text-sm' : 'h-9 px-3 text-sm',
    md: isMobile ? 'h-12 px-6 text-base' : 'h-10 px-4 text-sm',
    lg: isMobile ? 'h-14 px-8 text-lg' : 'h-11 px-8 text-base'
  };

  return (
    <motion.button
      className={cn(
        'touch-friendly inline-flex items-center justify-center',
        'rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

// Mobile-optimized card stack
interface CardStackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const CardStack: React.FC<CardStackProps> = ({
  children,
  direction = 'horizontal',
  className
}) => {
  const isMobile = useIsMobile();
  
  // Force vertical on mobile for better UX
  const effectiveDirection = isMobile ? 'vertical' : direction;
  
  const directionClasses = {
    horizontal: 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4',
    vertical: 'space-y-4'
  };

  return (
    <div className={cn(
      directionClasses[effectiveDirection],
      className
    )}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          className={cn(
            effectiveDirection === 'horizontal' && 'flex-shrink-0 snap-center',
            'w-full'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// Swipe-friendly carousel for mobile
interface SwipeCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export const SwipeCarousel: React.FC<SwipeCarouselProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'overflow-x-auto scroll-smooth',
      'scrollbar-hide snap-x snap-mandatory',
      'flex gap-4 pb-4',
      className
    )}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="flex-shrink-0 snap-center"
        >
          {child}
        </div>
      ))}
    </div>
  );
};